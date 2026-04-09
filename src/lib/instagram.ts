import type { AnalysisResult, InstagramEntry } from "./types"

function extractUsernames(entries: InstagramEntry[]): Map<string, number> {
  const map = new Map<string, number>()
  for (const entry of entries) {
    for (const item of entry.string_list_data) {
      if (item.value) {
        map.set(item.value.toLowerCase(), item.timestamp)
      }
    }
  }
  return map
}

function resolveEntries(data: unknown): InstagramEntry[] {
  if (Array.isArray(data)) return data as InstagramEntry[]

  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>
    const arrKey = Object.keys(obj).find((k) => Array.isArray(obj[k]))
    if (arrKey) return obj[arrKey] as InstagramEntry[]
  }

  throw new Error("Formato de arquivo não reconhecido.")
}

export function parseFollowers(data: unknown): Map<string, number> {
  return extractUsernames(resolveEntries(data))
}

export function parseFollowing(data: unknown): Map<string, number> {
  return extractUsernames(resolveEntries(data))
}

export function analyze(
  followers: Map<string, number>,
  following: Map<string, number>
): AnalysisResult {
  const nonFollowers: AnalysisResult["nonFollowers"] = []

  for (const [username, timestamp] of following) {
    if (!followers.has(username)) {
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
