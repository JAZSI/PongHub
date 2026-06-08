import { useMatch } from '../match/MatchContext'

export default function SetHistory() {
  const { state } = useMatch()
  const { completedSets, config, phase } = state
  const liveSet = phase === 'live' ? completedSets.length + 1 : null

  return (
    <aside className="history" aria-label="Set history">
      <div className="history-head">
        <h3>Set History</h3>
        <span className="history-meta">{config.p1Name} <em>vs</em> {config.p2Name}</span>
      </div>

      {completedSets.length === 0 ? (
        <p className="history-empty">
          {phase === 'live'
            ? 'Set 1 in progress — completed sets appear here.'
            : 'No sets played yet.'}
        </p>
      ) : (
        <ol className="history-list">
          {completedSets.map((s) => (
            <li key={s.index} className={`history-row winner-p${s.winner}`}>
              <span className="hr-label">Set {s.index}</span>
              <span className="hr-score">
                <b className={s.winner === 1 ? 'win' : ''}>{s.p1}</b>
                <i>–</i>
                <b className={s.winner === 2 ? 'win' : ''}>{s.p2}</b>
              </span>
            </li>
          ))}
        </ol>
      )}

      {liveSet !== null && (
        <div className="history-live">
          <span className="live-dot" /> Set {liveSet} live
        </div>
      )}
    </aside>
  )
}
