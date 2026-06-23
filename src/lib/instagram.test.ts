import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { analyze, parseFollowersMerged, parseFollowing } from "./instagram"

describe("instagram parser", () => {
  it("merges follower files and normalizes usernames", () => {
    const followers = parseFollowersMerged([
      [
        {
          string_list_data: [
            { value: " Alice ", timestamp: 100 },
          ],
        },
      ],
      [
        {
          title: "@Bob",
          timestamp: 200,
        },
      ],
    ])

    assert.equal(followers.size, 2)
    assert.equal(followers.has("alice"), true)
    assert.equal(followers.has("bob"), true)
  })

  it("finds accounts that do not follow back", () => {
    const followers = parseFollowersMerged([
      [
        {
          string_list_data: [
            { value: "alice", timestamp: 100 },
          ],
        },
      ],
    ])

    const following = parseFollowing({
      relationships_following: [
        {
          string_list_data: [
            { value: "alice", timestamp: 100 },
          ],
        },
        {
          string_list_data: [
            { value: "carol", timestamp: 300 },
          ],
        },
        {
          string_list_data: [
            { value: "__deleted__123", timestamp: 400 },
          ],
        },
      ],
    })

    const result = analyze(followers, following)

    assert.deepEqual(result.nonFollowers, [
      { username: "carol", followedSince: 300 },
    ])
    assert.equal(result.followersCount, 1)
    assert.equal(result.followingCount, 3)
    assert.equal(result.nonFollowersCount, 1)
  })

  it("extracts usernames from profile links", () => {
    const following = parseFollowing([
      {
        href: "https://www.instagram.com/Example.User/?hl=pt-br",
        timestamp: 500,
      },
    ])

    assert.equal(following.has("example.user"), true)
  })
})
