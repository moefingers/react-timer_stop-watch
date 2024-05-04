import { useState, useEffect, useRef } from 'react'
import { fadeOpacityIn, slideInFromLeft, slideOutToRight, expandOutToLeftThenExpandOutToBottom} from '../assets/Animations'
import { useInterval } from 'usehooks-ts'
import TimerSettings from './TimerSettings'
export default function SingleTimer({objectPseudoIndex, object, updateMatrix, deleteFromMatrix}) {

    const defaultUnitSettingsObject = {
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
    const [settingsObject, setSettingsObject] = useState(defaultUnitSettingsObject)
    const [timerSettingsActive, setTimerSettingsActive] = useState(false)
    const [timerSettingsDelay, setTimerSettingsDelay] = useState(false)
    const timerSettingsElement = useRef()
    const timerSettingsButton = useRef()
    useEffect(() => {
    //   timerSettingsElement.current.style = `left: ${singleTimerElement.current.getBoundingClientRect().right - singleTimerElement.current.getBoundingClientRect().left}px; `  
    }, [])
    async function openCloseTimerSettings(event) {
        if(!timerSettingsDelay){
            setTimerSettingsDelay(true)
            timerSettingsElement.current.animate(expandOutToLeftThenExpandOutToBottom, {
                duration: 1000, 
                direction: timerSettingsActive ? "reverse" : "normal", 
                fill: "forwards"
            })

            setTimerSettingsActive(!timerSettingsActive)
            await new Promise(r => setTimeout(r, 1000))
            setTimerSettingsDelay(false)
        }
    }

    const [calculatedInitialMilliseconds, setCalculatedInitialMilliseconds] = useState(0)
    const [previousTimeElapsed, setPreviousTimeElapsed] = useState(0)

    const [useIntervalActive, setTimerIntervalActive] = useState(false)
    const [deleteTimerConfirmation, setDeleteTimerConfirmation] = useState(false)
    function deleteTimer(event) {
        if (!deleteTimerConfirmation) {
            setDeleteTimerConfirmation(true)
        } else if (deleteTimerConfirmation) {
            singleTimerElement.current.animate(slideOutToRight, {duration: 500, fill: "forwards"})
            setTimeout(() => {
            setDeleteTimerConfirmation(false)
            deleteFromMatrix(objectPseudoIndex)
                
            }, 500);
        }
    }
//timeStarted
//initialTime
//timeElapsed
    const timeRemainingElement = useRef()

    function resetTimer(event) {
        setTimerIntervalActive(false)
        timeRemainingElement.current.value = turnMillisecondsPretty(calculatedInitialMilliseconds)
        setPreviousTimeElapsed(0)
        updateMatrix(objectPseudoIndex, {timeStarted: Date.now(), timeElapsed: 0})
    }
    function startStopTimer(event) {
        // turnMillisecondsPretty(calculatedInitialMilliseconds)

        updateMatrix(objectPseudoIndex, {timeStarted: Date.now()})
        setPreviousTimeElapsed(object.timeElapsed || 0)
        setTimerIntervalActive(!useIntervalActive)
    }

    useInterval(() => {
        if(calculatedInitialMilliseconds == 0 || calculatedInitialMilliseconds - object.timeElapsed <= 0){
            setTimerIntervalActive(false)
            updateMatrix(objectPseudoIndex, {timeStarted: Date.now(), timeElapsed: 0})
            timeRemainingElement.current.value = turnMillisecondsPretty(calculatedInitialMilliseconds)

        } else {

            updateMatrix(objectPseudoIndex, {timeElapsed: Date.now() - object.timeStarted + previousTimeElapsed})

            timeRemainingElement.current.value = turnMillisecondsPretty(calculatedInitialMilliseconds - (object.timeElapsed || 0))

        }
    }, useIntervalActive ? 10 : null)

    function turnMillisecondsPretty(milliseconds) {
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

    function turnPrettyTimeIntoMilliseconds(prettyTime) {
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


    const singleTimerElement = useRef()
    useEffect(() => {
        singleTimerElement.current.animate(slideInFromLeft, {duration: 500})
        setTimeout(() => {
            singleTimerElement?.current?.scrollIntoView({behavior: "smooth"})
        }, 250);
    }, [])

    const [timeRegExp, setTimeRegExp] = useState(null)
    const [timerInputValue, setTimerInputValue] = useState("")
    const [timerInputValueValid, setTimerInputValueValid] = useState(new RegExp(""))
    useEffect(() => {
        console.log("value changed")
        // timeRemainingElement.current.value = turnMillisecondsPretty(calculatedInitialMilliseconds - (object.timeElapsed || 0))
        let calculatedms = turnPrettyTimeIntoMilliseconds(timerInputValue)
        console.log(calculatedms)
        setCalculatedInitialMilliseconds(calculatedms)
        let fullMatchArrayOfOne = timerInputValue.match(timeRegExp)
        
        if(timeRegExp != undefined && fullMatchArrayOfOne?.length > 0){
            setTimerInputValueValid(true)
        } else {
            setTimerInputValueValid(false)
        }

    }, [timerInputValue, timeRegExp])


    const [timerUnitPreview, setTimerUnitPreview] = useState("")
    
    useEffect(() => {
        // timeRemainingElement.current.value = turnMillisecondsPretty(calculatedInitialMilliseconds - (object.timeElapsed || 0))
        let activeTimerUnits = []
        let regExpArray = []
        Object.keys(settingsObject.units).forEach((key) => {
            let partOfUnit = ""
            let partOfRegExp = ""
            if(settingsObject.units[key]){
                partOfUnit += settingsObject.unitAliases[key]
                partOfRegExp += (`(?<${key}>\\d+)`)
            } 
            if (settingsObject.units[key] && settingsObject.unitsWithDecimals[key]){
                partOfUnit += `.d`
                partOfRegExp += (`\\.*(?<${key}_dec>\\d*)`)
            }
            partOfUnit && activeTimerUnits.push(partOfUnit)
            partOfRegExp && regExpArray.push(partOfRegExp)
        })

        setTimerUnitPreview(activeTimerUnits.join(":"))
        console.log(activeTimerUnits)
        activeTimerUnits.length == 0 && setTimerUnitPreview("select units")
        let test = new RegExp((
            `^${regExpArray.join(":")}$`
        ), "g")
        setTimeRegExp(test)
        console.log(test)
    }, [settingsObject.units, settingsObject.unitsWithDecimals])


    return (
        <li ref={singleTimerElement} className="single-timer">
            <div className="timer-input-line">
                <input type="text" placeholder="Timer Name" className="timer-name-input" onChange={(e) => updateMatrix(objectPseudoIndex, {name: e.target.value})} value={object.name}/>
                <input 
                    ref={timeRemainingElement} 
                    placeholder={timerUnitPreview}
                    className={`timer-time-input ${timerInputValueValid && timerInputValue != "" ? "valid-input" : "invalid-input"}`}
                    onChange={(e) => {
                        updateMatrix(objectPseudoIndex, {initialTime: e.target.value}); 
                        setTimerInputValue(e.target.value)}}
                    wouldvebeendefaultvaluebuttemporarilyremoved={`defaultValue={(object.initialTime - object.timeElapsed) == 0 ? "" : (object.initialTime - object.timeElapsed)}`}
                    defaultValue={object.initialTime}
                    readOnly={useIntervalActive ? true : false}
                />
            </div>
            <div className="timer-button-line">
                <div className="timer-button-line-normal">
                    <button className="timer-button" onClick={deleteTimer} onMouseLeave={() => setDeleteTimerConfirmation(false)}>{deleteTimerConfirmation ? "actually?" : "Delete"}</button>
                    {object.timeElapsed != 0 && <button className="timer-button" onClick={resetTimer}>Reset</button>}
                    {object.initialTime - (object.timeElapsed || 0) != 0 && timerInputValueValid 
                        ? <button className={`timer-button  ${timerInputValue != "" && timerInputValueValid ? "visible" : "hidden"}`} onClick={startStopTimer}>{useIntervalActive ? "Stop" : "Start"}</button> 
                        : <div className={`timer-unit-preview ${timerInputValue != "" && !timerInputValueValid ? "visible" : "hidden"} `}>{timerUnitPreview}</div> }
                    
                </div>
                <button ref={timerSettingsButton} className="timer-button timer-settings-button" onClick={openCloseTimerSettings} style={useIntervalActive ? {visibility: "hidden", transition: "none"} : {}}>🛠</button>
                
            </div>
            <div  ref={timerSettingsElement} className="timer-settings-wrapper">
                    <TimerSettings settingsObject={settingsObject} setSettingsObject={setSettingsObject}/>
            </div>
        </li>
    )
}