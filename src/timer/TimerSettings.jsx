import { useEffect, useRef } from "react"

import { fadeOpacityIn, slideInFromLeft, slideOutToRight, expandOutToLeftThenExpandOutToBottom } from '../assets/Animations'

export default function TimerSettings({settingsObject, setSettingsObject}) {

    
    function updateSettingsObject(object) {
        setSettingsObject(Object.assign({}, settingsObject, object))   
    }
    
    useEffect(() => {
        // console.log(settingsObject)
    }, [settingsObject])

    return (
        <div className='timer-settings' >
            <p>units</p>
            <ul>
                {Object.keys(settingsObject.units).map((time) => {
                    return <li key={time} 
                                className={`timer-settings-item ${settingsObject.units[time] ? 'active-setting' : 'inactive-setting'}`}
                                onClick={(event) => {updateSettingsObject({
                                units: Object.assign({}, 
                                        settingsObject.units, 
                                        {[time]: !settingsObject.units[time]}),
                                unitsWithDecimals: Object.assign({}, 
                                        settingsObject.unitsWithDecimals, 
                                        {[time]: settingsObject.units[time] ? false: settingsObject.unitsWithDecimals[time]})
                                        })}}>
                                {time}<span className={`timer-settings-item ${settingsObject.unitsWithDecimals[time] ? 'active-setting' : 'inactive-setting'}`}
                                onClick={(event) => {updateSettingsObject({
                                    units: Object.assign({}, 
                                        settingsObject.units,
                                        {[time]: !settingsObject.units[time] ? true: settingsObject.units[time]}),
                                    unitsWithDecimals: Object.assign({}, 
                                        settingsObject.unitsWithDecimals,
                                        {[time]: !settingsObject.unitsWithDecimals[time]})
                                        }); event.stopPropagation()}}>.dec</span>
                            </li>
                })}
            </ul>
        </div>
    )
}