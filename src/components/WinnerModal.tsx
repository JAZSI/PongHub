import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrophy } from '@fortawesome/free-solid-svg-icons'
import { useMatch } from '../match/MatchContext'

export default function WinnerModal() {
  const { state, newMatch, resetMatch } = useMatch()
  const { winner, config, completedSets, p1Sets, p2Sets } = state
  if (winner === null) return null

  const winnerName = winner === 1 ? config.p1Name : config.p2Name

  return (
    <div className="winner-overlay" role="dialog" aria-modal="true" aria-label="Match winner">
      <div className={`winner-card winner-card--p${winner}`}>
        <div className="winner-trophy"><FontAwesomeIcon icon={faTrophy} /></div>
        <p className="winner-kicker">Match Winner</p>
        <h1 className="winner-name">{winnerName}</h1>

        <div className="winner-sets">
          <span className="ws-num">{p1Sets}</span>
          <span className="ws-sep">sets</span>
          <span className="ws-num">{p2Sets}</span>
        </div>

        <div className="winner-summary">
          <span className="summary-name">{config.p1Name}</span>
          <ul className="summary-scores">
            {completedSets.map((s) => (
              <li key={s.index} className={`summary-set winner-p${s.winner}`}>
                <b className={s.winner === 1 ? 'win' : ''}>{s.p1}</b>
                <i>–</i>
                <b className={s.winner === 2 ? 'win' : ''}>{s.p2}</b>
              </li>
            ))}
          </ul>
          <span className="summary-name">{config.p2Name}</span>
        </div>

        <div className="winner-actions">
          <button type="button" className="start-btn" onClick={newMatch}>
            New Match
          </button>
          <button type="button" className="ctrl-btn ctrl-btn--ghost" onClick={resetMatch}>
            Rematch (same setup)
          </button>
        </div>
      </div>
    </div>
  )
}
