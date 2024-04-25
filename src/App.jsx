import { useEffect, useState } from 'react'
import './App.css'
import StopwatchTimeItem from './StopwatchTimeItem'

import { useInterval } from 'usehooks-ts'

export default function App() {

  // development
const [currentTime, setCurrentTime] = useState(Date.now())
const [timeOnPageLoad, setTimeOnPageLoad] = useState(Date.now())


// Stopwatch and useinterval

//states
const [timeOfLastStopwatchChange, setTimeOfLastStopwatchChange] = useState(Date.now()) // Time of Last Stopwatch Change // time stamp IE 1714009411220 ms
const [oldStopwatchTime, setOldStopwatchTime] = useState(0) // Old Stopwatch Time to record previous active time // Not timestamp IE 3000 ms
const [stopwatchTime, setStopwatchTime] = useState(0) // Stopwatch Time (total time while active) // Not timestamp IE 3123 ms
const [useIntervalActive, setUseIntervalActive] = useState(false) // Use Interval Active State (to turn on and on recording of time difference since last activation)// true = on / false = off

const [timePassedStopwatchArray, setTimePassedStopwatchArray] = useState([])
// function to run (resume) stopwatch
function runStopWatch() {
  setTimeOfLastStopwatchChange(Date.now()) // freshen time stamp A
  setOldStopwatchTime(stopwatchTime) // document old time

  if(useIntervalActive){ // if useIntervalActive is true - that means we're stopping the watch. So let's record the time and reason for listing it.
    setTimePassedStopwatchArray(timePassedStopwatchArray => [...timePassedStopwatchArray, {time: stopwatchTime, reason: 'Stopped'}])
  }
  setUseIntervalActive(!useIntervalActive) // begin updating difference in time by activating interval
}
// function to add lap time to timePassedStopwatchArray
function addLapTimeToStopwatchArray() {
  let alreadyContainsLap = false
  timePassedStopwatchArray.forEach((element) => {
    if(element.reason === 'Lap' && element.time === stopwatchTime){
      alreadyContainsLap = true
    }
  })
  !alreadyContainsLap && setTimePassedStopwatchArray(timePassedStopwatchArray => [...timePassedStopwatchArray, {time: stopwatchTime, reason: 'Lap'}])
}
// interval updates every number of ms while state active
useInterval(() => {
  setStopwatchTime(oldStopwatchTime + Date.now() - timeOfLastStopwatchChange)
}, useIntervalActive ? 10 : null)




// render App
  return (
    <div className='app-container'>
      <div className="stopwatch-container">
        <div>{timeOnPageLoad} - Time on Page Load</div>
        <div>{currentTime} - Current Time</div>
        <div>{timeOfLastStopwatchChange} - Time of Last Stopwatch Change</div>
        <div>Old Stopwatch Time: {oldStopwatchTime}</div>
        <div>Stopwatch: {stopwatchTime}</div>
        <button onClick={() => runStopWatch()}>{useIntervalActive ? 'Stop' : 'Watch'}</button>
        <button onClick={() => setStopwatchTime(0)}>Reset</button>
        <button onClick={addLapTimeToStopwatchArray}>Lap</button>
        
        <ul className='stopwatch-list-container'>
          {timePassedStopwatchArray.length > 0 && timePassedStopwatchArray.map((object, index) => (
            <StopwatchTimeItem key={index} object={object}/>
          ))}
        </ul>
      </div>
      <button onClick={(e) => {e.target.animate(fadeOpacityIn,500)}}>HIIIIIIIIIII</button>
    </div>
  )
  
}