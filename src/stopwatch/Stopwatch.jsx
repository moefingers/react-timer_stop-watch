import { useEffect, useRef, useState } from 'react'
import { useInterval } from 'usehooks-ts'

import { fadeOpacityIn, slideInFromLeft, slideInFromRight, slideOutToRight, slideOutToLeft } from '../assets/Animations'
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
// const [stopwatchListMatrix, setStopwatchListMatrix] = useState([{name: "list one", array: [{time: 333, lastDifference: 4, reason: 'Stopped'}]}])

const defaultStopwatchListItemObject = {storedTime: 0, name: "list one", array: []}
const [stopwatchListMatrix, setStopwatchListMatrix] = useState([defaultStopwatchListItemObject])
const [stopwatchListSelectedIndex, setStopwatchListSelectedIndex] = useState(0)
// function to run (resume) stopwatch
function runStopWatch() {
  setTimeOfLastStopwatchChange(Date.now()) // freshen time stamp A
  setLastStoppedStopwatchTime(stopwatchTime) // document old time
  

  if(stopwatchTime > 0 && useIntervalActive){addLapTimeToStopwatchArray("Stopped")}
  !useIntervalActive && setLapAndStopped(false)
  setUseIntervalActive(!useIntervalActive) // begin updating difference in time by activating interval
}

function updateMatrix(objectIndex, updateObject) {
  console.log(updateObject)
  let splicedMatrix = [...stopwatchListMatrix]
  splicedMatrix.splice(objectIndex, 1)
  setStopwatchListMatrix([
    ...splicedMatrix,
    
    Object.assign({}, stopwatchListMatrix[stopwatchListSelectedIndex], updateObject)
    
  ])
}
// function to add lap time to timePassedStopwatchArray
function addLapTimeToStopwatchArray(reason) {
  setLastLapStopwatchTime(stopwatchTime)
  if(stopwatchTime === 0) return
  let alreadyContainsTimeType = ""  // initialize already contains situation
  let indexOfTimeObjectToUpdate
  console.log(stopwatchListMatrix)
  console.log(stopwatchListMatrix[stopwatchListSelectedIndex].name)
  stopwatchListMatrix[stopwatchListSelectedIndex].array.forEach((object, index) => { // for each object {time: 999, reason: 'Lap' || 'Stopped' || 'Stopped and Lap'}
    if(object.time === stopwatchTime){ // if time is the same
      if (object.reason === 'Stopped') {alreadyContainsTimeType = "Stopped"; indexOfTimeObjectToUpdate = index} // already contains time of the STOPPED reason
      else if (object.reason === 'Lap' || object.reason === 'Stopped and Lap') {alreadyContainsTimeType = "Lap"} // already contains time of LAP or STOPPED AND LAP reason
    }
  }) // end for each 
  if(alreadyContainsTimeType == "Stopped"){ // if already contains time of the STOPPED reason
    let {lastDifference} = stopwatchListMatrix[stopwatchListSelectedIndex].array[indexOfTimeObjectToUpdate]
    stopwatchListMatrix[stopwatchListSelectedIndex].array.splice(indexOfTimeObjectToUpdate, 1) // remove the old one from the array
    let splicedMatrix = [...stopwatchListMatrix]
    splicedMatrix.splice(stopwatchListSelectedIndex, 1)


    setStopwatchListMatrix([
      ...splicedMatrix,
      Object.assign({}, stopwatchListMatrix[stopwatchListSelectedIndex], {array: [
        ...stopwatchListMatrix[stopwatchListSelectedIndex].array,
        {time: stopwatchTime, lastDifference: lastDifference, reason: 'Stopped and Lap'}
      ]}
    )
    ])



    setLapAndStopped(true)
  }

  if (alreadyContainsTimeType == "" || reason == "Stopped") { // add time with LAP type if it doesn't already exist as any other type

    let splicedMatrix = [...stopwatchListMatrix]
    splicedMatrix.splice(stopwatchListSelectedIndex, 1)
    setStopwatchListMatrix([
      ...splicedMatrix,
      
      Object.assign({}, stopwatchListMatrix[stopwatchListSelectedIndex], {array: [
        ...stopwatchListMatrix[stopwatchListSelectedIndex].array, 
        {time: stopwatchTime, lastDifference: stopwatchTime - lastLapStopwatchTime, reason: typeof reason == 'string' && reason || 'Lap'}
      ]})
      
    ])
  
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


    useEffect(() => {
      console.log( lastStoppedStopwatchTime)
      if(lastStoppedStopwatchTime == stopwatchListMatrix[stopwatchListSelectedIndex].storedTime) return
      updateMatrix(stopwatchListSelectedIndex, {storedTime: lastStoppedStopwatchTime})
    }, [lastLapStopwatchTime])
// reset
function resetAndCreateNewList(event){
  setStopwatchTime(0);
  setLastLapStopwatchTime(0)
  setStopwatchListMatrix([...stopwatchListMatrix, Object.assign({}, defaultStopwatchListItemObject, {name: `List ${stopwatchListMatrix.length + 1}`})])
  
  nextList(event, stopwatchListMatrix.length)
}

function nextList(event, overrideIndex = null){
  console.log(overrideIndex)
  if(stopwatchListSelectedIndex == stopwatchListMatrix.length - 1 && overrideIndex == null) return
  stopwatchListElement.current.animate(slideOutToLeft, 250)
  setTimeout(() => {
    let newSelectedIndex = overrideIndex || stopwatchListSelectedIndex + 1
    console.log(newSelectedIndex)
    setStopwatchListSelectedIndex(newSelectedIndex)
    stopwatchListElement.current.animate(slideInFromRight, 250)
  }, 250);
}

function previousList(){
  if(stopwatchListSelectedIndex == 0) return
  stopwatchListElement.current.animate(slideOutToRight, 250)
  setTimeout(() => {
    let newSelectedIndex = stopwatchListSelectedIndex - 1
    console.log(newSelectedIndex)
    setStopwatchListSelectedIndex(newSelectedIndex)
    stopwatchListElement.current.animate(slideInFromLeft, 250)
  }, 250);
}

useEffect(() => {
  let newTime = stopwatchListMatrix[stopwatchListSelectedIndex].storedTime
  stopwatchListNameInput.current.value = stopwatchListMatrix[stopwatchListSelectedIndex]?.name
  setLastStoppedStopwatchTime(newTime)
  setLastLapStopwatchTime(newTime)
  setStopwatchTime(newTime)

  console.log(stopwatchListMatrix[stopwatchListSelectedIndex].array)
}, [ stopwatchListSelectedIndex])

const stopwatchListNameInput = useRef()

    return (
        <div className="stopwatch-container">
          <button className='console-log-matrix' onClick={() => console.log(stopwatchListMatrix)}>console matrix</button>
          <button className="changenamelistone" onClick={() => {
            setStopwatchListMatrix(Object.assign(
              {}, 
              stopwatchListMatrix,
              {[0] : Object.assign(stopwatchListMatrix[0], {name: "fdf"})}
              ));
            }}>Change l1 name</button>{stopwatchListSelectedIndex}
            <div>{timeOfLastStopwatchChange} - Time of Last Stopwatch Change</div>
            <div>Last Stopped Stopwatch Time: {lastStoppedStopwatchTime}</div>
            <div>Stopwatch: {stopwatchTime}</div>
            <div>Last Lap Time: {lastLapStopwatchTime}</div>
            <button onClick={() => runStopWatch()}>{useIntervalActive ? 'Stop' : 'Watch'}</button>
            {!useIntervalActive && <button onClick={resetAndCreateNewList}>Reset</button>}
            {!lapAndStopped&& !stopwatchTime == 0 && <button onClick={addLapTimeToStopwatchArray}>Lap</button>}
            
            {true && <div ref={stopwatchListElement} className='stopwatch-list-container'>
              
              <div ref={stopwatchScrollElement} className="stopwatch-scroll-container">
                {stopwatchListMatrix.length > 0 && stopwatchListMatrix.filter((list, index) => {index !== stopwatchListSelectedIndex}).map((list, index) => (
                  <h2 key={index} onClick={() => setStopwatchListSelectedIndex(index)}>{list.name}</h2>
                ))}
                <ul className='stopwatch-unordered-list'>{stopwatchListMatrix[stopwatchListSelectedIndex]?.array.length > 0 && stopwatchListMatrix[stopwatchListSelectedIndex].array.map((object, index) => (
                    <StopwatchTimeItem key={index} passedKey={index} object={object} stopwatchListElement={stopwatchListElement}/>
                ))}
                </ul>
              </div>
              <button className='stopwatch-previous-list-button' onClick={previousList}>◀</button>
              <input ref={ stopwatchListNameInput} className='stopwatch-list-name-input' type="text" placeholder='Stopwatch List Name' defaultValue={stopwatchListMatrix[stopwatchListSelectedIndex].name}/>
              <button className='stopwatch-next-list-button' onClick={nextList}>▶</button>
            </div>}
      </div>
    )
}