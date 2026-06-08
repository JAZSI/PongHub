import { useMatch } from '../match/MatchContext'
import {
  currentServer,
  setsToWin,
  situation,
  startServerForSet,
} from '../match/logic'
import PlayerPanel from './PlayerPanel'
import ControlPanel from './ControlPanel'
import SetHistory from './SetHistory'

export default function Scoreboard() {
  const { state, newMatch } = useMatch()
  const { config, p1Points, p2Points, p1Sets, p2Sets, completedSets } = state

  const need = setsToWin(config.bestOf)
  const target = config.targetPoints
  const startServer = startServerForSet(completedSets.length)
  const server = currentServer(p1Points, p2Points, target, startServer)
  const flags = situation(p1Points, p2Points, p1Sets, p2Sets, config)
  const currentSet = completedSets.length + 1

  let centerBadge = ''
  if (flags.p1MatchPoint || flags.p2MatchPoint) centerBadge = 'Match Point'
  else if (flags.deuce && p1Points === p2Points) centerBadge = 'Deuce'
  else if (flags.deuce) centerBadge = `Advantage ${p1Points > p2Points ? config.p1Name : config.p2Name}`
  else if (flags.p1SetPoint || flags.p2SetPoint) centerBadge = 'Set Point'

  return (
    <div className="board">
      <header className="topbar">
        <div className="brand brand--sm">
          <span className="brand-name">PONG<span>HUB</span></span>
        </div>

        <div className="match-meta">
          <span className="meta-chip">Best of {config.bestOf}</span>
          <span className="meta-dot" />
          <span className="meta-chip">First to {need}</span>
          <span className="meta-dot" />
          <span className="meta-chip">{target} pts · win by 2</span>
        </div>

        <div className="topbar-actions">
          <button type="button" className="text-btn" onClick={newMatch}>
            New Match
          </button>
        </div>
      </header>

      <main className="arena">
        <div className="set-banner">
          <span className="set-banner-label">Set {currentSet}</span>
          {centerBadge && (
            <span
              key={centerBadge + state.tick}
              className={`center-badge ${
                centerBadge === 'Match Point'
                  ? 'is-match'
                  : centerBadge === 'Deuce'
                    ? 'is-deuce'
                    : 'is-set'
              }`}
            >
              {centerBadge}
            </span>
          )}
        </div>

        <div className="court">
          <PlayerPanel
            player={1}
            name={config.p1Name}
            points={p1Points}
            sets={p1Sets}
            serving={server === 1}
            setPoint={flags.p1SetPoint}
            matchPoint={flags.p1MatchPoint}
          />

          <div className="court-divider" aria-hidden>
            <span className="vs-badge">VS</span>
          </div>

          <PlayerPanel
            player={2}
            name={config.p2Name}
            points={p2Points}
            sets={p2Sets}
            serving={server === 2}
            setPoint={flags.p2SetPoint}
            matchPoint={flags.p2MatchPoint}
          />
        </div>

        <ControlPanel />
      </main>

      <SetHistory />

      {state.lastEvent?.type === 'set' && (
        <div
          key={state.tick}
          className={`set-flash set-flash--p${state.lastEvent.player}`}
          aria-hidden
        />
      )}
    </div>
  )
}
