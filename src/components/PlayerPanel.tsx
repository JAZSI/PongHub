import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPlus,
  faMinus,
  faTableTennisPaddleBall,
} from '@fortawesome/free-solid-svg-icons'
import { useMatch } from '../match/MatchContext'
import { setsToWin } from '../match/logic'
import type { PlayerId } from '../match/types'

interface Props {
  player: PlayerId
  name: string
  points: number
  sets: number
  serving: boolean
  setPoint: boolean
  matchPoint: boolean
}

export default function PlayerPanel({
  player,
  name,
  points,
  sets,
  serving,
  setPoint,
  matchPoint,
}: Props) {
  const { state, addPoint, removePoint } = useMatch()
  const need = setsToWin(state.config.bestOf)
  const side = player === 1 ? 'p1' : 'p2'

  return (
    <section
      className={`panel panel--${side} ${serving ? 'is-serving' : ''}`}
      aria-label={`${name} scoring`}
    >
      <button
        type="button"
        className="panel-tap"
        onClick={() => addPoint(player)}
        aria-label={`Add point for ${name}`}
      >
        <div className="panel-head">
          <div className="panel-name-row">
            <h2 className="panel-name" title={name}>{name}</h2>
          </div>
          <div className="sets-row" aria-label={`${sets} of ${need} sets won`}>
            <span className="sets-num">{sets}</span>
            <span className="sets-pips">
              {Array.from({ length: need }).map((_, i) => (
                <span key={i} className={`pip ${i < sets ? 'won' : ''}`} />
              ))}
            </span>
          </div>
          <span
            className="serve-badge"
            data-on={serving}
            aria-label={serving ? `${name} is serving` : `${name} is receiving`}
          >
            <FontAwesomeIcon icon={faTableTennisPaddleBall} />
            <span>{serving ? 'Serving' : 'Receiving'}</span>
          </span>
        </div>

        {(matchPoint || setPoint) && (
          <span className={`mini-badge ${matchPoint ? 'match' : 'set'}`}>
            {matchPoint ? 'Match Point' : 'Set Point'}
          </span>
        )}

        <div className="score-wrap">
          <span key={points} className="score">
            {String(points).padStart(2, '0')}
          </span>
        </div>
      </button>

      <div className="panel-controls">
        <button
          type="button"
          className="ctl ctl--minus"
          onClick={() => removePoint(player)}
          disabled={points === 0}
          aria-label={`Remove point from ${name}`}
        >
          <FontAwesomeIcon icon={faMinus} />
        </button>
        <button
          type="button"
          className="ctl ctl--plus"
          onClick={() => addPoint(player)}
          aria-label={`Add point for ${name}`}
        >
          <FontAwesomeIcon icon={faPlus} />
          <span>Point</span>
        </button>
      </div>
    </section>
  )
}
