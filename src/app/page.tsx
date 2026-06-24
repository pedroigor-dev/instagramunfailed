import { InstagramAnalyzer } from "@/components/instagram-analyzer"
import { ComplianceInfo } from "@/components/compliance-info"
import { ExportTutorial } from "@/components/export-tutorial"
import { ParallaxBackground } from "@/components/parallax-background"

function BrushArrow({ className }: { className: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 160 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14 66C39 39 72 24 127 26"
        stroke="currentColor"
        strokeWidth="13"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M105 8C119 13 133 21 146 34"
        stroke="currentColor"
        strokeWidth="13"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M110 52C123 43 135 36 146 34"
        stroke="currentColor"
        strokeWidth="13"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20 70C49 48 81 34 122 31"
        stroke="white"
        strokeOpacity="0.35"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default function Home() {
  return (
    <main className="relative min-h-screen bg-white overflow-hidden px-4 py-14 sm:px-6 lg:px-8">
      <ParallaxBackground />
      <ComplianceInfo />

      <div className="relative z-10 mx-auto max-w-5xl lg:max-w-6xl">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-black/[0.07] bg-white/80 backdrop-blur-sm px-4 py-1.5 text-xs font-medium text-gray-500 mb-8 shadow-sm">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            A análise principal roda 100% no seu navegador
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
            Descubra quem não te segue de volta. Envie o ZIP completo do Instagram e veja a lista
            em segundos.
          </p>

          <div className="relative mt-9 inline-flex items-center justify-center gap-3">
            <BrushArrow className="cta-arrow cta-arrow-top hidden sm:block" />
            <BrushArrow className="cta-arrow cta-arrow-left hidden sm:block" />
            <BrushArrow className="cta-arrow cta-arrow-right hidden sm:block" />
            <a
              href="https://accountscenter.instagram.com/info_and_permissions/dyi/"
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-10 inline-flex items-center justify-center px-6 py-3 rounded-2xl text-white font-semibold shadow-md"
              style={{ background: "linear-gradient(135deg, #833ab4 0%, #c13584 40%, #e1306c 70%, #f77737 100%)" }}
              aria-label="Exportar dados do Instagram"
            >
              Leve-me para exportar meus dados
            </a>
            <ExportTutorial />
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

      </div>
    </main>
  )
}
