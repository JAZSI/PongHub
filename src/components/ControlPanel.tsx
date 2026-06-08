import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowRotateLeft,
  faArrowsRotate,
  faPowerOff,
} from '@fortawesome/free-solid-svg-icons'
import { useMatch } from '../match/MatchContext'

export default function ControlPanel() {
  const { undo, resetSet, resetMatch, canUndo, state } = useMatch()
  const [confirming, setConfirming] = useState(false)
  const setEmpty = state.p1Points === 0 && state.p2Points === 0

  return (
    <div className="controls" role="group" aria-label="Match controls">
      <button
        type="button"
        className="ctrl-btn"
        onClick={undo}
        disabled={!canUndo}
      >
        <FontAwesomeIcon icon={faArrowRotateLeft} />
        <span>Undo</span>
      </button>

      <button
        type="button"
        className="ctrl-btn"
        onClick={resetSet}
        disabled={setEmpty}
      >
        <FontAwesomeIcon icon={faArrowsRotate} />
        <span>Reset Set</span>
      </button>

      {confirming ? (
        <div className="confirm">
          <span className="confirm-q">Reset match?</span>
          <button
            type="button"
            className="ctrl-btn ctrl-btn--danger"
            onClick={() => {
              resetMatch()
              setConfirming(false)
            }}
          >
            Confirm
          </button>
          <button
            type="button"
            className="ctrl-btn ctrl-btn--ghost"
            onClick={() => setConfirming(false)}
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          type="button"
          className="ctrl-btn ctrl-btn--warn"
          onClick={() => setConfirming(true)}
        >
          <FontAwesomeIcon icon={faPowerOff} />
          <span>Reset Match</span>
        </button>
      )}
    </div>
  )
}
