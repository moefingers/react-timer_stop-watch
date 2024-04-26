
import { useEffect, useRef } from 'react'

import { fadeOpacityIn, slideInFromLeft } from '../assets/Animations'

export default function StopwatchTimeItem(props){
    const {
        object: {
            time,
            lastDifference,
            reason
        },
         passedKey,
         stopwatchListElement
        } = props

    const stopwatchItemElement = useRef()

    useEffect(() => {
        stopwatchItemElement.current.animate(slideInFromLeft, 500)
        setTimeout(() => {
            stopwatchItemElement?.current?.scrollIntoView({behavior: "smooth"})
        }, 250);
    }, [])
    return (
        <li href={"li-" + passedKey}
        id={"li-" + passedKey} ref={stopwatchItemElement} className={`
        stopwatch-time-item
        ${reason === 'Stopped' ? 'text-shadow-blue'
        : reason === 'Lap' ? 'text-shadow-cyan' 
        : 'text-shadow-green'}
        `}>{time}({lastDifference})<span className='stopwatch-time-reason'> - {reason}</span></li>
    )
}