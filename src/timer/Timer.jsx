import { useEffect, useRef, useState } from 'react'
import { useInterval } from 'usehooks-ts'
import SingleTimer from './SingleTimer'

export default function Timer() {

    const defaultTimerListObject = {
        name: "timer one", 
        timeStarted: Date.now(), 
        initialTime: 0, 
        timeElapsed: 0
    }
    const [timerListObject, setTimerListObject] = useState({0: defaultTimerListObject})

    function updateMatrix(objectPseudoIndex, updateObject) {
        setTimerListObject(
            Object.assign({},
            timerListObject,
            {[objectPseudoIndex]:
                Object.assign({},
                timerListObject[objectPseudoIndex],
                updateObject)}
            )
        )
    }
    function deleteFromMatrix(objectPseudoIndex) {
        setTimerListObject(Object.assign({}, timerListObject, {[objectPseudoIndex]: null}))
    }


    function createNewTimer(event) {
        updateMatrix(Object.keys(timerListObject).length, {name: `Timer ${Object.keys(timerListObject).length + 1}`})
    }

    const timerScrollElement = useRef()
    useEffect(() => {
        if(timerScrollElement.current){
        timerScrollElement.current.style= `padding-right: ${timerScrollElement.current.offsetWidth - timerScrollElement.current.clientWidth}px`
        }
      }, [timerScrollElement.current])


    return (
        <div className='timer-container'>
            <div className="timer-list-container">
                <div ref = {timerScrollElement} className="timer-scroll-container">
                    <ul className='timer-unordered-list'>
                        {Object.keys(timerListObject).map((key) => (
                            timerListObject[key] && <SingleTimer key={key} objectPseudoIndex={key} object={timerListObject[key]} updateMatrix={updateMatrix} deleteFromMatrix={deleteFromMatrix}/>
                        ))}
                    </ul>
                </div>
                <div className="timer-control-button-container">
                    <button className="timer-button" onClick={createNewTimer}>New</button>
                </div>
            </div>
            <div className="title">Timer</div>
        </div>
    )  
}