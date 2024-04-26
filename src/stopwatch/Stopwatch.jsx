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
  // console.log(updateObject)
  // let actualIndex = getIndexOfListByPseudoIndex(objectPseudoIndex)
  // let splicedMatrix = [...stopwatchListMatrix]
  // splicedMatrix.splice(objectPseudoIndex, actualIndex)
  // setStopwatchListMatrix([
  //   ...splicedMatrix,
    
  //   Object.assign({}, stopwatchListMatrix[stopwatchListSelectedIndex], updateObject)
    
  // ])
  console.log(stopwatchListObject)
  console.log({[objectPseudoIndex]: updateObject})
  console.log(Object.assign({},stopwatchListObject, {[objectPseudoIndex]: Object.assign({},stopwatchListObject[objectPseudoIndex], updateObject)}))
  setStopwatchListObject(Object.assign({},stopwatchListObject, {[objectPseudoIndex]: Object.assign({},stopwatchListObject[objectPseudoIndex], updateObject)}))
}
// function to add lap time to timePassedStopwatchArray
function addLapTimeToStopwatchArray(reason) {
  setLastLapStopwatchTime(stopwatchTime)
  if(stopwatchTime === 0) return
  let alreadyContainsTimeType = ""  // initialize already contains situation
  let indexOfTimeObjectToUpdate
  // console.log(stopwatchListMatrix)
  // console.log(stopwatchListMatrix[stopwatchListSelectedIndex].name)
  // stopwatchListMatrix[stopwatchListSelectedIndex].array.forEach((object, index) => { // for each object {time: 999, reason: 'Lap' || 'Stopped' || 'Stopped and Lap'}
  //   if(object.time === stopwatchTime){ // if time is the same
  //     if (object.reason === 'Stopped') {alreadyContainsTimeType = "Stopped"; indexOfTimeObjectToUpdate = index} // already contains time of the STOPPED reason
  //     else if (object.reason === 'Lap' || object.reason === 'Stopped and Lap') {alreadyContainsTimeType = "Lap"} // already contains time of LAP or STOPPED AND LAP reason
  //   }
  stopwatchListObject[stopwatchListSelectedPseudoIndex].array.forEach((object, index) => { // for each object {time: 999, reason: 'Lap' || 'Stopped' || 'Stopped and Lap'}
    if(object.time === stopwatchTime){ // if time is the same
      if (object.reason === 'Stopped') {alreadyContainsTimeType = "Stopped"; indexOfTimeObjectToUpdate = index} // already contains time of the STOPPED reason
      else if (object.reason === 'Lap' || object.reason === 'Stopped and Lap') {alreadyContainsTimeType = "Lap"} // already contains time of LAP or STOPPED AND LAP reason
    }
  }) // end for each 
  // if(alreadyContainsTimeType == "Stopped"){ // if already contains time of the STOPPED reason
  //   let {lastDifference} = stopwatchListMatrix[stopwatchListSelectedIndex].array[indexOfTimeObjectToUpdate]
  //   stopwatchListMatrix[stopwatchListSelectedIndex].array.splice(indexOfTimeObjectToUpdate, 1) // remove the old one from the array
  //   let splicedMatrix = [...stopwatchListMatrix]
  //   splicedMatrix.splice(stopwatchListSelectedIndex, 1)
  if(alreadyContainsTimeType == "Stopped"){ // if already contains time of the STOPPED reason
    let {lastDifference} = stopwatchListObject[stopwatchListSelectedPseudoIndex].array[indexOfTimeObjectToUpdate] // destructure last difference
    stopwatchListObject[stopwatchListSelectedPseudoIndex].array.splice(indexOfTimeObjectToUpdate, 1) // remove the old one from the array of times
    // let splicedMatrix = [...stopwatchListMatrix]
    // splicedMatrix.splice(stopwatchListSelectedIndex, 1)
    updateMatrix(stopwatchListSelectedPseudoIndex, {array: [
      ...stopwatchListObject[stopwatchListSelectedPseudoIndex].array,
      {time: stopwatchTime, lastDifference: lastDifference, reason: 'Stopped and Lap'}
    ]})
    // setStopwatchListMatrix([
    //   ...splicedMatrix,
    //   Object.assign({}, stopwatchListMatrix[stopwatchListSelectedIndex], {array: [
    //     ...stopwatchListMatrix[stopwatchListSelectedIndex].array,
    //     {time: stopwatchTime, lastDifference: lastDifference, reason: 'Stopped and Lap'}
    //   ]}
    // )
    // ])



    setLapAndStopped(true)
  }

  if (alreadyContainsTimeType == "" || reason == "Stopped") { // add time with LAP type if it doesn't already exist as any other type

    // let splicedMatrix = [...stopwatchListMatrix]
    // splicedMatrix.splice(stopwatchListSelectedIndex, 1)
    // setStopwatchListMatrix([
    //   ...splicedMatrix,
      
    //   Object.assign({}, stopwatchListMatrix[stopwatchListSelectedIndex], {array: [
    //     ...stopwatchListMatrix[stopwatchListSelectedIndex].array, 
    //     {time: stopwatchTime, lastDifference: stopwatchTime - lastLapStopwatchTime, reason: typeof reason == 'string' && reason || 'Lap'}
    //   ]})
      
    // ])

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

const stopwatchListElement = useRef()
const stopwatchScrollElement = useRef()

    useEffect(() => {
      if(stopwatchScrollElement.current){
      stopwatchScrollElement.current.style= `padding-right: ${stopwatchScrollElement.current.offsetWidth - stopwatchScrollElement.current.clientWidth}px`
      }
    }, [stopwatchScrollElement.current])


    useEffect(() => {
      console.log( lastStoppedStopwatchTime)
      if(lastStoppedStopwatchTime == stopwatchListObject[stopwatchListSelectedPseudoIndex].storedTime) return
      updateMatrix(stopwatchListSelectedPseudoIndex, {storedTime: lastStoppedStopwatchTime})
    }, [lastLapStopwatchTime])
// reset
function resetAndCreateNewList(event){
  setStopwatchTime(0);
  setLastLapStopwatchTime(0)
  // setStopwatchListMatrix([...stopwatchListMatrix, Object.assign({}, defaultStopwatchListItemObject, {name: `List ${stopwatchListMatrix.length + 1}`})])
  updateMatrix(Object.keys(stopwatchListObject).length, Object.assign({}, defaultStopwatchListItemObject, {name: `List ${Object.keys(stopwatchListObject).length + 1}`}))
  setList(event, Object.keys(stopwatchListObject).length)
}

function nextList(event, overrideIndex = null){
  console.log(overrideIndex)
  console.log(Object.keys(stopwatchListObject).length)
  if(stopwatchListSelectedPseudoIndex == Object.keys(stopwatchListObject).length - 1 && overrideIndex == null) return
  stopwatchListElement.current.animate(slideOutToLeft, 250)
  setTimeout(() => {
    let newSelectedIndex = overrideIndex || stopwatchListSelectedPseudoIndex + 1
    console.log(newSelectedIndex)
    setStopwatchListSelectedPseudoIndex(newSelectedIndex)
    stopwatchListElement.current.animate(slideInFromRight, 250)
  }, 250);
}

function setList(event, index){
  let [animation1, animation2] = [null, null]
  if (index > stopwatchListSelectedPseudoIndex){animation1 = slideOutToLeft; animation2 = slideInFromRight}
  else if (index < stopwatchListSelectedPseudoIndex){animation1 = slideOutToRight; animation2 = slideInFromLeft}
  else {return}
  stopwatchListElement.current.animate(animation1, 250)
  setTimeout(() => {
    setStopwatchListSelectedPseudoIndex(index)
    stopwatchListElement.current.animate(animation2, 250)
  }, 250);
}

function previousList(){
  if(stopwatchListSelectedPseudoIndex == 0) return
  stopwatchListElement.current.animate(slideOutToRight, 250)
  setTimeout(() => {
    let newSelectedIndex = stopwatchListSelectedPseudoIndex - 1
    console.log(newSelectedIndex)
    setStopwatchListSelectedPseudoIndex(newSelectedIndex)
    stopwatchListElement.current.animate(slideInFromLeft, 250)
  }, 250);
}

useEffect(() => {
  let newTime = stopwatchListObject[stopwatchListSelectedPseudoIndex].storedTime
  stopwatchListNameInput.current.value = stopwatchListObject[stopwatchListSelectedPseudoIndex]?.name
  setLastStoppedStopwatchTime(newTime)
  setLastLapStopwatchTime(newTime)
  setStopwatchTime(newTime)

  console.log(stopwatchListObject[stopwatchListSelectedPseudoIndex].array)
 
}, [ stopwatchListSelectedPseudoIndex])

const stopwatchListNameInput = useRef()

// function getIndexOfListByName(name){
//   return stopwatchListObject.findIndex(list => list.name == name)
// }
// function getIndexOfListByPseudoIndex(pseudoIndex){
//   return stopwatchListMatrix.findIndex(list => list.pseudoIndex == pseudoIndex)
// }


// filter out the one that is selected
// console.log(stopwatchListObject.filter((list, index) => index != stopwatchListSelectedPseudoIndex))
// console.log(Object.keys(stopwatchListObject[stopwatchListSelectedPseudoIndex].filter(key, index) => )

// console.log(stopwatchListObject)
// console.log(stopwatchListObject[stopwatchListSelectedPseudoIndex].array)
    return (
        <div className="stopwatch-container">
          <button className='console matrixlength' onClick={() => console.log(Object.keys(stopwatchListObject).length)}>cons mat leng</button>
          <button className='console-log-matrix' onClick={() => console.log(stopwatchListObject)}>console matrix</button>{stopwatchListSelectedPseudoIndex}
          {/* <button className="changenamelistone" onClick={() => {
            setStopwatchListObject(Object.assign(
              {}, 
              stopwatchListObject,
              {[0] : Object.assign(stopwatchListMatrix[0], {name: "fdf"})}
              ));
            }}>Change l1 name</button> */}
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
              {!useIntervalActive && <button className='stopwatch-previous-list-button' onClick={previousList}>◀</button>}
              <input ref={ stopwatchListNameInput} className='stopwatch-list-name-input' type="text" placeholder='Stopwatch List Name' defaultValue={stopwatchListObject[stopwatchListSelectedPseudoIndex].name}/>
              {!useIntervalActive && <button className='stopwatch-next-list-button' onClick={nextList}>▶</button>}
              {/* getIndexOfListByName(stopwatchListMatrix[stopwatchListSelectedIndex].name) */}
            </div>}
            {/* {stopwatchListMatrix.length > 0 && stopwatchListMatrix.filter((list, index) => index != stopwatchListSelectedIndex).map((list, index) => (
                  <h2 key={index} onClick={(event) => {setList(event,getIndexOfListByName(list.name))}}>{list.name}</h2>
                ))} */}
      </div>
    )
}