import './App.css'
import Stopwatch from './stopwatch/Stopwatch'
import Timer from './timer/Timer'
import { useState } from 'react'

export default function App() {
const [noShadow, setNoShadow] = useState(false)
// render App
  return (
    <div className='app-container'>
      <button className='shadow-button' onClick={() => setNoShadow(!noShadow)}>⚙</button>
      {noShadow && <style>{`* {text-shadow: 0 0 0 !important} button.shadow-button{color: rgba(180,180,180,1)}`}</style>}
      <Stopwatch/>
      <Timer/>
    </div>
  )
}



export function turnMillisecondsPretty(milliseconds, settingsObject, timeRegExp) {
  let divisorArray = []
  let lastUnit
  Object.keys(settingsObject.units).forEach((key) => {
      if (settingsObject.units[key]) {
          divisorArray.push(settingsObject.unitsAsMilliseconds[key])
          lastUnit = key
      }
  })
  let prettyArray = []
  let remainingMilliseconds = milliseconds
  let trailingDecimal = false
  divisorArray.forEach((divisor) => {
      prettyArray.push(Math.floor(remainingMilliseconds / divisor))
      remainingMilliseconds = remainingMilliseconds % divisor
      console.log(remainingMilliseconds)
      console.log(divisor)
      console.log(remainingMilliseconds / divisor)
      console.log(lastUnit)
      if (settingsObject.unitsWithDecimals[lastUnit]) {trailingDecimal = (remainingMilliseconds / divisor * 1000).toFixed(0)}
      console.log(trailingDecimal)
  })
  console.log(trailingDecimal)

  console.log( `${prettyArray.join(":")}${trailingDecimal ? "." + trailingDecimal : ""}`)

  // return `${prettyArray.join(":")}${settingsObject.unitsWithDecimals.seconds ? "." + trailingDecimal : ""}`
  return `${prettyArray.join(":")}${trailingDecimal ? "." + trailingDecimal : ""}`
}

export function turnPrettyTimeIntoMilliseconds(prettyTime, settingsObject, timeRegExp) {
  let calculatedms = 0
  let matchArray = timeRegExp?.exec(prettyTime)
  console.log(matchArray?.groups)
  matchArray?.groups != undefined && Object.keys(matchArray.groups).forEach((key) => {
      // key : matchArray.groups[key]
      if(!key.includes("_dec")){calculatedms += Number(matchArray.groups[key] * settingsObject.unitsAsMilliseconds[key])}
      if(key.includes("_dec")){
          console.log(key)
          console.log(matchArray.groups[key])
          console.log(settingsObject.unitsAsMilliseconds[key])
          calculatedms += Number(("0." + matchArray.groups[key]) * settingsObject.unitsAsMilliseconds[key])}
  })
  return calculatedms
}

export const defaultUnitSettingsObject = {
  units: {
      hours: false,
      minutes: true, 
      seconds: true, 
  }, 
  unitAliases: {
      hours: "hrs",
      minutes: "min",
      seconds: "sec",
  }, 
  unitsWithDecimals: {
      seconds: true
  },
  unitsAsMilliseconds: {
      seconds:/*       */1000,
      seconds_dec:/*   */1000,
      minutes:/*       */60000,
      minutes_dec:/*   */60000,
      hours:/*         */3600000,
      hours_dec:/*     */3600000

  }
}