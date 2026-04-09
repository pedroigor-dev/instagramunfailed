"use client"

import { useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
      <div className="flex items-center justify-between gap-4">
        <Input
          placeholder="Buscar username..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs bg-white/5 border-white/20 text-white placeholder:text-white/40"
        />
        <div className="flex items-center gap-3">
          {search && (
            <span className="text-sm text-white/50">
              {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
            </span>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={copyAll}
            className="border-white/20 text-white hover:bg-white/10"
          >
            {copied ? "✓ Copiado!" : "Copiar todos"}
          </Button>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-white/60 font-medium">#</TableHead>
              <TableHead className="text-white/60 font-medium">Username</TableHead>
              <TableHead className="text-white/60 font-medium hidden sm:table-cell">
                Seguindo desde
              </TableHead>
              <TableHead className="text-white/60 font-medium text-right">Perfil</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-white/40 py-8">
                  Nenhum resultado encontrado.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((nf, i) => (
                <TableRow
                  key={nf.username}
                  className="border-white/10 hover:bg-white/5 transition-colors"
                >
                  <TableCell className="text-white/30 text-sm tabular-nums w-12">
                    {i + 1}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white">{nf.username}</span>
                      <Badge
                        variant="outline"
                        className="border-rose-500/40 text-rose-400 text-[10px] hidden sm:flex"
                      >
                        não segue
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-white/50 text-sm hidden sm:table-cell">
                    {nf.followedSince ? formatDate(nf.followedSince) : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <a
                      href={`https://instagram.com/${nf.username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-pink-400 hover:text-pink-300 hover:underline transition-colors"
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
