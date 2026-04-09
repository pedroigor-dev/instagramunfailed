import type { AnalysisResult, InstagramEntry } from "./types"

function extractUsername(entry: InstagramEntry): { username: string; timestamp: number } | null {
  if (entry.string_list_data?.length) {
    for (const item of entry.string_list_data) {
      const raw = item.value ?? ""
      if (raw) return { username: raw.toLowerCase(), timestamp: item.timestamp ?? 0 }
    }
  }

  if (entry.title) {
    const t = entry.title.trim()
    if (t) return { username: t.toLowerCase(), timestamp: entry.timestamp ?? 0 }
  }

  if (entry.value) {
    const v = entry.value.trim()
    if (v) return { username: v.toLowerCase(), timestamp: entry.timestamp ?? 0 }
  }

  const href = entry.href ?? entry.string_list_data?.[0]?.href
  if (href) {
    const match = href.match(/instagram\.com\/([^/?#]+)/)
    if (match?.[1]) return { username: match[1].toLowerCase(), timestamp: entry.timestamp ?? 0 }
  }

  return null
}

function extractUsernames(entries: InstagramEntry[]): Map<string, number> {
  const map = new Map<string, number>()
  for (const entry of entries) {
    const result = extractUsername(entry)
    if (result) map.set(result.username, result.timestamp)
  }
  return map
}

function resolveEntries(data: unknown): InstagramEntry[] {
  if (Array.isArray(data)) return data as InstagramEntry[]

  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>
    for (const key of Object.keys(obj)) {
      if (Array.isArray(obj[key])) return obj[key] as InstagramEntry[]
    }
  }

  throw new Error("Formato de arquivo não reconhecido.")
}

export function parseFollowers(data: unknown): Map<string, number> {
  return extractUsernames(resolveEntries(data))
}

export function parseFollowersMerged(dataArray: unknown[]): Map<string, number> {
  const merged = new Map<string, number>()
  for (const data of dataArray) {
    for (const [username, timestamp] of extractUsernames(resolveEntries(data))) {
      merged.set(username, timestamp)
    }
  }
  return merged
}

export function parseFollowing(data: unknown): Map<string, number> {
  return extractUsernames(resolveEntries(data))
}

export function analyze(
  followers: Map<string, number>,
  following: Map<string, number>
): AnalysisResult {
  const nonFollowers: AnalysisResult["nonFollowers"] = []

  const deletedPattern = /^__deleted__/i

  for (const [username, timestamp] of following) {
    if (!followers.has(username) && !deletedPattern.test(username)) {
      nonFollowers.push({ username, followedSince: timestamp })
    }
  }

  nonFollowers.sort((a, b) => a.username.localeCompare(b.username))

  return {
    nonFollowers,
    followersCount: followers.size,
    followingCount: following.size,
    nonFollowersCount: nonFollowers.length,
  }
}
