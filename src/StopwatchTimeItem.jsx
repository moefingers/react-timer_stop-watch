
import { useEffect, useRef } from 'react'
import './App.css'
import { fadeOpacityIn } from './assets/Animations'

export default function StopwatchTimeItem(props){
    const {time, reason} = props.object

    const stopwatchItemElement = useRef()

    useEffect(() => {
        stopwatchItemElement.current.animate(fadeOpacityIn, 500)
    }, [])
    return (
        <li ref={stopwatchItemElement} className="stopwatch-time-item shown">{time}<span className='stopwatch-time-reason'> - {reason}</span></li>
    )
}