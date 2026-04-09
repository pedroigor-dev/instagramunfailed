"use client"

import { useCallback, useState } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
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
    <div className="rounded-2xl border border-purple-500/20 bg-purple-500/5 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">🤖</span>
          <div>
            <p className="font-semibold text-white text-sm">Análise com IA</p>
            <p className="text-xs text-white/50">Powered by Mistral 7B via HuggingFace</p>
          </div>
        </div>
        <Button
          size="sm"
          onClick={fetchInsight}
          disabled={loading}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white border-0"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full border-2 border-white/40 border-t-white animate-spin" />
              Gerando...
            </span>
          ) : requested ? (
            "Regenerar"
          ) : (
            "Gerar insight"
          )}
        </Button>
      </div>

      {error && (
        <Alert className="border-red-500/30 bg-red-500/10">
          <AlertDescription className="text-red-400 text-sm">{error}</AlertDescription>
        </Alert>
      )}

      {insight && (
        <p className="text-white/80 text-sm leading-relaxed italic border-l-2 border-purple-500/50 pl-4">
          {insight}
        </p>
      )}

      {!insight && !error && !loading && (
        <p className="text-white/30 text-sm">
          Clique em &quot;Gerar insight&quot; para receber uma análise personalizada dos seus dados.
        </p>
      )}
    </div>
  )
}
