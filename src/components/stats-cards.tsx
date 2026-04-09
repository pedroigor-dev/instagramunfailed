import { Card, CardContent } from "@/components/ui/card"
import type { AnalysisResult } from "@/lib/types"

type StatsCardsProps = Pick<
  AnalysisResult,
  "followersCount" | "followingCount" | "nonFollowersCount"
>

const stats = (data: StatsCardsProps) => [
  {
    label: "Seguidores",
    value: data.followersCount,
    description: "pessoas te seguem",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
  {
    label: "Seguindo",
    value: data.followingCount,
    description: "contas que você segue",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
  },
  {
    label: "Não seguem de volta",
    value: data.nonFollowersCount,
    description: `${data.followingCount > 0 ? ((data.nonFollowersCount / data.followingCount) * 100).toFixed(1) : 0}% de quem você segue`,
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
  },
]

export function StatsCards(data: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats(data).map((stat) => (
        <Card
          key={stat.label}
          className={`${stat.bg} border ${stat.border} backdrop-blur-sm`}
        >
          <CardContent className="pt-6 pb-4">
            <p className={`text-4xl font-bold tabular-nums ${stat.color}`}>
              {stat.value.toLocaleString("pt-BR")}
            </p>
            <p className="text-sm font-semibold text-white mt-1">{stat.label}</p>
            <p className="text-xs text-white/50 mt-0.5">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
