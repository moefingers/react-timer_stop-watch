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
const [avgLapTime, setAvgLapTime] = useState(0) // stored average lap time
const [avgLapTimeWithoutStopped, setAvgLapTimeWithoutStopped] = useState(0) // stored avg lap time excluding stpped times
const [stopwatchTime, setStopwatchTime] = useState(0) // Stopwatch Time (total time while active) // Not timestamp IE 3123 ms
const [useIntervalActive, setUseIntervalActive] = useState(false) // Use Interval Active State (to turn on and on recording of time difference since last activation)// true = on / false = off
const [lapAndStopped, setLapAndStopped] = useState(false)


// const [stopwatchListMatrix, setStopwatchListMatrix] = useState([{name: "list one", array: [{time: 333, lastDifference: 4, reason: 'Stopped'}]}])

const defaultStopwatchListItemObject = { storedTime: 0, name: "list one", array: []}
const [stopwatchListObject, setStopwatchListObject] = useState({0: defaultStopwatchListItemObject})
const [stopwatchListSelectedPseudoIndex, setStopwatchListSelectedPseudoIndex] = useState(0)
// function to run (resume) stopwatch
function runStopWatch() {
  setTimeOfLastStopwatchChange(Date.now()) // freshen time stamp A
  setLastStoppedStopwatchTime(stopwatchTime) // document old time
  

  if(stopwatchTime > 0 && useIntervalActive){addLapTimeToStopwatchArray("Stopped")}
  !useIntervalActive && setLapAndStopped(false)
  setUseIntervalActive(!useIntervalActive) // begin updating difference in time by activating interval
}

function updateMatrix(objectPseudoIndex, updateObject) {
  setStopwatchListObject(Object.assign({},stopwatchListObject, {[objectPseudoIndex]: Object.assign({},stopwatchListObject[objectPseudoIndex], updateObject)}))
}
// function to add lap time to timePassedStopwatchArray
function addLapTimeToStopwatchArray(reason) {
  setLastLapStopwatchTime(stopwatchTime)
  if(stopwatchTime === 0) return
  let alreadyContainsTimeType = ""  // initialize already contains situation
  let indexOfTimeObjectToUpdate
  let lapArray = []
  let lapArrayWithoutStopped = []
  let totalLapTime = 0
  let totalLapTimeWithoutStopped = 0
  stopwatchListObject[stopwatchListSelectedPseudoIndex].array.forEach((object, index) => { // for each object {time: 999, reason: 'Lap' || 'Stopped' || 'Stopped and Lap'}
    lapArray.push(object.lastDifference)
    totalLapTime += object.lastDifference
    if(object.reason !== 'Stopped'){
      lapArrayWithoutStopped.push(object.lastDifference);
      totalLapTimeWithoutStopped += object.lastDifference
    }
    if(object.time === stopwatchTime){ // if time is the same
      if (object.reason === 'Stopped') {alreadyContainsTimeType = "Stopped"; indexOfTimeObjectToUpdate = index} // already contains time of the STOPPED reason
      else if (object.reason === 'Lap' || object.reason === 'Stop + Lap') {alreadyContainsTimeType = "Lap"} // already contains time of LAP or STOPPED AND LAP reason
    }
  }) // end for each 
 
  if(alreadyContainsTimeType == "Stopped"){ // if already contains time of the STOPPED reason
    let {lastDifference} = stopwatchListObject[stopwatchListSelectedPseudoIndex].array[indexOfTimeObjectToUpdate] // destructure last difference
    stopwatchListObject[stopwatchListSelectedPseudoIndex].array.splice(indexOfTimeObjectToUpdate, 1) // remove the old one from the array of times
    updateMatrix(stopwatchListSelectedPseudoIndex, {array: [
      ...stopwatchListObject[stopwatchListSelectedPseudoIndex].array,
      {time: stopwatchTime, lastDifference: lastDifference, reason: 'Stop + Lap'}
    ]})


    setLapAndStopped(true)
  }

  if (alreadyContainsTimeType == "" || reason == "Stopped") { // add time with LAP type if it doesn't already exist as any other type

    updateMatrix(stopwatchListSelectedPseudoIndex, {array: [
      ...stopwatchListObject[stopwatchListSelectedPseudoIndex].array, 
      {time: stopwatchTime, lastDifference: stopwatchTime - lastLapStopwatchTime, reason: typeof reason == 'string' && reason || 'Lap'}
    ]})
  
  } // include old array and tag on time with LAP reason
  let divisor = lapArray.length == 0 ? 1 : lapArray.length
  console.log(`${totalLapTime} / ${divisor}`)
  setAvgLapTime(totalLapTime / divisor)

  let divisorWithoutStopped = lapArrayWithoutStopped.length == 0 ? 1 : lapArrayWithoutStopped.length
  console.log(`${totalLapTimeWithoutStopped} / ${divisorWithoutStopped}`)
  setAvgLapTimeWithoutStopped(totalLapTimeWithoutStopped / divisorWithoutStopped)
  
}
// interval updates every number of ms while state active
useInterval(() => {
  setStopwatchTime(lastStoppedStopwatchTime + Date.now() - timeOfLastStopwatchChange)
}, useIntervalActive ? 10 : null)



useEffect(() => {
  if(lastStoppedStopwatchTime == stopwatchListObject[stopwatchListSelectedPseudoIndex].storedTime) return
  updateMatrix(stopwatchListSelectedPseudoIndex, {storedTime: lastStoppedStopwatchTime})
}, [lastLapStopwatchTime])

useEffect(() => {
  if(avgLapTime == stopwatchListObject[stopwatchListSelectedPseudoIndex].avgLapTime) return
  updateMatrix(stopwatchListSelectedPseudoIndex, {avgLapTime: avgLapTime})
}, [avgLapTime])

useEffect(() => {
  if(avgLapTimeWithoutStopped == stopwatchListObject[stopwatchListSelectedPseudoIndex].avgLapTimeWithoutStopped) return
  updateMatrix(stopwatchListSelectedPseudoIndex, {avgLapTimeWithoutStopped: avgLapTimeWithoutStopped})
}, [avgLapTimeWithoutStopped])
// reset and create new list and then navigate to it with setlist
function resetAndCreateNewList(event){
  setStopwatchTime(0);
  setLastLapStopwatchTime(0)
  updateMatrix(Object.keys(stopwatchListObject).length, Object.assign({}, defaultStopwatchListItemObject, {name: `List ${Object.keys(stopwatchListObject).length + 1}`}))
  setList(event, Object.keys(stopwatchListObject).length)
}

// next and previous selected pseudo index or set manually with setlist
function nextList(event){
  if(stopwatchListSelectedPseudoIndex == Object.keys(stopwatchListObject).length - 1) return
  stopwatchListElement.current.animate(slideOutToLeft, {duration: 250, easing: "ease"})
  setTimeout(() => {
    let newSelectedIndex = stopwatchListSelectedPseudoIndex + 1
    setStopwatchListSelectedPseudoIndex(newSelectedIndex)
    stopwatchListElement.current.animate(slideInFromRight, {duration: 250, easing: "ease"})
  }, 250);
}
function previousList(event){
  if(stopwatchListSelectedPseudoIndex == 0) return
  stopwatchListElement.current.animate(slideOutToRight, {duration: 250, easing: "ease"})
  setTimeout(() => {
    let newSelectedIndex = stopwatchListSelectedPseudoIndex - 1
    setStopwatchListSelectedPseudoIndex(newSelectedIndex)
    stopwatchListElement.current.animate(slideInFromLeft, {duration: 250, easing: "ease"})
  }, 250);
}
function setList(event, index){
  let [animation1, animation2] = [null, null]
  if (index > stopwatchListSelectedPseudoIndex){animation1 = slideOutToLeft; animation2 = slideInFromRight}
  else if (index < stopwatchListSelectedPseudoIndex){animation1 = slideOutToRight; animation2 = slideInFromLeft}
  else {return}
  stopwatchListElement.current.animate(animation1, {duration: 250, easing: "ease"})
  setTimeout(() => {
    setStopwatchListSelectedPseudoIndex(index)
    stopwatchListElement.current.animate(animation2, {duration: 250, easing: "ease"})
  }, 250);
}

//update list name
function updateListName(event){
  updateMatrix(stopwatchListSelectedPseudoIndex, {name: event.target.value})
}



// upon selected index changing, read time from stored list and update states.. update input to reflect name from stored state
useEffect(() => {
  let newTime = stopwatchListObject[stopwatchListSelectedPseudoIndex].storedTime
  stopwatchListNameInput.current.value = stopwatchListObject[stopwatchListSelectedPseudoIndex]?.name
  setLastStoppedStopwatchTime(newTime)
  setLastLapStopwatchTime(newTime)
  setStopwatchTime(newTime)
  if(stopwatchListObject[stopwatchListSelectedPseudoIndex]?.avgLapTime){
    console.log("avg lap present")
    setAvgLapTime(stopwatchListObject[stopwatchListSelectedPseudoIndex].avgLapTime)
  } else {setAvgLapTime(0)}
  if(stopwatchListObject[stopwatchListSelectedPseudoIndex]?.avgLapTimeWithoutStopped){
    setAvgLapTimeWithoutStopped(stopwatchListObject[stopwatchListSelectedPseudoIndex].avgLapTimeWithoutStopped)
  } else {setAvgLapTimeWithoutStopped(0)}
}, [ stopwatchListSelectedPseudoIndex])

const stopwatchListNameInput = useRef()
const stopwatchListDropdownScrollElement = useRef()
const stopwatchListElement = useRef()
const stopwatchScrollElement = useRef()

    useEffect(() => {
      if(stopwatchScrollElement.current){
      stopwatchScrollElement.current.style= `padding-right: ${stopwatchScrollElement.current.offsetWidth - stopwatchScrollElement.current.clientWidth}px`
      }
    }, [stopwatchScrollElement.current])
    useEffect(() => {
      if(stopwatchListDropdownScrollElement.current){
        let halfPad = (stopwatchListDropdownScrollElement.current.offsetWidth - stopwatchListDropdownScrollElement.current.clientWidth)/2
        stopwatchListDropdownScrollElement.current.style= `padding-left: ${halfPad}px; padding-right: ${halfPad}px`
        stopwatchListDropdownScrollElement?.current?.children.length >0 && stopwatchListDropdownScrollElement?.current?.lastChild.scrollIntoView({behavior: "smooth"})
      }
    }, [stopwatchListObject])

    return (
        <div className="stopwatch-container">
            {<div ref={stopwatchListElement} className='stopwatch-list-container'>
              
              <div ref={stopwatchScrollElement} className="stopwatch-scroll-container">
                
                <ul className='stopwatch-unordered-list'>{stopwatchListObject[stopwatchListSelectedPseudoIndex]?.array.length > 0 && stopwatchListObject[stopwatchListSelectedPseudoIndex].array.map((object, index) => (
                    <StopwatchTimeItem key={index} passedKey={index} object={object} stopwatchListElement={stopwatchListElement}/>
                ))}
                </ul>
              </div>
              <div className="stopwatch-time-container">
                <span className="stopwatch-time">⏱{stopwatchTime}</span>
                <span className="average-stopwatch-lap">avg. lap: {Math.floor(avgLapTime)}
                  <span className="average-stopwatch-lap-without-stopped">
                    w/o stopped: {Math.floor(avgLapTimeWithoutStopped)}
                  </span>
                </span>
              </div>
              <div className='stopwatch-list-navigation-container'>
                {!useIntervalActive && <button className='stopwatch-navigate-list-button' onClick={previousList}>&lt;</button>}
                <div className="stopwatch-input-container">
                  <input onChange={updateListName} ref={stopwatchListNameInput} className='stopwatch-list-name-input' type="text" placeholder='Stopwatch List Name' defaultValue={stopwatchListObject[stopwatchListSelectedPseudoIndex].name}/>
                  {Object.keys(stopwatchListObject).length > 1 && <div className="stopwatch-list-dropdown">
                    <div ref={stopwatchListDropdownScrollElement} className="stopwatch-list-dropdown-scroll">
                      {Object.keys(stopwatchListObject).filter((key) => key != stopwatchListSelectedPseudoIndex).map((key, index) => (
                      <p className='stopwatch-list-dropdown-item' key={index} onClick={(event) => {setList(event, Number(key))}}>{stopwatchListObject[key].name}</p>
                    ))}
                    </div>
                  </div>}
                </div>
                {!useIntervalActive && <button className='stopwatch-navigate-list-button' onClick={nextList}>&gt;</button>}
              </div>
              <div className="stopwatch-control-button-container"><button className='stopwatch-control-button' onClick={() => runStopWatch()}>{useIntervalActive ? 'Stop' : 'Watch'}</button>
              {!useIntervalActive && <button className='stopwatch-control-button' onClick={resetAndCreateNewList}>Reset</button>}
              {!lapAndStopped&& !stopwatchTime == 0 && <button className='stopwatch-control-button' onClick={addLapTimeToStopwatchArray}>Lap</button>}
              </div>
              
              
              
            </div>}
            
             
          
          <div className="title">Stopwatch</div>
      </div>
    )
}