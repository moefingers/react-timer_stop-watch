import { useState, useEffect, useRef } from 'react'
import { fadeOpacityIn, slideInFromLeft, slideOutToRight } from '../assets/Animations'
import { useInterval } from 'usehooks-ts'

//mui
import {LocalizationProvider, TimePicker, StaticTimePicker} from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'
import { ThemeProvider, createTheme } from '@mui/material/styles'

export default function SingleTimer({objectPseudoIndex, object, updateMatrix, deleteFromMatrix}) {

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
        timeRemainingElement.current.value = object.initialTime
        setPreviousTimeElapsed(0)
        updateMatrix(objectPseudoIndex, {timeStarted: Date.now(), timeElapsed: 0})
    }
    function startStopTimer(event) {
        updateMatrix(objectPseudoIndex, {timeStarted: Date.now()})
        setPreviousTimeElapsed(object.timeElapsed || 0)
        setTimerIntervalActive(!useIntervalActive)
    }

    useInterval(() => {
        if(object.initialTime == 0 || object.initialTime - object.timeElapsed <= 0){
            setTimerIntervalActive(false)
            updateMatrix(objectPseudoIndex, {timeStarted: Date.now(), timeElapsed: 0})
            timeRemainingElement.current.value = object.initialTime

        } else {

            updateMatrix(objectPseudoIndex, {timeElapsed: Date.now() - object.timeStarted + previousTimeElapsed})

            timeRemainingElement.current.value = object.initialTime - (object.timeElapsed || 0)

        }
    }, useIntervalActive ? 10 : null)


    const singleTimerElement = useRef()
    useEffect(() => {
        singleTimerElement.current.animate(slideInFromLeft, {duration: 500})
        setTimeout(() => {
            singleTimerElement?.current?.scrollIntoView({behavior: "smooth"})
        }, 250);
    }, [])

    const darkTheme = createTheme({
        palette: {
          mode: 'dark',
        },
      });

    return (
        <li ref={singleTimerElement} className="single-timer">
            <div className="timer-input-line">
                <input type="text" placeholder="Timer Name" className="timer-name-input" onChange={(e) => updateMatrix(objectPseudoIndex, {name: e.target.value})} value={object.name}/>
                <input ref={timeRemainingElement} type="number" inputMode="numeric" placeholder="milliseconds" className="timer-time-input" onChange={(e) => updateMatrix(objectPseudoIndex, {initialTime: e.target.value})} defaultValue={object.initialTime - (object.timeElapsed || 0)} readOnly={useIntervalActive ? true : false}/>
            </div>
            <div className="timer-button-line">
                <button className="timer-button" onClick={deleteTimer} onMouseLeave={() => setDeleteTimerConfirmation(false)}>{deleteTimerConfirmation ? "actually?" : "Delete"}</button>
                {object.timeElapsed != 0 && <button className="timer-button" onClick={resetTimer}>Reset</button>}
                {object.initialTime - (object.timeElapsed || 0) != 0 && <button className="timer-button" onClick={startStopTimer}>{useIntervalActive ? "Stop" : "Start"}</button>}
            </div>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <ThemeProvider theme={darkTheme}>
                    <TimePicker 
                        sx={{
                            '.MuiOutlinedInput-root': {
                                width: "60%"
                            }
                        }}
                        label="Timer Duration"
                        views={["hours", "minutes", "seconds"]}
                        format={`hh:mm:ss`}
                        ampm={false}
                        onChange={(val) => {console.log(val.getTime())}}
                        timeSteps={{minutes: 1, seconds: 1}}
                    />
                    <button className="timer-settings-button">⚙</button>
                </ThemeProvider>
            </LocalizationProvider>
        </li>
    )
}


/*

After the work it took to find this stuff, I refuse to part with it. The lack of documentation is not nice.

This is an sx prop for an MUI component. Particularly... for the outlined input.. for the <TimePicker/>

sx={{

    '& .MuiOutlinedInput-notchedOutline': {
        color: 'pink',
        borderColor: 'pink',
        transition: ".3s",
        '&:hover': {
            borderColor: 'green',
        },
        '&.Mui-focused': {
            borderColor: 'purple',
        },
    },
    '& .MuiOutlinedInput-root': {
        color: 'white',
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'purple'
        }
    },
    '& .MuiSvgIcon-root': {
        color: 'pink'
    },
    '& .MuiOutlinedInput-root': {
        color: 'white',
        '& fieldset': {
            color: 'red',
        },
        '&:hover fieldset': {
            color: 'green',
        },
        '&.Mui-focused fieldset': {
            color: 'purple',
        },
    },
    '& .MuiInputLabel-root': {
        color: 'red',

    },
    
    '& .MuiMenuItem-root': {
        color: 'red',

    },
    


}}

*/