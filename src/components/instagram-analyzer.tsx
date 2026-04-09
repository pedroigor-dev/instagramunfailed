"use client"

import { useCallback, useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { UploadZone } from "@/components/upload-zone"
import { StatsCards } from "@/components/stats-cards"
import { ResultsTable } from "@/components/results-table"
import { AiInsight } from "@/components/ai-insight"
import { parseFollowersMerged, parseFollowing, analyze } from "@/lib/instagram"
import type { AnalysisResult } from "@/lib/types"

export function InstagramAnalyzer() {
  const [followersFiles, setFollowersFiles] = useState<File[]>([])
  const [followingFiles, setFollowingFiles] = useState<File[]>([])
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
          reject(new Error(`"${file.name}" não é um JSON válido.`))
        }
      }
      reader.onerror = () => reject(new Error(`Erro ao ler "${file.name}".`))
      reader.readAsText(file)
    })

  const handleAnalyze = useCallback(async () => {
    if (!followersFiles.length || !followingFiles.length) return

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const [followersDataArray, followingData] = await Promise.all([
        Promise.all(followersFiles.map(readJson)),
        readJson(followingFiles[0]),
      ])

      const followers = parseFollowersMerged(followersDataArray)
      const following = parseFollowing(followingData)

      if (followers.size === 0) throw new Error("Nenhum seguidor encontrado nos arquivos enviados. Verifique se são os arquivos corretos.")
      if (following.size === 0) throw new Error("Nenhum dado de 'seguindo' encontrado. Verifique se o arquivo following.json está correto.")

      setResult(analyze(followers, following))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao processar os arquivos.")
    } finally {
      setLoading(false)
    }
  }, [followersFiles, followingFiles])

  const handleReset = () => {
    setFollowersFiles([])
    setFollowingFiles([])
    setResult(null)
    setError(null)
  }

  const canAnalyze = followersFiles.length > 0 && followingFiles.length > 0 && !loading

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <UploadZone
          label="followers_1.json"
          hint="Arraste ou clique para selecionar"
          files={followersFiles}
          onFiles={setFollowersFiles}
          multiple
        />
        <UploadZone
          label="following.json"
          hint="Arraste ou clique para selecionar"
          files={followingFiles}
          onFiles={setFollowingFiles}
        />
      </div>

      {followersFiles.length > 0 && (
        <p className="text-[11px] text-gray-400 -mt-2 px-1">
          💡 Instagram divide seguidores em vários arquivos (followers_1, followers_2…). Adicione todos para resultado completo.
        </p>
      )}

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

      {result && result.followersCount < result.followingCount * 0.85 && (
        <Alert className="border-amber-200 bg-amber-50">
          <AlertDescription className="text-amber-700 text-sm leading-relaxed">
            ⚠️ <strong>Atenção: o export do Instagram está incompleto.</strong> O arquivo exportado contém apenas {result.followersCount} seguidores, mas você está seguindo {result.followingCount} contas. Isso é uma limitação conhecida do Instagram — para contas com muitos seguidores, o export é truncado automaticamente e não há como contornar. Os resultados abaixo refletem apenas os dados disponíveis no arquivo.
          </AlertDescription>
        </Alert>
      )}

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
