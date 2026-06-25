"use client"

import { ChevronLeft, ChevronRight, HelpCircle, X } from "lucide-react"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"

type TutorialStep = {
  title: string
  description: string
  image: {
    src: string
    width: number
    height: number
    alt: string
  }
}

const steps: TutorialStep[] = [
  {
    title: "Crie a exportação",
    description: "Na Central de Contas, clique em Criar exportação.",
    image: {
      src: "/image.png",
      width: 1888,
      height: 913,
      alt: "Tela da Central de Contas com setas apontando para Criar exportação.",
    },
  },
  {
    title: "Escolha o perfil do Instagram",
    description: "Selecione o perfil do Instagram. Se aparecer Facebook junto, ignore e escolha o Instagram.",
    image: {
      src: "/insta2.png",
      width: 777,
      height: 379,
      alt: "Tela de escolha de perfil com opção de Instagram.",
    },
  },
  {
    title: "Exporte para o dispositivo",
    description: "Escolha Exportar para dispositivo. Assim o Instagram baixa um arquivo para o computador.",
    image: {
      src: "/insta3.png",
      width: 1012,
      height: 640,
      alt: "Tela escolher para onde exportar com exportar para dispositivo destacado.",
    },
  },
  {
    title: "Abra Formato",
    description: "Antes de iniciar, clique em Formato. Por padrão ele pode vir como HTML, mas precisamos de JSON.",
    image: {
      src: "/insta4.png",
      width: 1892,
      height: 914,
      alt: "Tela de configurações da exportação com Formato HTML destacado.",
    },
  },
  {
    title: "Selecione JSON",
    description: "Marque JSON e clique em Salvar. Esse é o formato que o site consegue analisar.",
    image: {
      src: "/insta5.png",
      width: 844,
      height: 604,
      alt: "Tela Formato com JSON selecionado e botão Salvar destacado.",
    },
  },
  {
    title: "Abra Intervalo de datas",
    description: "Volte para as opções e clique em Intervalo de datas.",
    image: {
      src: "/insta6.png",
      width: 836,
      height: 849,
      alt: "Tela de configurações da exportação com Intervalo de datas destacado.",
    },
  },
  {
    title: "Escolha Desde o início",
    description: "Selecione Desde o início e salve para pegar o histórico mais completo possível.",
    image: {
      src: "/insta7.png",
      width: 900,
      height: 837,
      alt: "Tela de intervalo de datas com Desde o início selecionado.",
    },
  },
  {
    title: "Limpe as informações",
    description: "Entre em Personalizar informações e clique em Limpar tudo. Isso evita baixar um ZIP gigante.",
    image: {
      src: "/insta8.png",
      width: 870,
      height: 881,
      alt: "Tela de escolher informações para exportar com Limpar tudo destacado.",
    },
  },
  {
    title: "Marque Seguidores e Seguindo",
    description: "Na seção Conexões, marque apenas Seguidores e Seguindo. É só isso que o app precisa.",
    image: {
      src: "/insta10.png",
      width: 792,
      height: 281,
      alt: "Tela de conexões com Seguidores e Seguindo marcado.",
    },
  },
  {
    title: "Confira e inicie",
    description: "Confira se ficou Seguidores e Seguindo, Desde o início e JSON. Depois clique em Iniciar exportação.",
    image: {
      src: "/insta12.png",
      width: 869,
      height: 883,
      alt: "Tela final da exportação com botão Iniciar exportação destacado.",
    },
  },
  {
    title: "Selecione o ZIP baixado",
    description: "Quando o Instagram liberar o download, volte para o site, clique no campo do ZIP e escolha o arquivo baixado.",
    image: {
      src: "/insta14.png",
      width: 1122,
      height: 696,
      alt: "Seletor de arquivos mostrando o ZIP do Instagram selecionado.",
    },
  },
  {
    title: "Analise os dados",
    description: "Com o ZIP carregado, clique em Analisar dados. O app encontra os arquivos certos sozinho.",
    image: {
      src: "/insta15.png",
      width: 1689,
      height: 794,
      alt: "Tela do site com o ZIP carregado e botão Analisar dados destacado.",
    },
  },
]

export function ExportTutorial() {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(0)
  const touchStartX = useRef<number | null>(null)
  const preloadedImages = useRef<HTMLImageElement[]>([])

  useEffect(() => {
    if (!open) return

    document.body.classList.add("modal-open")

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false)
      if (event.key === "ArrowRight") setStep((current) => Math.min(current + 1, steps.length - 1))
      if (event.key === "ArrowLeft") setStep((current) => Math.max(current - 1, 0))
    }

    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.body.classList.remove("modal-open")
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [open])

  useEffect(() => {
    if (!open) return

    preloadedImages.current = steps.map(({ image }) => {
      const preload = new window.Image()
      preload.decoding = "async"
      preload.src = image.src
      void preload.decode?.().catch(() => undefined)
      return preload
    })
  }, [open])

  const current = steps[step]
  const goBack = () => setStep((currentStep) => Math.max(currentStep - 1, 0))
  const goNext = () => step === steps.length - 1 ? setOpen(false) : setStep((currentStep) => currentStep + 1)

  const handleTouchEnd = (clientX: number) => {
    if (touchStartX.current === null) return

    const delta = clientX - touchStartX.current
    touchStartX.current = null

    if (Math.abs(delta) < 48) return
    if (delta < 0) {
      setStep((currentStep) => Math.min(currentStep + 1, steps.length - 1))
    } else {
      setStep((currentStep) => Math.max(currentStep - 1, 0))
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setStep(0)
          setOpen(true)
        }}
        className="relative z-10 inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-black/[0.06] bg-white/90 text-gray-500 shadow-md transition hover:text-[#e1306c] hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-300"
        aria-label="Abrir tutorial de exportação"
      >
        <HelpCircle className="h-5 w-5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4 py-6 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="export-tutorial-title">
          <div className="relative flex h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl sm:h-auto sm:max-h-[92vh]">
            <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-5 py-4 sm:px-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#e1306c]">Tutorial</p>
                <h2 id="export-tutorial-title" className="mt-1 text-xl font-bold text-gray-900">
                  Como exportar os dados do Instagram
                </h2>
                <p className="mt-1 text-xs text-gray-500">
                  Melhor caminho: exportar só Seguidores e Seguindo. Plano B: enviar o ZIP completo mesmo assim.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-300"
                aria-label="Fechar tutorial"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div
              className="grid min-h-0 flex-1 overflow-y-auto lg:grid-cols-[minmax(0,1fr)_330px]"
              onTouchStart={(event) => {
                touchStartX.current = event.changedTouches[0]?.clientX ?? null
              }}
              onTouchEnd={(event) => handleTouchEnd(event.changedTouches[0]?.clientX ?? 0)}
            >
              <div className="bg-gray-50 p-3 sm:p-5">
                <div className="relative flex min-h-[190px] items-center justify-center overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm sm:min-h-[320px]">
                  <Image
                    key={current.image.src}
                    src={current.image.src}
                    alt={current.image.alt}
                    width={current.image.width}
                    height={current.image.height}
                    className="max-h-[34vh] w-full object-contain sm:max-h-[68vh]"
                    loading="eager"
                    fetchPriority="high"
                    sizes="(min-width: 1024px) 650px, 100vw"
                    unoptimized
                  />
                </div>
              </div>

              <div className="flex flex-col p-5 sm:p-6">
                <div className="mb-4 text-sm font-semibold text-gray-400">
                  Passo {step + 1} de {steps.length}
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{current.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-gray-500">{current.description}</p>

                <div className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3">
                  <p className="text-xs font-semibold leading-relaxed text-emerald-700">
                    Não conseguiu seguir perfeito? Tudo bem: baixe o ZIP que o Instagram entregar e envie aqui no site.
                  </p>
                </div>
              </div>
            </div>

            <div className="shrink-0 border-t border-gray-100 bg-white/95 px-5 py-3 backdrop-blur sm:px-6">
              <div className="flex items-center justify-center gap-2">
                {steps.map((item, index) => (
                  <button
                    type="button"
                    key={item.title}
                    onClick={() => setStep(index)}
                    className={`h-2.5 rounded-full transition-all ${index === step ? "w-8 bg-[#e1306c]" : "w-2.5 bg-gray-200 hover:bg-gray-300"}`}
                    aria-label={`Ir para o passo ${index + 1}`}
                  />
                ))}
              </div>

              <div className="mt-3 flex gap-3">
                <button
                  type="button"
                  onClick={goBack}
                  disabled={step === 0}
                  className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-2xl border border-gray-200 text-sm font-semibold text-gray-600 transition hover:border-gray-300 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Voltar
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-2xl bg-[#0b74de] text-sm font-semibold text-white shadow-sm transition hover:bg-[#0867c7]"
                >
                  {step === steps.length - 1 ? "Concluir" : "Próximo"}
                  {step < steps.length - 1 && <ChevronRight className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
