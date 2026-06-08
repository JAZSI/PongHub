import type { MatchConfig, PlayerId } from './types'

/** Sets a player must win to take the match. Best of 3 → 2, 5 → 3, 7 → 4. */
export const setsToWin = (bestOf: number): number => Math.floor(bestOf / 2) + 1

/**
 * A set is decided when a player reaches the target score AND leads by two.
 * 11–9 wins; 11–10 does not (must reach 12–10, 13–11, …).
 */
export const isSetWon = (a: number, b: number, target: number): boolean =>
  a >= target && a - b >= 2

/** True when the leader needs exactly one more point to take the set. */
export const isSetPoint = (a: number, b: number, target: number): boolean =>
  isSetWon(a + 1, b, target)

/** Both players within the win-by-two zone (e.g. 10–10 at 11, 14–13, …). */
export const isDeuce = (a: number, b: number, target: number): boolean =>
  a >= target - 1 && b >= target - 1

/**
 * Table-tennis serve rotation. Service alternates every two points; once both
 * players reach (target − 1) it alternates every single point. `startServer`
 * is whoever served the first point of the current set.
 */
export const currentServer = (
  p1: number,
  p2: number,
  target: number,
  startServer: PlayerId,
): PlayerId => {
  const total = p1 + p2
  const deucePoints = 2 * (target - 1)
  let switches: number
  if (p1 >= target - 1 && p2 >= target - 1) {
    switches = Math.floor(deucePoints / 2) + (total - deucePoints)
  } else {
    switches = Math.floor(total / 2)
  }
  return switches % 2 === 0 ? startServer : startServer === 1 ? 2 : 1
}

/** Who serves first in a given set — alternates between sets. */
export const startServerForSet = (completedSets: number): PlayerId =>
  completedSets % 2 === 0 ? 1 : 2

export interface SituationFlags {
  deuce: boolean
  p1SetPoint: boolean
  p2SetPoint: boolean
  p1MatchPoint: boolean
  p2MatchPoint: boolean
}

export const situation = (
  p1: number,
  p2: number,
  p1Sets: number,
  p2Sets: number,
  config: MatchConfig,
): SituationFlags => {
  const { targetPoints: t, bestOf } = config
  const need = setsToWin(bestOf)
  const p1SetPoint = isSetPoint(p1, p2, t)
  const p2SetPoint = isSetPoint(p2, p1, t)
  return {
    deuce: isDeuce(p1, p2, t),
    p1SetPoint,
    p2SetPoint,
    p1MatchPoint: p1SetPoint && p1Sets === need - 1,
    p2MatchPoint: p2SetPoint && p2Sets === need - 1,
  }
}
