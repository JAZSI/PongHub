export type PlayerId = 1 | 2
export type Phase = 'setup' | 'live' | 'finished'

export interface MatchConfig {
  p1Name: string
  p2Name: string
  /** Total sets in the match: 1, 3, 5 or 7. */
  bestOf: number
  /** Points needed to win a single set (subject to win-by-two). */
  targetPoints: number
}

export interface SetResult {
  index: number
  p1: number
  p2: number
  winner: PlayerId
}

export type GameEventType = 'point' | 'set' | 'match'

export interface GameEvent {
  type: GameEventType
  player: PlayerId
}

/** A restorable point-in-time copy of the mutable match state (for undo). */
export interface Snapshot {
  p1Points: number
  p2Points: number
  p1Sets: number
  p2Sets: number
  completedSets: SetResult[]
  phase: Phase
  winner: PlayerId | null
}

export interface MatchState extends Snapshot {
  config: MatchConfig
  /** Undo stack — most recent snapshot last. */
  past: Snapshot[]
  /** Monotonic counter; bumped on every action. Drives one-shot effects. */
  tick: number
  /** Describes the most recent action so the UI can react (flash / sound). */
  lastEvent: GameEvent | null
}
