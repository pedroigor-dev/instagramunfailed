"use client"

import { useCallback, useState } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
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

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          <Alert className="border-red-500/30 bg-red-500/10">
            <AlertDescription className="text-red-400">{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex gap-3">
          <Button
            onClick={handleAnalyze}
            disabled={!followersFile || !followingFile || loading}
            className="flex-1 sm:flex-none bg-gradient-to-r from-pink-600 via-purple-600 to-orange-500 hover:from-pink-500 hover:via-purple-500 hover:to-orange-400 text-white border-0 font-semibold h-11 px-8 disabled:opacity-40"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="inline-block w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                Analisando...
              </span>
            ) : (
              "Analisar dados"
            )}
          </Button>

          {result && (
            <Button
              variant="outline"
              onClick={handleReset}
              className="border-white/20 text-white/60 hover:text-white hover:bg-white/10"
            >
              Reiniciar
            </Button>
          )}
        </div>
      </div>

      {result && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Separator className="bg-white/10" />

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
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold text-white">Quem não te segue de volta</h2>
              <span className="text-sm text-white/40 tabular-nums">
                ({result.nonFollowersCount})
              </span>
            </div>
            <ResultsTable nonFollowers={result.nonFollowers} />
          </div>
        </div>
      )}
    </div>
  )
}
