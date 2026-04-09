import { NextRequest } from "next/server"

const HF_MODEL = "meta-llama/Llama-3.1-8B-Instruct:cerebras"
const HF_URL = "https://router.huggingface.co/v1/chat/completions"

export async function POST(request: NextRequest) {
  const apiKey = process.env.HUGGINGFACE_API_KEY
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "HUGGINGFACE_API_KEY não configurada." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }

  const { followersCount, followingCount, nonFollowersCount, sampleUsernames } =
    await request.json()

  const percentage = followingCount > 0
    ? ((nonFollowersCount / followingCount) * 100).toFixed(1)
    : "0"

  const sampleList = (sampleUsernames as string[]).slice(0, 8).join(", ")

  const prompt = `Você é um analista de redes sociais objetivo e direto. Analise os dados abaixo de um perfil do Instagram e escreva um diagnóstico em 2-3 frases em português do Brasil.
Regras: fale na terceira pessoa sobre o dono do perfil ("esse perfil", "você segue", "vale considerar"), seja honesto e prático, sem drama. Não use primeira pessoa, não invente histórias.

Dados do perfil:
- Seguidores: ${followersCount}
- Seguindo: ${followingCount}
- Não seguem de volta: ${nonFollowersCount} (${percentage}% de quem você segue)
- Exemplos de quem não segue de volta: ${sampleList}

Diagnóstico:`

  const hfResponse = await fetch(HF_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: HF_MODEL,
      messages: [{ role: "user", content: prompt }],
      max_tokens: 300,
      stream: true,
    }),
  })

  if (!hfResponse.ok) {
    const err = await hfResponse.text()
    return new Response(JSON.stringify({ error: `Erro HuggingFace: ${err}` }), {
      status: hfResponse.status,
      headers: { "Content-Type": "application/json" },
    })
  }

  const encoder = new TextEncoder()
  const decoder = new TextDecoder()

  const stream = new ReadableStream({
    async start(controller) {
      const reader = hfResponse.body!.getReader()
      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value, { stream: true })
          const lines = chunk.split("\n").filter((l) => l.startsWith("data: "))

          for (const line of lines) {
            const data = line.slice(6)
            if (data === "[DONE]") {
              controller.close()
              return
            }
            try {
              const parsed = JSON.parse(data)
              const token = parsed.choices?.[0]?.delta?.content
              if (token) {
                controller.enqueue(encoder.encode(token))
              }
            } catch {
              // skip malformed chunks
            }
          }
        }
      } finally {
        reader.releaseLock()
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
    },
  })
}
