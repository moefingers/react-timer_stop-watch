import { useEffect, useRef, useState } from 'react'
import { useInterval } from 'usehooks-ts'

import StopwatchTimeItem from './StopwatchTimeItem'
export default function Stopwatch() {

    // Stopwatch and useinterval

//states
const [timeOfLastStopwatchChange, setTimeOfLastStopwatchChange] = useState(Date.now()) // Time of Last Stopwatch Change // time stamp IE 1714009411220 ms
const [lastStoppedStopwatchTime, setLastStoppedStopwatchTime] = useState(0) // Old Stopwatch Time to record previous active time // Not timestamp IE 3000 ms
const [lastLapStopwatchTime, setLastLapStopwatchTime] = useState(0) // Old Stopwatch Time to record previous lap time // Not timestamp IE 3000 ms
const [stopwatchTime, setStopwatchTime] = useState(0) // Stopwatch Time (total time while active) // Not timestamp IE 3123 ms
const [useIntervalActive, setUseIntervalActive] = useState(false) // Use Interval Active State (to turn on and on recording of time difference since last activation)// true = on / false = off
const [lapAndStopped, setLapAndStopped] = useState(false)

const [timePassedStopwatchArray, setTimePassedStopwatchArray] = useState([])
// function to run (resume) stopwatch
function runStopWatch() {
  setTimeOfLastStopwatchChange(Date.now()) // freshen time stamp A
  setLastStoppedStopwatchTime(stopwatchTime) // document old time

  if(stopwatchTime > 0 && useIntervalActive){addLapTimeToStopwatchArray("Stopped")}
  !useIntervalActive && setLapAndStopped(false)
  setUseIntervalActive(!useIntervalActive) // begin updating difference in time by activating interval
}

// function to add lap time to timePassedStopwatchArray
function addLapTimeToStopwatchArray(reason) {
  setLastLapStopwatchTime(stopwatchTime)
  if(stopwatchTime === 0) return
  let alreadyContainsTimeType = ""  // initialize already contains situation
  let indexOfTimeObjectToUpdate
  timePassedStopwatchArray.forEach((object, index) => { // for each object {time: 999, reason: 'Lap' || 'Stopped' || 'Stopped and Lap'}
    if(object.time === stopwatchTime){ // if time is the same
      if (object.reason === 'Stopped') {alreadyContainsTimeType = "Stopped"; indexOfTimeObjectToUpdate = index} // already contains time of the STOPPED reason
      else if (object.reason === 'Lap' || object.reason === 'Stopped and Lap') {alreadyContainsTimeType = "Lap"} // already contains time of LAP or STOPPED AND LAP reason
    }
  }) // end for each 
  if(alreadyContainsTimeType == "Stopped"){ // if already contains time of the STOPPED reason
    let {lastDifference} = timePassedStopwatchArray[indexOfTimeObjectToUpdate]
    timePassedStopwatchArray.splice(indexOfTimeObjectToUpdate, 1) // remove the old one from the array
    setTimePassedStopwatchArray([...timePassedStopwatchArray, {time: stopwatchTime, lastDifference: lastDifference, reason: 'Stopped and Lap'}]) // add a new one with the same time and change to STOPPED AND LAP reason
    setLapAndStopped(true)
  }
  if (reason == "Stopped"){
    setTimePassedStopwatchArray(timePassedStopwatchArray => [...timePassedStopwatchArray, {time: stopwatchTime, lastDifference: stopwatchTime - lastStoppedStopwatchTime, reason: 'Stopped'}])
  }
  else if (alreadyContainsTimeType == "") { // add time with LAP type if it doesn't already exist as any other type
    setTimePassedStopwatchArray(timePassedStopwatchArray => [...timePassedStopwatchArray, {time: stopwatchTime, lastDifference: stopwatchTime - lastLapStopwatchTime, reason: 'Lap'}])
  } // include old array and tag on time with LAP reason
}
// interval updates every number of ms while state active
useInterval(() => {
  setStopwatchTime(lastStoppedStopwatchTime + Date.now() - timeOfLastStopwatchChange)
}, useIntervalActive ? 10 : null)

const stopwatchListElement = useRef()
const stopwatchScrollElement = useRef()

    useEffect(() => {
      if(stopwatchScrollElement.current){
      stopwatchScrollElement.current.style= `padding-right: ${stopwatchScrollElement.current.offsetWidth - stopwatchScrollElement.current.clientWidth}px`
      }
    }, [stopwatchScrollElement.current])

    return (
        <div className="stopwatch-container">
            <div>{timeOfLastStopwatchChange} - Time of Last Stopwatch Change</div>
            <div>Old Stopwatch Time: {lastStoppedStopwatchTime}</div>
            <div>Stopwatch: {stopwatchTime}</div>
            <div>Last Lap Time: {lastLapStopwatchTime}</div>
            <button onClick={() => runStopWatch()}>{useIntervalActive ? 'Stop' : 'Watch'}</button>
            {!useIntervalActive && <button onClick={() => setStopwatchTime(0)}>Reset</button>}
            {!lapAndStopped&& !stopwatchTime == 0 && <button onClick={addLapTimeToStopwatchArray}>Lap</button>}
            
            {true && <div ref={stopwatchListElement} className='stopwatch-list-container'>
              <div ref={stopwatchScrollElement} className="stopwatch-scroll-container">
                <h2>History</h2>
                <ul className='stopwatch-unordered-list'>{timePassedStopwatchArray.length > 0 && timePassedStopwatchArray.map((object, index) => (
                    <StopwatchTimeItem key={index} passedKey={index} object={object} stopwatchListElement={stopwatchListElement}/>
                ))}
                </ul>
              </div>
            </div>}
      </div>
    )
}