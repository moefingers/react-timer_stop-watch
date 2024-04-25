
import { useEffect, useRef } from 'react'

import { fadeOpacityIn, slideInFromLeft } from '../assets/Animations'

export default function StopwatchTimeItem(props){
    const {
        object: {
            time,
            reason
        },
         passedKey
        } = props

    const stopwatchItemElement = useRef()

    useEffect(() => {
        stopwatchItemElement.current.animate(slideInFromLeft, 500)
    }, [])
    return (
        <li value={1000-passedKey}ref={stopwatchItemElement} className={`
        stopwatch-time-item
        ${reason === 'Stopped' ? 'text-shadow-blue'
        : reason === 'Lap' ? 'text-shadow-cyan' 
        : 'text-shadow-green'}
        `}>{time}<span className='stopwatch-time-reason'> - {reason}</span></li>
    )
}