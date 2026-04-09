import { InstagramAnalyzer } from "@/components/instagram-analyzer"

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-white/60 mb-6">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Seus dados ficam 100% no seu navegador
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-orange-400 bg-clip-text text-transparent">
              Instagram Unfailed
            </span>
          </h1>

          <p className="mt-3 text-base text-white/50 max-w-md mx-auto">
            Descubra quem não te segue de volta. Faça upload dos seus arquivos exportados do
            Instagram e veja a lista em segundos.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8 backdrop-blur-sm">
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-white/80 uppercase tracking-wider">
              Passo 1 — Exporte seus dados
            </h2>
            <p className="text-xs text-white/40 mt-1">
              Instagram → Configurações → Sua atividade → Baixar suas informações → Formato JSON
            </p>
          </div>

          <InstagramAnalyzer />
        </div>

        <p className="text-center text-xs text-white/20 mt-8">
          Nenhum dado é enviado para servidores. Processamento feito localmente no browser.
        </p>
      </div>
    </main>
  )
}
