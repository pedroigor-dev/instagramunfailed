"use client"

import { useEffect, useState } from "react"

type LoaderState = "playing" | "exiting" | "done"

function InstagramGlyph() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-16 w-16 sm:h-20 sm:w-20"
    >
      <rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5.2" stroke="white" strokeWidth="1.85" />
      <circle cx="12" cy="12" r="4.05" stroke="white" strokeWidth="1.85" />
      <circle cx="17.1" cy="6.9" r="1.15" fill="white" />
    </svg>
  )
}

export function IntroLoader() {
  const [state, setState] = useState<LoaderState>("playing")

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    if (prefersReducedMotion) {
      const timer = window.setTimeout(() => setState("done"), 450)
      return () => window.clearTimeout(timer)
    }

    const exitTimer = window.setTimeout(() => setState("exiting"), 2850)
    const doneTimer = window.setTimeout(() => setState("done"), 3650)

    return () => {
      window.clearTimeout(exitTimer)
      window.clearTimeout(doneTimer)
    }
  }, [])

  if (state === "done") return null

  return (
    <div className={`intro-loader ${state === "exiting" ? "is-exiting" : ""}`} aria-label="Carregando página">
      <div className="intro-loader__aura" />
      <div className="intro-loader__grain" />

      <div className="intro-loader__scene">
        <div className="intro-loader__rings" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>

        <div className="intro-loader__icon-wrap">
          <div className="intro-loader__icon">
            <InstagramGlyph />
          </div>
          <div className="intro-loader__shadow" />
        </div>

        <div className="intro-loader__copy">
          <p>Instagram Unfailed</p>
          <span>preparando análise local</span>
        </div>

        <div className="intro-loader__progress" aria-hidden="true">
          <span />
        </div>
      </div>
    </div>
  )
}
