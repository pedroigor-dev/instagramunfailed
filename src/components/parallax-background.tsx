"use client"

import { useEffect, useRef } from "react"

export function ParallaxBackground() {
  const blob1 = useRef<HTMLDivElement>(null)
  const blob2 = useRef<HTMLDivElement>(null)
  const blob3 = useRef<HTMLDivElement>(null)
  const blob4 = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let rafId: number
    let mouseX = 0
    let mouseY = 0
    let currentX = 0
    let currentY = 0

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2
    }

    const animate = () => {
      currentX += (mouseX - currentX) * 0.04
      currentY += (mouseY - currentY) * 0.04

      if (blob1.current) {
        blob1.current.style.transform = `translate(${currentX * -30}px, ${currentY * -20}px)`
      }
      if (blob2.current) {
        blob2.current.style.transform = `translate(${currentX * 40}px, ${currentY * 30}px)`
      }
      if (blob3.current) {
        blob3.current.style.transform = `translate(${currentX * -20}px, ${currentY * 40}px)`
      }
      if (blob4.current) {
        blob4.current.style.transform = `translate(${currentX * 25}px, ${currentY * -35}px)`
      }

      rafId = requestAnimationFrame(animate)
    }

    window.addEventListener("mousemove", handleMouseMove)
    rafId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden z-0">
      <div
        ref={blob1}
        className="blob absolute -top-32 -left-32 w-[500px] h-[500px] opacity-25"
        style={{ background: "radial-gradient(circle, #833ab4 0%, #c13584 60%, transparent 100%)" }}
      />
      <div
        ref={blob2}
        className="blob absolute -top-20 -right-40 w-[420px] h-[420px] opacity-20"
        style={{ background: "radial-gradient(circle, #fcaf45 0%, #f77737 50%, transparent 100%)" }}
      />
      <div
        ref={blob3}
        className="blob absolute bottom-10 -left-20 w-[380px] h-[380px] opacity-20"
        style={{ background: "radial-gradient(circle, #fd1d1d 0%, #e1306c 55%, transparent 100%)" }}
      />
      <div
        ref={blob4}
        className="blob absolute -bottom-24 right-10 w-[360px] h-[360px] opacity-15"
        style={{ background: "radial-gradient(circle, #c13584 0%, #833ab4 50%, transparent 100%)" }}
      />
    </div>
  )
}
