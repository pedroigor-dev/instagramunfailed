import type { NextRequest } from "next/server"

const HF_MODEL = "meta-llama/Llama-3.1-8B-Instruct:cerebras"
const HF_URL = "https://router.huggingface.co/v1/chat/completions"

function jsonError(error: string, status: number) {
  return Response.json({ error }, { status })
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.HUGGINGFACE_API_KEY
  if (!apiKey) {
    return jsonError("HUGGINGFACE_API_KEY não configurada.", 500)
  }

  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return jsonError("JSON inválido.", 400)
  }

  const body = payload as Record<string, unknown>
  const { followersCount, followingCount, nonFollowersCount } = body

  if (
    !isFiniteNumber(followersCount) ||
    !isFiniteNumber(followingCount) ||
    !isFiniteNumber(nonFollowersCount)
  ) {
    return jsonError("Dados de análise inválidos.", 400)
  }

  const sampleUsernames = Array.isArray(body.sampleUsernames)
    ? body.sampleUsernames
        .filter((username): username is string => typeof username === "string")
        .slice(0, 8)
    : []

  const percentage = followingCount > 0
    ? ((nonFollowersCount / followingCount) * 100).toFixed(1)
    : "0"

  const sampleList = sampleUsernames.join(", ")

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
    return jsonError(`Erro HuggingFace: ${err}`, hfResponse.status)
  }

  if (!hfResponse.body) {
    return jsonError("A Hugging Face retornou uma resposta vazia.", 502)
  }
  const hfBody = hfResponse.body

  const encoder = new TextEncoder()
  const decoder = new TextDecoder()

  const stream = new ReadableStream({
    async start(controller) {
      const reader = hfBody.getReader()
      let buffer = ""
      let closed = false

      const close = () => {
        if (!closed) {
          closed = true
          controller.close()
        }
      }

      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split("\n")
          buffer = lines.pop() ?? ""

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue
            const data = line.slice(6).trim()
            if (data === "[DONE]") {
              close()
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
        close()
      } finally {
        reader.releaseLock()
        close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
    },
  })
}
