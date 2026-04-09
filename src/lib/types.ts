export type InstagramEntry = {
  string_list_data?: {
    value?: string
    href?: string
    timestamp?: number
  }[]
  title?: string
  value?: string
  href?: string
  timestamp?: number
}

export type NonFollower = {
  username: string
  followedSince: number
}

export type AnalysisResult = {
  nonFollowers: NonFollower[]
  followersCount: number
  followingCount: number
  nonFollowersCount: number
}
