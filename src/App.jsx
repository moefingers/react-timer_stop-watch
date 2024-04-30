import './App.css'
import Stopwatch from './stopwatch/Stopwatch'
import Timer from './timer/Timer'

export default function App() {

// render App
  return (
    <div className='app-container'>
      <Stopwatch/>
      <Timer/>
    </div>
  )
}