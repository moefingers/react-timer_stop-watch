import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import { useInterval } from 'usehooks-ts'

export default function App() {

const [currentTime, setCurrentTime] = useState(Date.now())


const [oldStopwatchTime, setOldStopwatchTime] = useState(0)

const [stopwatchTime, setStopwatchTime] = useState(0)

const [timeStampA, setTimeStampA] = useState(Date.now())



const [timeOnPageLoad, setTimeOnPageLoad] = useState(Date.now())

function getTimePassedSincePageLoad() {
  return Date.now() - timeOnPageLoad
}



const [useIntervalActive, setUseIntervalActive] = useState(false)

useInterval(() => {
  setStopwatchTime(oldStopwatchTime + Date.now() - timeStampA)
}, useIntervalActive ? 10 : null)



// when you resume the stop watch you want to subtract the time that has passed since stopping
// or you want to record only the time since starting again in addition to the time that was recorded before
function runStopWatch() {
  setTimeStampA(Date.now()) // freshen time stamp A
  setOldStopwatchTime(stopwatchTime) // document old time
  setUseIntervalActive(!useIntervalActive) // begin updating difference in time by activating interval

}

  return (
    <div className='app-container'>
      <div>Time on Page Load: {timeOnPageLoad}</div>
        <div>Current Time: {currentTime}</div>
        <div>TimeStampA: {timeStampA}</div>
        <div>Stopwatch: {stopwatchTime}</div>
        <button onClick={() => runStopWatch()}>{useIntervalActive ? 'Stop' : 'Watch'}</button>
        <button onClick={() => setStopwatchTime(0)}>Reset</button>
    </div>
  )
  
}