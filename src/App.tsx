import { MatchProvider, useMatch } from './match/MatchContext'
import MatchSetup from './components/MatchSetup'
import Scoreboard from './components/Scoreboard'
import WinnerModal from './components/WinnerModal'
import './ponghub.css'

function Stage() {
  const { state } = useMatch()
  return (
    <>
      {state.phase === 'setup' ? <MatchSetup /> : <Scoreboard />}
      {state.phase === 'finished' && <WinnerModal />}
    </>
  )
}

export default function App() {
  return (
    <MatchProvider>
      <Stage />
    </MatchProvider>
  )
}
