import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

export default function App() {
const [currentTime, setCurrentTime] = useState(Date.now())
const [timeOnPageLoad, setTimeOnPageLoad] = useState(Date.now())
setInterval(() => {
  setCurrentTime(Date.now())
}, 10);


const [timeLeft, setTimeLeft] = useState(Date.now())





  return (
    <div className='app-container'>
      <div>Time on Page Load: {timeOnPageLoad}</div>
        <div>Current Time: {currentTime}</div>
    </div>
  )
  
}