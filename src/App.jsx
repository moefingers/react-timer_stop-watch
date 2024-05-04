import './App.css'
import Stopwatch from './stopwatch/Stopwatch'
import Timer from './timer/Timer'
import { useState } from 'react'

export default function App() {
const [noShadow, setNoShadow] = useState(false)
// render App
  return (
    <div className='app-container'>
      <button className='shadow-button' onClick={() => setNoShadow(!noShadow)}>⚙</button>
      {noShadow && <style>{`* {text-shadow: 0 0 0 !important} button.shadow-button{color: rgba(180,180,180,1)}`}</style>}
      <Stopwatch/>
      <Timer/>
    </div>
  )
}