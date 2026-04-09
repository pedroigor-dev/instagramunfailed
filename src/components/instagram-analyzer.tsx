"use client"

import { useCallback, useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { UploadZone } from "@/components/upload-zone"
import { StatsCards } from "@/components/stats-cards"
import { ResultsTable } from "@/components/results-table"
import { AiInsight } from "@/components/ai-insight"
import { parseFollowers, parseFollowing, analyze } from "@/lib/instagram"
import type { AnalysisResult } from "@/lib/types"

export function InstagramAnalyzer() {
  const [followersFile, setFollowersFile] = useState<File | null>(null)
  const [followingFile, setFollowingFile] = useState<File | null>(null)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const readJson = (file: File): Promise<unknown> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          resolve(JSON.parse(e.target?.result as string))
        } catch {
          reject(new Error(`Arquivo "${file.name}" não é um JSON válido.`))
        }
      }
      reader.onerror = () => reject(new Error(`Erro ao ler "${file.name}".`))
      reader.readAsText(file)
    })

  const handleAnalyze = useCallback(async () => {
    if (!followersFile || !followingFile) return

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const [followersData, followingData] = await Promise.all([
        readJson(followersFile),
        readJson(followingFile),
      ])

      const followers = parseFollowers(followersData)
      const following = parseFollowing(followingData)
      const analysis = analyze(followers, following)

      setResult(analysis)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao processar os arquivos.")
    } finally {
      setLoading(false)
    }
  }, [followersFile, followingFile])

  const handleReset = () => {
    setFollowersFile(null)
    setFollowingFile(null)
    setResult(null)
    setError(null)
  }

  const canAnalyze = !!followersFile && !!followingFile && !loading

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <UploadZone
          label="followers_1.json"
          hint="Arraste ou clique para selecionar"
          file={followersFile}
          onFile={setFollowersFile}
        />
        <UploadZone
          label="following.json"
          hint="Arraste ou clique para selecionar"
          file={followingFile}
          onFile={setFollowingFile}
        />
      </div>

      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertDescription className="text-red-500 text-sm">{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex gap-2.5">
        <button
          onClick={handleAnalyze}
          disabled={!canAnalyze}
          className="flex-1 sm:flex-none h-11 px-8 rounded-2xl text-white text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-100 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:hover:scale-100"
          style={{
            background: canAnalyze
              ? "linear-gradient(135deg, #833ab4 0%, #c13584 35%, #e1306c 60%, #f77737 90%)"
              : "linear-gradient(135deg, #c4b5d4 0%, #d4a0b5 50%, #d4a0a0 100%)",
          }}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="inline-block w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
              Analisando...
            </span>
          ) : (
            "Analisar dados"
          )}
        </button>

        {result && (
          <button
            onClick={handleReset}
            className="h-11 px-5 rounded-2xl text-sm font-medium text-gray-500 border border-gray-200 hover:border-gray-300 hover:text-gray-700 transition-all duration-150"
          >
            Reiniciar
          </button>
        )}
      </div>

      {result && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-400">
          <Separator className="bg-gray-100" />

          <StatsCards
            followersCount={result.followersCount}
            followingCount={result.followingCount}
            nonFollowersCount={result.nonFollowersCount}
          />

          <AiInsight
            followersCount={result.followersCount}
            followingCount={result.followingCount}
            nonFollowersCount={result.nonFollowersCount}
            nonFollowers={result.nonFollowers}
          />

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <h2 className="text-[15px] font-semibold text-gray-800">
                Quem não te segue de volta
              </h2>
              <span className="text-[12px] font-medium text-gray-400 bg-gray-100 rounded-full px-2.5 py-0.5 tabular-nums">
                {result.nonFollowersCount}
              </span>
            </div>
            <ResultsTable nonFollowers={result.nonFollowers} />
          </div>
        </div>
      )}
    </div>
  )
}
