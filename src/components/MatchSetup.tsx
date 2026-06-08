import { useState, type FormEvent } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { useMatch } from '../match/MatchContext'
import { setsToWin } from '../match/logic'

const BEST_OF = [1, 3, 5, 7]
const PRESET_POINTS = [11, 15, 21]

export default function MatchSetup() {
  const { state, startMatch } = useMatch()
  const [p1Name, setP1Name] = useState(
    state.config.p1Name === 'Player 1' ? '' : state.config.p1Name,
  )
  const [p2Name, setP2Name] = useState(
    state.config.p2Name === 'Player 2' ? '' : state.config.p2Name,
  )
  const [bestOf, setBestOf] = useState(state.config.bestOf)
  const [points, setPoints] = useState(state.config.targetPoints)
  const [custom, setCustom] = useState(
    PRESET_POINTS.includes(state.config.targetPoints)
      ? ''
      : String(state.config.targetPoints),
  )

  const target = custom !== '' ? Number(custom) : points
  const validPoints = Number.isInteger(target) && target >= 3 && target <= 99

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!validPoints) return
    startMatch({
      p1Name: p1Name.trim() || 'Player 1',
      p2Name: p2Name.trim() || 'Player 2',
      bestOf,
      targetPoints: target,
    })
  }

  return (
    <div className="setup-stage">
      <div className="setup-grain" aria-hidden />
      <form className="setup-card" onSubmit={submit}>
        <header className="setup-head">
          <div className="brand">
            <span className="brand-name">PONG<span>HUB</span></span>
          </div>
          <p className="brand-tag">Fast. Accurate. Match Ready.</p>
        </header>

        <section className="setup-section">
          <h2 className="field-label">Players</h2>
          <div className="player-inputs">
            <label className="name-field name-field--p1">
              <span className="name-tag">Player 1</span>
              <input
                value={p1Name}
                onChange={(e) => setP1Name(e.target.value)}
                placeholder="Enter name"
                maxLength={18}
                autoFocus
              />
            </label>
            <span className="versus">VS</span>
            <label className="name-field name-field--p2">
              <span className="name-tag">Player 2</span>
              <input
                value={p2Name}
                onChange={(e) => setP2Name(e.target.value)}
                placeholder="Enter name"
                maxLength={18}
              />
            </label>
          </div>
        </section>

        <section className="setup-section">
          <h2 className="field-label">
            Match length
            <span className="field-hint">First to {setsToWin(bestOf)} {setsToWin(bestOf) === 1 ? 'set' : 'sets'}</span>
          </h2>
          <div className="seg-group" role="radiogroup" aria-label="Best of sets">
            {BEST_OF.map((n) => (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={bestOf === n}
                className={`seg ${bestOf === n ? 'is-active' : ''}`}
                onClick={() => setBestOf(n)}
              >
                <span className="seg-top">Best of</span>
                <span className="seg-big">{n}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="setup-section">
          <h2 className="field-label">
            Points per set
            <span className="field-hint">Win by 2</span>
          </h2>
          <div className="seg-group seg-group--points" role="radiogroup" aria-label="Points per set">
            {PRESET_POINTS.map((n) => (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={custom === '' && points === n}
                className={`seg seg--point ${custom === '' && points === n ? 'is-active' : ''}`}
                onClick={() => {
                  setPoints(n)
                  setCustom('')
                }}
              >
                <span className="seg-big">{n}</span>
              </button>
            ))}
            <label className={`seg seg--custom ${custom !== '' ? 'is-active' : ''}`}>
              <span className="seg-top">Custom</span>
              <input
                type="number"
                min={3}
                max={99}
                inputMode="numeric"
                value={custom}
                placeholder="—"
                onChange={(e) => setCustom(e.target.value)}
              />
            </label>
          </div>
        </section>

        <button type="submit" className="start-btn" disabled={!validPoints}>
          <span>Start Match</span>
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </form>
    </div>
  )
}
