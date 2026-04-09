"use client"

import { useCallback, useRef, useState } from "react"
import { cn } from "@/lib/utils"

type UploadZoneProps = {
  label: string
  hint: string
  files: File[]
  onFiles: (files: File[]) => void
  accept?: string
  multiple?: boolean
}

export function UploadZone({ label, hint, files, onFiles, accept = ".json", multiple = false }: UploadZoneProps) {
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const mergeFiles = useCallback(
    (incoming: FileList | File[]) => {
      const arr = Array.from(incoming)
      if (multiple) {
        const existing = files.map((f) => f.name)
        const merged = [...files, ...arr.filter((f) => !existing.includes(f.name))]
        onFiles(merged)
      } else {
        onFiles([arr[0]])
      }
    },
    [files, multiple, onFiles]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragging(false)
      if (e.dataTransfer.files.length) mergeFiles(e.dataTransfer.files)
    },
    [mergeFiles]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => setDragging(false), [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) mergeFiles(e.target.files)
    e.target.value = ""
  }

  const removeFile = (name: string, e: React.MouseEvent) => {
    e.stopPropagation()
    onFiles(files.filter((f) => f.name !== name))
  }

  const hasFiles = files.length > 0

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => e.key === "Enter" || e.key === " " ? inputRef.current?.click() : undefined}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={cn(
        "relative flex flex-col items-center justify-center w-full rounded-2xl border-2 border-dashed p-7 transition-all duration-200 cursor-pointer group",
        dragging
          ? "border-pink-400 bg-pink-50 scale-[1.02]"
          : hasFiles
          ? "border-emerald-400/60 bg-emerald-50/60"
          : "border-gray-200 hover:border-[#e1306c]/40 hover:bg-[#fdf4f7]/60"
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={handleChange}
      />

      <div
        className={cn(
          "w-11 h-11 rounded-2xl flex items-center justify-center mb-3 transition-all duration-200",
          hasFiles ? "bg-emerald-100" : "bg-gray-100 group-hover:scale-110"
        )}
        style={dragging ? { background: "linear-gradient(135deg,#833ab4,#e1306c)" } : undefined}
      >
        {hasFiles ? (
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

      {hasFiles ? (
        <div className="mt-2 flex flex-col items-center gap-1 w-full" onClick={(e) => e.stopPropagation()}>
          {files.map((f) => (
            <div key={f.name} className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-medium">
              <span className="truncate max-w-[160px]">{f.name}</span>
              <button
                onClick={(e) => removeFile(f.name, e)}
                className="text-gray-400 hover:text-red-400 transition-colors flex-shrink-0"
                aria-label="Remover"
              >
                ✕
              </button>
            </div>
          ))}
          {multiple && (
            <span className="text-[10px] text-gray-400 mt-1">clique para adicionar mais</span>
          )}
        </div>
      ) : (
        <p className="text-[11px] mt-1 text-gray-400">{hint}</p>
)}
    </div>
  )
}

