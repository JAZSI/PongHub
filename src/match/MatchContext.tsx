import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react'
import type {
  MatchConfig,
  MatchState,
  PlayerId,
  Snapshot,
} from './types'
import { isSetWon, setsToWin } from './logic'

const STORAGE_KEY = 'ponghub.match.v1'

const emptySnapshot: Snapshot = {
  p1Points: 0,
  p2Points: 0,
  p1Sets: 0,
  p2Sets: 0,
  completedSets: [],
  phase: 'setup',
  winner: null,
}

const initialState: MatchState = {
  ...emptySnapshot,
  config: { p1Name: 'Player 1', p2Name: 'Player 2', bestOf: 5, targetPoints: 11 },
  past: [],
  tick: 0,
  lastEvent: null,
}

type Action =
  | { type: 'START'; config: MatchConfig }
  | { type: 'POINT'; player: PlayerId }
  | { type: 'DECREMENT'; player: PlayerId }
  | { type: 'UNDO' }
  | { type: 'RESET_SET' }
  | { type: 'RESET_MATCH' }
  | { type: 'NEW_MATCH' }

const snap = (s: MatchState): Snapshot => ({
  p1Points: s.p1Points,
  p2Points: s.p2Points,
  p1Sets: s.p1Sets,
  p2Sets: s.p2Sets,
  completedSets: s.completedSets,
  phase: s.phase,
  winner: s.winner,
})

function reducer(state: MatchState, action: Action): MatchState {
  const tick = state.tick + 1

  switch (action.type) {
    case 'START': {
      return {
        ...emptySnapshot,
        config: action.config,
        phase: 'live',
        past: [],
        tick,
        lastEvent: null,
      }
    }

    case 'POINT': {
      if (state.phase !== 'live') return state
      const { player } = action
      const past = [...state.past, snap(state)]
      const p1 = state.p1Points + (player === 1 ? 1 : 0)
      const p2 = state.p2Points + (player === 2 ? 1 : 0)
      let { p1Sets, p2Sets, completedSets } = state
      const { phase } = state
      const winner = state.winner

      const scorer = player === 1 ? p1 : p2
      const other = player === 1 ? p2 : p1

      if (isSetWon(scorer, other, state.config.targetPoints)) {
        completedSets = [
          ...completedSets,
          { index: completedSets.length + 1, p1, p2, winner: player },
        ]
        if (player === 1) p1Sets += 1
        else p2Sets += 1

        const need = setsToWin(state.config.bestOf)
        const playerSets = player === 1 ? p1Sets : p2Sets

        if (playerSets >= need) {
          return {
            ...state,
            p1Points: 0,
            p2Points: 0,
            p1Sets,
            p2Sets,
            completedSets,
            phase: 'finished',
            winner: player,
            past,
            tick,
            lastEvent: { type: 'match', player },
          }
        }
        return {
          ...state,
          p1Points: 0,
          p2Points: 0,
          p1Sets,
          p2Sets,
          completedSets,
          phase,
          winner,
          past,
          tick,
          lastEvent: { type: 'set', player },
        }
      }

      return {
        ...state,
        p1Points: p1,
        p2Points: p2,
        past,
        tick,
        lastEvent: { type: 'point', player },
      }
    }

    case 'DECREMENT': {
      if (state.phase !== 'live') return state
      const { player } = action
      const cur = player === 1 ? state.p1Points : state.p2Points
      if (cur <= 0) return state
      return {
        ...state,
        past: [...state.past, snap(state)],
        p1Points: player === 1 ? cur - 1 : state.p1Points,
        p2Points: player === 2 ? cur - 1 : state.p2Points,
        tick,
        lastEvent: null,
      }
    }

    case 'UNDO': {
      if (state.past.length === 0) return state
      const past = [...state.past]
      const prev = past.pop() as Snapshot
      return { ...state, ...prev, past, tick, lastEvent: null }
    }

    case 'RESET_SET': {
      if (state.phase !== 'live') return state
      if (state.p1Points === 0 && state.p2Points === 0) return state
      return {
        ...state,
        past: [...state.past, snap(state)],
        p1Points: 0,
        p2Points: 0,
        tick,
        lastEvent: null,
      }
    }

    case 'RESET_MATCH': {
      return {
        ...emptySnapshot,
        config: state.config,
        phase: 'live',
        past: [],
        tick,
        lastEvent: null,
      }
    }

    case 'NEW_MATCH': {
      return { ...emptySnapshot, config: state.config, past: [], tick, lastEvent: null }
    }

    default:
      return state
  }
}

function loadState(): MatchState {
  if (typeof window === 'undefined') return initialState
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return initialState
    const parsed = JSON.parse(raw) as Partial<MatchState>
    if (!parsed.config) return initialState
    return {
      ...initialState,
      ...parsed,
      past: [],
      lastEvent: null,
    }
  } catch {
    return initialState
  }
}

interface MatchContextValue {
  state: MatchState
  startMatch: (config: MatchConfig) => void
  addPoint: (player: PlayerId) => void
  removePoint: (player: PlayerId) => void
  undo: () => void
  resetSet: () => void
  resetMatch: () => void
  newMatch: () => void
  canUndo: boolean
}

const MatchContext = createContext<MatchContextValue | null>(null)

export function MatchProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState)

  useEffect(() => {
    try {
      const persist = {
        config: state.config,
        p1Points: state.p1Points,
        p2Points: state.p2Points,
        p1Sets: state.p1Sets,
        p2Sets: state.p2Sets,
        completedSets: state.completedSets,
        phase: state.phase,
        winner: state.winner,
      }
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(persist))
    } catch {
      /* storage unavailable — ignore */
    }
  }, [state])

  const value = useMemo<MatchContextValue>(
    () => ({
      state,
      startMatch: (config) => dispatch({ type: 'START', config }),
      addPoint: (player) => dispatch({ type: 'POINT', player }),
      removePoint: (player) => dispatch({ type: 'DECREMENT', player }),
      undo: () => dispatch({ type: 'UNDO' }),
      resetSet: () => dispatch({ type: 'RESET_SET' }),
      resetMatch: () => dispatch({ type: 'RESET_MATCH' }),
      newMatch: () => dispatch({ type: 'NEW_MATCH' }),
      canUndo: state.past.length > 0,
    }),
    [state],
  )

  return <MatchContext.Provider value={value}>{children}</MatchContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useMatch(): MatchContextValue {
  const ctx = useContext(MatchContext)
  if (!ctx) throw new Error('useMatch must be used within a MatchProvider')
  return ctx
}
