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
        "relative flex flex-col items-center justify-center w-full rounded-2xl border-2 border-dashed p-7 transition-all duration-200 cursor-pointer group",
        dragging
          ? "border-pink-400 bg-pink-50 scale-[1.02]"
          : file
          ? "border-emerald-400/60 bg-emerald-50/60"
          : "border-gray-200 hover:border-[#e1306c]/40 hover:bg-[#fdf4f7]/60"
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleChange}
      />

      <div
        className={cn(
          "w-11 h-11 rounded-2xl flex items-center justify-center mb-3 transition-all duration-200",
          file
            ? "bg-emerald-100"
            : "bg-gray-100 group-hover:scale-110"
        )}
        style={
          dragging
            ? { background: "linear-gradient(135deg,#833ab4,#e1306c)" }
            : undefined
        }
      >
        {file ? (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke={dragging ? "white" : "#9ca3af"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        )}
      </div>

      <p className="font-semibold text-[13px] text-gray-700">{label}</p>
      <p className="text-[11px] mt-1">
        {file ? (
          <span className="text-emerald-500 font-medium">{file.name}</span>
        ) : (
          <span className="text-gray-400">{hint}</span>
        )}
      </p>
    </button>
  )
}
