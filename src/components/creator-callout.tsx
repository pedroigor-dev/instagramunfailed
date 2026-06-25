"use client"

import { Camera, Code2, ExternalLink, Link, X } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"

const links = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/_pedroigorc/",
    icon: Camera,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/pedroigorcc/",
    icon: Link,
  },
  {
    label: "GitHub",
    href: "https://github.com/pedroigor-dev",
    icon: Code2,
  },
]

export function CreatorCallout() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false)
    }

    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [open])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="creator-callout-button fixed bottom-4 right-4 z-30 inline-flex items-center gap-2 rounded-full border border-black/[0.07] bg-white/90 px-4 py-2 text-xs font-extrabold uppercase tracking-wide text-gray-700 shadow-lg backdrop-blur transition hover:scale-105 hover:text-[#e1306c] focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-300 sm:bottom-6 sm:right-6"
      >
        clique aqui
        <span className="h-2 w-2 rounded-full bg-[#e1306c] animate-pulse" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="creator-callout-title"
        >
          <div className="relative grid max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white shadow-2xl md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 z-10 rounded-full bg-white/90 p-2 text-gray-500 shadow-sm transition hover:bg-white hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-300"
              aria-label="Fechar"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="relative min-h-[24rem] overflow-hidden bg-gray-950">
              <Image
                src="/eu.png"
                alt="Pedro Igor, criador do Instagram Unfailed"
                width={949}
                height={1600}
                className="h-full max-h-[82vh] w-full object-cover object-center"
                sizes="(min-width: 768px) 380px, 100vw"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-5">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/70">criador do rolê</p>
                <p className="mt-1 text-2xl font-black text-white">Pedro Igor</p>
              </div>
            </div>

            <div className="flex flex-col justify-center p-6 sm:p-8">
              <p className="text-xs font-bold uppercase tracking-wider text-[#e1306c]">-------------</p>
              <h2 id="creator-callout-title" className="mt-2 text-3xl font-black leading-tight text-gray-950">
                Oi, vão a merda
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-gray-500">
                Faz a boa e segue quem fez essa bosta.
              </p>

              <div className="mt-6 grid gap-3">
                {links.map(({ label, href, icon: Icon }) => (
                  <a
                    key={href}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-bold text-gray-800 transition hover:border-[#e1306c]/25 hover:bg-[#fdf4f7] hover:text-[#e1306c]"
                  >
                    <span className="flex items-center gap-3">
                      <Icon className="h-4 w-4" />
                      {label}
                    </span>
                    <ExternalLink className="h-4 w-4 text-gray-400 transition group-hover:text-[#e1306c]" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
