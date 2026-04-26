"use client"

import { useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { NonFollower } from "@/lib/types"

type ResultsTableProps = {
  nonFollowers: NonFollower[]
}

function formatDate(timestamp: number) {
  return new Date(timestamp * 1000).toLocaleDateString("pt-BR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

type SortMode = "alpha" | "oldest" | "newest"

const TWO_YEARS_AGO = Date.now() / 1000 - 2 * 365 * 24 * 3600

export function ResultsTable({ nonFollowers }: ResultsTableProps) {
  const [search, setSearch] = useState("")
  const [copied, setCopied] = useState(false)
  const [sort, setSort] = useState<SortMode>("newest")

  const filtered = useMemo(() => {
    const base = nonFollowers.filter((nf) =>
      nf.username.toLowerCase().includes(search.toLowerCase())
    )
    if (sort === "oldest") return [...base].sort((a, b) => (a.followedSince ?? 0) - (b.followedSince ?? 0))
    if (sort === "newest") return [...base].sort((a, b) => (b.followedSince ?? 0) - (a.followedSince ?? 0))
    return [...base].sort((a, b) => a.username.localeCompare(b.username))
  }, [nonFollowers, search, sort])

  const [selectedMap, setSelectedMap] = useState<Record<string, boolean>>({})

  const allSelected = filtered.length > 0 && filtered.every((nf) => !!selectedMap[nf.username])

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedMap({})
    } else {
      const map: Record<string, boolean> = {}
      filtered.forEach((nf) => { map[nf.username] = true })
      setSelectedMap(map)
    }
  }

  const toggleSelect = (username: string) => {
    setSelectedMap((prev) => ({ ...prev, [username]: !prev[username] }))
  }

  const copyAll = async () => {
    const selected = Object.keys(selectedMap).filter((k) => selectedMap[k])
    const list = selected.length ? selected : nonFollowers.map((nf) => nf.username)
    const text = list.join("\n")
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="relative flex-1 max-w-xs">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <Input
            placeholder="Buscar username..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-sm bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-400 rounded-xl focus-visible:ring-pink-400"
          />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortMode)}
            className="h-9 text-xs font-medium px-3 pr-7 rounded-xl border border-gray-200 bg-gray-50 text-gray-600 cursor-pointer appearance-none focus:outline-none focus:ring-2 focus:ring-pink-400"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 8px center" }}
          >
            <option value="newest">Mais recentes primeiro</option>
            <option value="oldest">Mais antigos primeiro</option>
            <option value="alpha">Alfabético</option>
          </select>
        </div>
        <div className="flex items-center gap-3">
          {search && (
            <span className="text-xs text-gray-400">
              {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
            </span>
          )}
          <button
            onClick={copyAll}
            className="text-xs font-semibold px-3.5 py-2 rounded-xl border border-gray-200 text-gray-600 hover:border-[#e1306c]/40 hover:text-[#e1306c] hover:bg-[#fdf4f7] transition-all duration-150"
          >
            {copied ? (
              <span className="flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Copiado!
              </span>
            ) : "Copiar todos"}
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-100 overflow-hidden bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-100 bg-gray-50/80 hover:bg-gray-50/80">
              <TableHead className="text-gray-400 font-semibold text-[11px] uppercase tracking-wider w-12">
                <input
                  type="checkbox"
                  aria-label="Selecionar todos"
                  checked={allSelected}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 rounded border-gray-200"
                />
              </TableHead>
              <TableHead className="text-gray-400 font-semibold text-[11px] uppercase tracking-wider">Username</TableHead>
              <TableHead className="text-gray-400 font-semibold text-[11px] uppercase tracking-wider hidden sm:table-cell">
                Seguindo desde
              </TableHead>
              <TableHead className="text-gray-400 font-semibold text-[11px] uppercase tracking-wider text-right">Perfil</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-gray-400 py-10 text-sm">
                  Nenhum resultado encontrado.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((nf, i) => (
                <TableRow
                  key={nf.username}
                  className="border-gray-100 hover:bg-[#fdf4f7]/60 transition-colors"
                >
                  <TableCell className="text-gray-300 text-xs tabular-nums">
                    <input
                      type="checkbox"
                      aria-label={`Selecionar ${nf.username}`}
                      checked={!!selectedMap[nf.username]}
                      onChange={() => toggleSelect(nf.username)}
                      className="w-5 h-5 rounded border-gray-200"
                    />
                  </TableCell>
                  <TableCell>
                    <a
                      href={`https://instagram.com/${nf.username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-300"
                    >
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#833ab4] via-[#e1306c] to-[#fcaf45] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        {nf.username[0].toUpperCase()}
                      </div>
                      <span className="font-semibold text-[15px] text-gray-900">{nf.username}</span>
                    </a>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <div className="flex items-center gap-1.5">
                      <span className="text-gray-400 text-[12px]">
                        {nf.followedSince ? formatDate(nf.followedSince) : "—"}
                      </span>
                      {!!nf.followedSince && nf.followedSince < TWO_YEARS_AGO && (
                        <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-600">antigo</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <a
                      href={`https://instagram.com/${nf.username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[12px] font-semibold text-white shadow-sm"
                      style={{ background: "linear-gradient(135deg, #833ab4, #e1306c, #f77737)" }}
                    >
                      Ver perfil
                    </a>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
