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

export function ResultsTable({ nonFollowers }: ResultsTableProps) {
  const [search, setSearch] = useState("")
  const [copied, setCopied] = useState(false)

  const filtered = useMemo(
    () =>
      nonFollowers.filter((nf) =>
        nf.username.toLowerCase().includes(search.toLowerCase())
      ),
    [nonFollowers, search]
  )

  const copyAll = async () => {
    const text = nonFollowers.map((nf) => nf.username).join("\n")
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
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
              <TableHead className="text-gray-400 font-semibold text-[11px] uppercase tracking-wider w-12">#</TableHead>
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
                    {i + 1}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#833ab4] via-[#e1306c] to-[#fcaf45] flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                        {nf.username[0].toUpperCase()}
                      </div>
                      <span className="font-medium text-[13px] text-gray-800">{nf.username}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-400 text-[12px] hidden sm:table-cell">
                    {nf.followedSince ? formatDate(nf.followedSince) : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <a
                      href={`https://instagram.com/${nf.username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-semibold text-[#e1306c] hover:text-[#c13584] transition-colors"
                    >
                      Ver →
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
