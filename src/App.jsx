import { useEffect, useState, useRef } from 'react'
import './App.css'
import { fadeOpacityIn, slideInFromLeft } from './assets/Animations'
import StopwatchTimeItem from './stopwatch/StopwatchTimeItem'
import Stopwatch from './stopwatch/Stopwatch'

import { useInterval } from 'usehooks-ts'

export default function App() {

  // development
const [currentTime, setCurrentTime] = useState(Date.now())
const [timeOnPageLoad, setTimeOnPageLoad] = useState(Date.now())





// render App
  return (
    <div className='app-container'>
      
      <div className='development'>{timeOnPageLoad} - Time on Page Load</div>
      <div className='development'>{currentTime} - Current Time</div>
      <Stopwatch/>
    </div>
  )
}