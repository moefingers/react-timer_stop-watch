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

// const [stopwatchListMatrix, setStopwatchListMatrix] = useState([{name: "list one", array: [{time: 333, lastDifference: 4, reason: 'Stopped'}]}])

const defaultStopwatchListItemObject = {storedTime: 0, name: "list one", array: []}
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

  stopwatchListObject[stopwatchListSelectedPseudoIndex].array.forEach((object, index) => { // for each object {time: 999, reason: 'Lap' || 'Stopped' || 'Stopped and Lap'}
    if(object.time === stopwatchTime){ // if time is the same
      if (object.reason === 'Stopped') {alreadyContainsTimeType = "Stopped"; indexOfTimeObjectToUpdate = index} // already contains time of the STOPPED reason
      else if (object.reason === 'Lap' || object.reason === 'Stopped and Lap') {alreadyContainsTimeType = "Lap"} // already contains time of LAP or STOPPED AND LAP reason
    }
  }) // end for each 
 
  if(alreadyContainsTimeType == "Stopped"){ // if already contains time of the STOPPED reason
    let {lastDifference} = stopwatchListObject[stopwatchListSelectedPseudoIndex].array[indexOfTimeObjectToUpdate] // destructure last difference
    stopwatchListObject[stopwatchListSelectedPseudoIndex].array.splice(indexOfTimeObjectToUpdate, 1) // remove the old one from the array of times
    updateMatrix(stopwatchListSelectedPseudoIndex, {array: [
      ...stopwatchListObject[stopwatchListSelectedPseudoIndex].array,
      {time: stopwatchTime, lastDifference: lastDifference, reason: 'Stopped and Lap'}
    ]})


    setLapAndStopped(true)
  }

  if (alreadyContainsTimeType == "" || reason == "Stopped") { // add time with LAP type if it doesn't already exist as any other type

    updateMatrix(stopwatchListSelectedPseudoIndex, {array: [
      ...stopwatchListObject[stopwatchListSelectedPseudoIndex].array, 
      {time: stopwatchTime, lastDifference: stopwatchTime - lastLapStopwatchTime, reason: typeof reason == 'string' && reason || 'Lap'}
    ]})
  
  } // include old array and tag on time with LAP reason
}
// interval updates every number of ms while state active
useInterval(() => {
  setStopwatchTime(lastStoppedStopwatchTime + Date.now() - timeOfLastStopwatchChange)
}, useIntervalActive ? 10 : null)



    useEffect(() => {
      if(lastStoppedStopwatchTime == stopwatchListObject[stopwatchListSelectedPseudoIndex].storedTime) return
      updateMatrix(stopwatchListSelectedPseudoIndex, {storedTime: lastStoppedStopwatchTime})
    }, [lastLapStopwatchTime])
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
        
      }
    }, [stopwatchListDropdownScrollElement.current])

    useEffect(() => {
      console.log(stopwatchListDropdownScrollElement?.current?.children)
        stopwatchListDropdownScrollElement?.current?.children.length >0 && stopwatchListDropdownScrollElement?.current?.lastChild.scrollIntoView({behavior: "smooth"})
    }, [stopwatchListDropdownScrollElement?.current?.children.length])


    return (
        <div className="stopwatch-container">
          <button className='console matrixlength' onClick={() => console.log(Object.keys(stopwatchListObject).length)}>cons mat leng</button>
          <button className='console-log-matrix' onClick={() => console.log(stopwatchListObject)}>console matrix</button>{stopwatchListSelectedPseudoIndex}
            <div>{timeOfLastStopwatchChange} - Time of Last Stopwatch Change</div>
            <div>Last Stopped Stopwatch Time: {lastStoppedStopwatchTime}</div>
            <div>Stopwatch: {stopwatchTime}</div>
            <div>Last Lap Time: {lastLapStopwatchTime}</div>
            <button onClick={() => runStopWatch()}>{useIntervalActive ? 'Stop' : 'Watch'}</button>
            {!useIntervalActive && <button onClick={resetAndCreateNewList}>Reset</button>}
            {!lapAndStopped&& !stopwatchTime == 0 && <button onClick={addLapTimeToStopwatchArray}>Lap</button>}
            
            {true && <div ref={stopwatchListElement} className='stopwatch-list-container'>
              
              <div ref={stopwatchScrollElement} className="stopwatch-scroll-container">
                
                <ul className='stopwatch-unordered-list'>{stopwatchListObject[stopwatchListSelectedPseudoIndex]?.array.length > 0 && stopwatchListObject[stopwatchListSelectedPseudoIndex].array.map((object, index) => (
                    <StopwatchTimeItem key={index} passedKey={index} object={object} stopwatchListElement={stopwatchListElement}/>
                ))}
                </ul>
              </div>
              <div className='stopwatch-list-navigation-container'>
                {!useIntervalActive && <button className='stopwatch-navigate-list-button' onClick={previousList}>&lt;</button>}
                <div className="stopwatch-input-container">
                  <input onChange={updateListName} ref={stopwatchListNameInput} className='stopwatch-list-name-input' type="text" placeholder='Stopwatch List Name' defaultValue={stopwatchListObject[stopwatchListSelectedPseudoIndex].name}/>
                  <div className="stopwatch-list-dropdown">
                    <div ref={stopwatchListDropdownScrollElement} className="stopwatch-list-dropdown-scroll">
                      {Object.keys(stopwatchListObject).length > 0 && Object.keys(stopwatchListObject).filter((key) => key != stopwatchListSelectedPseudoIndex).map((key, index) => (
                      <p className='stopwatch-list-dropdown-item' key={index} onClick={(event) => {setList(event, Number(key))}}>{stopwatchListObject[key].name}</p>
                    ))}
                    </div>
                  </div>
                </div>
                {!useIntervalActive && <button className='stopwatch-navigate-list-button' onClick={nextList}>&gt;</button>}
              </div>
              
            </div>}
            
             
      </div>
    )
}