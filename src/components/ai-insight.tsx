"use client"

import { useCallback, useState } from "react"
import type { AnalysisResult } from "@/lib/types"

type AiInsightProps = Pick<
  AnalysisResult,
  "followersCount" | "followingCount" | "nonFollowersCount" | "nonFollowers"
>

export function AiInsight({
  followersCount,
  followingCount,
  nonFollowersCount,
  nonFollowers,
}: AiInsightProps) {
  const [insight, setInsight] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [requested, setRequested] = useState(false)

  const fetchInsight = useCallback(async () => {
    setLoading(true)
    setInsight("")
    setError(null)
    setRequested(true)

    try {
      const sampleUsernames = nonFollowers.slice(0, 8).map((nf) => nf.username)

      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          followersCount,
          followingCount,
          nonFollowersCount,
          sampleUsernames,
        }),
      })

      if (!res.ok) {
        const body = await res.json()
        throw new Error(body.error ?? "Erro desconhecido.")
      }

      const reader = res.body!.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        setInsight((prev) => prev + decoder.decode(value, { stream: true }))
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao gerar insight.")
    } finally {
      setLoading(false)
    }
  }, [followersCount, followingCount, nonFollowersCount, nonFollowers])

  return (
    <div className="rounded-2xl border border-[#e1306c]/15 bg-gradient-to-br from-[#fdf4f7] to-[#f9f0ff] p-5">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm flex-shrink-0 shadow-sm"
            style={{ background: "linear-gradient(135deg, #833ab4, #e1306c, #f77737)" }}
          >
            ✨
          </div>
          <div>
            <p className="font-semibold text-gray-800 text-sm">Análise com IA</p>
            <p className="text-[11px] text-gray-400">Mistral 7B · HuggingFace</p>
          </div>
        </div>
        <button
          onClick={fetchInsight}
          disabled={loading}
          className="text-[12px] font-semibold px-4 py-2 rounded-xl text-white shadow-sm transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed hover:opacity-90 active:scale-95"
          style={{ background: "linear-gradient(135deg, #833ab4, #e1306c, #f77737)" }}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full border-2 border-white/40 border-t-white animate-spin" />
              Gerando...
            </span>
          ) : requested ? "Regenerar" : "Gerar insight"}
        </button>
      </div>

      {error && (
        <div className="mt-4 rounded-xl bg-red-50 border border-red-100 px-4 py-3">
          <p className="text-red-500 text-xs">{error}</p>
        </div>
      )}

      {insight && (
        <p className="mt-4 text-gray-700 text-[13px] leading-relaxed italic border-l-2 pl-4" style={{ borderColor: "#e1306c" }}>
          {insight}
        </p>
      )}

      {!insight && !error && !loading && (
        <p className="mt-4 text-gray-400 text-[12px]">
          Clique em &quot;Gerar insight&quot; para receber uma análise personalizada
          dos seus dados pelo Mistral 7B.
        </p>
      )}
    </div>
  )
}
