"use client"

import { ExternalLink, ShieldCheck, X } from "lucide-react"
import { useEffect, useState } from "react"

const officialLinks = [
  {
    label: "Exportar uma cópia das suas informações",
    href: "https://help.instagram.com/181231772500920",
  },
  {
    label: "Termos de Uso do Instagram",
    href: "https://help.instagram.com/581066165581870/",
  },
  {
    label: "Restrição por scraping de dados",
    href: "https://help.instagram.com/740480200552298/",
  },
  {
    label: "Baixar seus dados na Central de Privacidade",
    href: "https://privacycenter.instagram.com/dialog/what-we-collect/",
  },
]

export function ComplianceInfo() {
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
        className="absolute left-4 top-4 z-20 inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-black/[0.06] bg-white/85 text-emerald-600 shadow-sm backdrop-blur transition hover:scale-105 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 sm:left-6 sm:top-6"
        aria-label="Ver por que o app respeita as regras do Instagram"
      >
        <ShieldCheck className="h-5 w-5" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4 py-6 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="compliance-title"
        >
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-5 py-4 sm:px-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">Transparência</p>
                <h2 id="compliance-title" className="mt-1 text-xl font-bold text-gray-900">
                  Por que este app foi feito para respeitar as regras
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
                aria-label="Fechar explicação"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-5 px-5 py-5 sm:px-6">
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3">
                <p className="text-sm font-semibold leading-relaxed text-emerald-800">
                  A análise usa arquivos que o próprio usuário baixa pela ferramenta oficial do Instagram. O site não pede senha,
                  não entra na conta, não automatiza ações e não coleta dados direto do Instagram.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-gray-100 p-4">
                  <p className="text-sm font-bold text-gray-900">O que fazemos</p>
                  <p className="mt-2 text-sm leading-relaxed text-gray-500">
                    Lemos localmente o ZIP ou JSON que você escolheu enviar e comparamos seguidores com seguindo no seu navegador.
                  </p>
                </div>
                <div className="rounded-2xl border border-gray-100 p-4">
                  <p className="text-sm font-bold text-gray-900">O que não fazemos</p>
                  <p className="mt-2 text-sm leading-relaxed text-gray-500">
                    Não usamos robôs, scraping, senha, sessão, cookies, API privada ou qualquer acesso automatizado à conta.
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm font-bold text-gray-900">Você pode consultar aqui para ter certeza:</p>
                <div className="mt-3 space-y-2">
                  {officialLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between gap-3 rounded-2xl border border-gray-100 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                    >
                      {link.label}
                      <ExternalLink className="h-4 w-4 shrink-0" />
                    </a>
                  ))}
                </div>
              </div>

              <p className="text-xs leading-relaxed text-gray-400">
                Observação: isso é uma explicação de produto, não aconselhamento jurídico. Se as regras mudarem, os links oficiais
                acima são a fonte mais segura para conferir.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
