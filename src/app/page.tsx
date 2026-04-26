import { InstagramAnalyzer } from "@/components/instagram-analyzer"
import { ParallaxBackground } from "@/components/parallax-background"

export default function Home() {
  return (
    <main className="relative min-h-screen bg-white overflow-hidden px-4 py-14 sm:px-6 lg:px-8">
      <ParallaxBackground />

      <div className="relative z-10 mx-auto max-w-5xl lg:max-w-6xl">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-black/[0.07] bg-white/80 backdrop-blur-sm px-4 py-1.5 text-xs font-medium text-gray-500 mb-8 shadow-sm">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Seus dados ficam 100% no seu navegador
          </div>

          <div className="flex items-center justify-center gap-3 mb-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md"
              style={{
                background:
                  "linear-gradient(135deg, #833ab4 0%, #c13584 40%, #e1306c 70%, #fd1d1d 100%)",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4.5 h-4.5"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="0.8" fill="white" stroke="none" />
              </svg>
            </div>
          </div>

          <h1 className="text-[2.75rem] sm:text-6xl font-extrabold tracking-tight leading-none">
            <span className="ig-gradient-text">Instagram</span>
            <span className="text-gray-900"> Unfailed</span>
          </h1>

          <p className="mt-4 text-[15px] text-gray-400 font-normal max-w-sm mx-auto leading-relaxed">
            Descubra quem não te segue de volta. Faça upload dos arquivos exportados e veja a lista
            em segundos.
          </p>

          <div className="mt-6">
            <a
              href="https://accountscenter.instagram.com/info_and_permissions/dyi/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 rounded-2xl text-white font-semibold shadow-md"
              style={{ background: "linear-gradient(135deg, #833ab4 0%, #c13584 40%, #e1306c 70%, #f77737 100%)" }}
              aria-label="Exportar dados do Instagram"
            >
              Leve-me para exportar meus dados
            </a>
          </div>
        </div>

        <div className="glass rounded-3xl p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-7 pb-5 border-b border-black/[0.05]">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-white text-xs font-bold"
              style={{ background: "linear-gradient(135deg, #833ab4, #e1306c)" }}
            >
              1
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">Exporte seus dados do Instagram</p>
              <p className="text-xs text-gray-400 mt-0.5">
                Configurações → Sua atividade → Baixar suas informações → Formato JSON
              </p>
            </div>
          </div>

          <InstagramAnalyzer />
        </div>

        <p className="text-center text-[11px] text-gray-300 mt-7 font-medium tracking-wide">
          NENHUM DADO É ENVIADO PARA SERVIDORES · PROCESSAMENTO LOCAL
        </p>
      </div>
    </main>
  )
}
