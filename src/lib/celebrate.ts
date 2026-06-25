type CelebrationEvent = {
  currentTarget: HTMLElement
}

const colors = ["#833ab4", "#c13584", "#e1306c", "#fd1d1d", "#f77737", "#fcaf45", "#38bdf8", "#34d399"]
const shapes = ["dot", "pill", "ring"]

export function celebrateFromEvent(event: CelebrationEvent, amount = 34) {
  if (typeof document === "undefined") return

  const rect = event.currentTarget.getBoundingClientRect()
  const burst = document.createElement("div")
  burst.className = "celebration-burst"
  burst.style.left = `${rect.left + rect.width / 2}px`
  burst.style.top = `${rect.top + rect.height / 2}px`

  for (let index = 0; index < amount; index += 1) {
    const piece = document.createElement("span")
    const angle = (Math.PI * 2 * index) / amount + (Math.random() - 0.5) * 0.55
    const distance = 54 + Math.random() * 82
    const size = 5 + Math.random() * 9
    const color = colors[index % colors.length]
    const shape = shapes[index % shapes.length]

    piece.className = `celebration-piece celebration-piece-${shape}`
    piece.style.setProperty("--x", `${Math.cos(angle) * distance}px`)
    piece.style.setProperty("--y", `${Math.sin(angle) * distance}px`)
    piece.style.setProperty("--r", `${Math.random() * 360}deg`)
    piece.style.setProperty("--s", `${size}px`)
    piece.style.setProperty("--c", color)
    piece.style.animationDelay = `${Math.random() * 80}ms`
    burst.appendChild(piece)
  }

  const halo = document.createElement("span")
  halo.className = "celebration-halo"
  burst.appendChild(halo)

  document.body.appendChild(burst)
  window.setTimeout(() => burst.remove(), 1200)
}
