"use client"

import { Monitor, Play, ShieldCheck, Smartphone } from "lucide-react"
import { useState } from "react"
import { celebrateFromEvent } from "@/lib/celebrate"

const guides = {
  desktop: {
    label: "PC",
    title: "Tutorial no computador",
    description: "O caminho mais completo para exportar pelo navegador.",
    embed: "https://www.youtube-nocookie.com/embed/OWQd9EbZINk",
    icon: Monitor,
  },
  mobile: {
    label: "Celular",
    title: "Tutorial no celular",
    description: "Versao rapida para quem vai fazer tudo pelo telefone.",
    embed: "https://www.youtube-nocookie.com/embed/_nhpPonkBTI",
    icon: Smartphone,
  },
}

type GuideKey = keyof typeof guides

export function VideoGuides() {
  const [activeGuide, setActiveGuide] = useState<GuideKey | null>(null)
  const active = activeGuide ? guides[activeGuide] : null

  return (
    <div className="mx-auto mt-4 w-full max-w-3xl">
      <div className="mx-auto flex max-w-xl items-center justify-center gap-2 rounded-full border border-emerald-100 bg-white/80 px-4 py-2 text-[11px] font-semibold text-emerald-700 shadow-sm backdrop-blur">
        <ShieldCheck className="h-4 w-4 shrink-0" />
        <span>Seus arquivos nao sao enviados para servidor. A analise acontece no seu navegador.</span>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
        {(Object.entries(guides) as [GuideKey, typeof guides[GuideKey]][]).map(([key, guide]) => {
          const Icon = guide.icon
          const isActive = activeGuide === key

          return (
            <button
              type="button"
              key={key}
              onClick={(event) => {
                celebrateFromEvent(event, 42)
                setActiveGuide(isActive ? null : key)
              }}
              className={`group relative inline-flex min-w-36 items-center justify-center gap-2 overflow-hidden rounded-2xl border px-4 py-3 text-sm font-extrabold shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl ${
                isActive
                  ? "border-[#e1306c]/30 bg-[#fff5f8] text-[#e1306c]"
                  : "border-black/[0.06] bg-white/85 text-gray-700 hover:border-[#e1306c]/20 hover:text-[#e1306c]"
              }`}
              aria-pressed={isActive}
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/70 to-transparent transition duration-700 group-hover:translate-x-full" />
              <Icon className="relative h-5 w-5" />
              <span className="relative">{guide.label}</span>
              <Play className={`relative h-4 w-4 transition ${isActive ? "scale-110" : "opacity-50 group-hover:opacity-100"}`} />
            </button>
          )
        })}
      </div>

      {active && (
        <div key={activeGuide} className="video-cinema mt-5 overflow-hidden rounded-[1.75rem] border border-white/80 bg-gray-950 p-2 shadow-2xl shadow-pink-200/40">
          <div className="flex items-center justify-between gap-3 px-3 py-2 text-left">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-pink-300">video guia</p>
              <h2 className="mt-1 text-sm font-bold text-white">{active.title}</h2>
              <p className="mt-0.5 text-xs text-white/55">{active.description}</p>
            </div>
            <button
              type="button"
              onClick={() => setActiveGuide(null)}
              className="rounded-full border border-white/10 px-3 py-1.5 text-xs font-bold text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              Fechar
            </button>
          </div>

          <div className="relative aspect-video overflow-hidden rounded-[1.25rem] bg-black">
            <iframe
              className="h-full w-full"
              src={active.embed}
              title={active.title}
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  )
}
