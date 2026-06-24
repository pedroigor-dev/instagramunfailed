"use client"

import { useCallback, useState } from "react"
import { strFromU8, unzipSync } from "fflate"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { UploadZone } from "@/components/upload-zone"
import { StatsCards } from "@/components/stats-cards"
import { ResultsTable } from "@/components/results-table"
import { parseFollowersMerged, parseFollowing, analyze } from "@/lib/instagram"
import type { AnalysisResult } from "@/lib/types"

type InstagramPayload = {
  followersDataArray: unknown[]
  followingData: unknown
}

function parseJson(raw: string, source: string): unknown {
  try {
    return JSON.parse(raw)
  } catch {
    throw new Error(`"${source}" não é um JSON válido.`)
  }
}

function isFollowersPath(path: string) {
  return /(^|\/)followers(?:_\d+)?\.json$/i.test(path)
}

function isFollowingPath(path: string) {
  return /(^|\/)following\.json$/i.test(path)
}

function isNeededInstagramPath(path: string) {
  const normalizedPath = path.replace(/\\/g, "/")
  return isFollowersPath(normalizedPath) || isFollowingPath(normalizedPath)
}

function formatFileSize(size: number) {
  if (size < 1024 * 1024) return `${Math.max(1, Math.round(size / 1024))} KB`
  return `${(size / 1024 / 1024).toFixed(size < 10 * 1024 * 1024 ? 1 : 0)} MB`
}

export function InstagramAnalyzer() {
  const [archiveFiles, setArchiveFiles] = useState<File[]>([])
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
          resolve(parseJson(e.target?.result as string, file.name))
        } catch (err) {
          reject(err)
        }
      }
      reader.onerror = () => reject(new Error(`Erro ao ler "${file.name}".`))
      reader.readAsText(file)
    })

  const readArchive = async (file: File): Promise<InstagramPayload> => {
    const buffer = await file.arrayBuffer()
    const entries = unzipSync(new Uint8Array(buffer), {
      filter: (entry) => isNeededInstagramPath(entry.name),
    })
    const followersDataArray: unknown[] = []
    let followingData: unknown | null = null

    for (const [path, bytes] of Object.entries(entries)) {
      const normalizedPath = path.replace(/\\/g, "/")
      if (!normalizedPath.toLowerCase().endsWith(".json")) continue

      if (isFollowersPath(normalizedPath)) {
        followersDataArray.push(parseJson(strFromU8(bytes), normalizedPath))
      }

      if (isFollowingPath(normalizedPath)) {
        followingData = parseJson(strFromU8(bytes), normalizedPath)
      }
    }

    if (!followersDataArray.length || !followingData) {
      throw new Error("Não encontrei followers_*.json e following.json dentro do ZIP. Verifique se é o export completo do Instagram em formato JSON.")
    }

    return { followersDataArray, followingData }
  }

  const handleAnalyze = useCallback(async () => {
    if (!archiveFiles.length && (!followersFiles.length || !followingFiles.length)) return

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const { followersDataArray, followingData } = archiveFiles.length
        ? await readArchive(archiveFiles[0])
        : {
            followersDataArray: await Promise.all(followersFiles.map(readJson)),
            followingData: await readJson(followingFiles[0]),
          }

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
  }, [archiveFiles, followersFiles, followingFiles])

  const handleReset = () => {
    setArchiveFiles([])
    setFollowersFiles([])
    setFollowingFiles([])
    setResult(null)
    setError(null)
  }

  const canAnalyze = (archiveFiles.length > 0 || (followersFiles.length > 0 && followingFiles.length > 0)) && !loading

  return (
    <div className="space-y-5">
      <UploadZone
        label="ZIP do Instagram"
        hint="Pode enviar o ZIP completo, mesmo se exportou tudo"
        files={archiveFiles}
        onFiles={setArchiveFiles}
        accept=".zip"
      />

      <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 px-4 py-3 text-left">
        <p className="text-[12px] font-semibold text-emerald-700">
          Caminho mais fácil: envie o ZIP aqui. O app procura sozinho só followers e following.
        </p>
        <p className="mt-1 text-[11px] leading-relaxed text-emerald-600/80">
          Se a pessoa exportou todos os dados sem querer, tudo bem. Pode demorar um pouco mais, mas nada é enviado para servidor.
          {archiveFiles[0] ? ` Arquivo selecionado: ${formatFileSize(archiveFiles[0].size)}.` : ""}
        </p>
      </div>

      <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-wider text-gray-300">
        <span className="h-px flex-1 bg-gray-100" />
        ou envie manualmente
        <span className="h-px flex-1 bg-gray-100" />
      </div>

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
          Dica: o Instagram pode dividir seguidores em vários arquivos (followers_1, followers_2...). Adicione todos para resultado completo.
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
