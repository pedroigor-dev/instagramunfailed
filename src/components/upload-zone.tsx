"use client"

import { useCallback, useRef, useState } from "react"
import { cn } from "@/lib/utils"

type UploadZoneProps = {
  label: string
  hint: string
  file: File | null
  onFile: (file: File) => void
  accept?: string
}

export function UploadZone({ label, hint, file, onFile, accept = ".json" }: UploadZoneProps) {
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragging(false)
      const dropped = e.dataTransfer.files[0]
      if (dropped) onFile(dropped)
    },
    [onFile]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => setDragging(false), [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0]
    if (picked) onFile(picked)
  }

  return (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={cn(
        "relative flex flex-col items-center justify-center w-full rounded-2xl border-2 border-dashed p-8 transition-all cursor-pointer text-left",
        dragging
          ? "border-pink-500 bg-pink-500/10 scale-[1.02]"
          : file
          ? "border-emerald-500/60 bg-emerald-500/5"
          : "border-white/20 hover:border-white/40 hover:bg-white/5"
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleChange}
      />

      <div className="mb-3 text-3xl">{file ? "✅" : "📂"}</div>

      <p className="font-semibold text-sm text-white">{label}</p>
      <p className="text-xs text-white/50 mt-1">
        {file ? (
          <span className="text-emerald-400">{file.name}</span>
        ) : (
          hint
        )}
      </p>
    </button>
  )
}
