import { useState, useEffect, useRef } from 'react'
import { fadeOpacityIn, slideInFromLeft, slideOutToRight } from '../assets/Animations'
import { useInterval } from 'usehooks-ts'
export default function SingleTimer({objectPseudoIndex, object, updateMatrix, deleteFromMatrix}) {

    const [timeRemaining, setTimeRemaining] = useState(object.initialTime - (object.timeElapsed || 0))

    const [useIntervalActive, setTimerIntervalActive] = useState(false)
    const [deleteTimerConfirmation, setDeleteTimerConfirmation] = useState(false)
    function deleteTimer(event) {
        if (!deleteTimerConfirmation) {
            setDeleteTimerConfirmation(true)
        } else if (deleteTimerConfirmation) {
            setDeleteTimerConfirmation(false)
            deleteFromMatrix(objectPseudoIndex)
        }
    }

    const timeRemainingElement = useRef()
    function startStopTimer(event) {
        updateMatrix(objectPseudoIndex, {timeStarted: Date.now()})
        setTimerIntervalActive(!useIntervalActive)
    }

    function resetTimer(event) {
        setTimerIntervalActive(false)
        timeRemainingElement.current.value = object.initialTime
    }

    useInterval(() => {
        updateMatrix(objectPseudoIndex, {timeElapsed: Date.now() - object.timeStarted})
        timeRemainingElement.current.value = object.initialTime - (object.timeElapsed || 0)
    }, useIntervalActive ? 10 : null)


    const singleTimerElement = useRef()
    useEffect(() => {
        singleTimerElement.current.animate(slideInFromLeft, {duration: 500})
        setTimeout(() => {
            singleTimerElement?.current?.scrollIntoView({behavior: "smooth"})
        }, 250);
    }, [])

    return (
        <li ref={singleTimerElement} className="single-timer">
            <div className="timer-input-line">
                <input type="text" placeholder="Timer Name" className="timer-name-input" onChange={(e) => updateMatrix(objectPseudoIndex, {name: e.target.value})} value={object.name}/>
                <input ref={timeRemainingElement} type="number" inputMode="numeric" placeholder="Timer For..." className="timer-time-input" onChange={(e) => updateMatrix(objectPseudoIndex, {initialTime: e.target.value})} defaultValue={object.initialTime - (object.timeElapsed || 0)} readOnly={useIntervalActive ? true : false}/>
            </div>
            <div className="timer-button-line">
                <button className="timer-button" onClick={deleteTimer} onMouseLeave={() => setDeleteTimerConfirmation(false)}>{deleteTimerConfirmation ? "actually?" : "Delete"}</button>
                {<button className="timer-button" onClick={resetTimer}>Reset</button>}
                <button className="timer-button" onClick={startStopTimer}>{useIntervalActive ? "Stop" : "Start"}</button>
            </div>
            
        </li>
    )
}