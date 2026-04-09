import type { AnalysisResult } from "@/lib/types"

type StatsCardsProps = Pick<
  AnalysisResult,
  "followersCount" | "followingCount" | "nonFollowersCount"
>

const stats = (data: StatsCardsProps) => [
  {
    label: "Seguidores",
    value: data.followersCount,
    description: "te seguem",
    accent: "#6366f1",
    iconBg: "#eef2ff",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    label: "Seguindo",
    value: data.followingCount,
    description: "contas que você segue",
    accent: "#8b5cf6",
    iconBg: "#f5f3ff",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    label: "Não seguem de volta",
    value: data.nonFollowersCount,
    description: `${data.followingCount > 0 ? ((data.nonFollowersCount / data.followingCount) * 100).toFixed(1) : 0}% de quem você segue`,
    accent: "#e1306c",
    iconBg: "#fdf4f7",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#e1306c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <line x1="23" y1="11" x2="17" y2="11" />
      </svg>
    ),
  },
]

export function StatsCards(data: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {stats(data).map((stat) => (
        <div
          key={stat.label}
          className="glass-card rounded-2xl px-5 py-4"
        >
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center mb-3"
            style={{ background: stat.iconBg }}
          >
            {stat.icon}
          </div>
          <p className="text-3xl font-bold tabular-nums text-gray-900">
            {stat.value.toLocaleString("pt-BR")}
          </p>
          <p className="text-[13px] font-semibold text-gray-700 mt-1">{stat.label}</p>
          <p className="text-[11px] text-gray-400 mt-0.5">{stat.description}</p>
        </div>
      ))}
    </div>
  )
}
