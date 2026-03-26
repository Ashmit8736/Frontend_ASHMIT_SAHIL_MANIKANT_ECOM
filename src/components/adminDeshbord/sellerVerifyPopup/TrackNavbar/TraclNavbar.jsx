    import React from 'react'
    import { MdManageAccounts } from "react-icons/md";
    import { IoBusinessOutline } from "react-icons/io5";
    import { CiBank } from "react-icons/ci";
    import { PiWarehouse } from "react-icons/pi";
    import style from './TrackNavbar.module.css'   
    const TraclNavbar = ({isActiveStatus,setisActiveStatus}) => {
        const trackContainer = [
            {
                step:"Account",
                icon:<MdManageAccounts/>
            },
            {
                step:"Business",
                icon:<IoBusinessOutline/>
            },
            {
                step:"Banking",
                icon:<CiBank/>
            },
            {
                step:"Warehouse",
                icon:<PiWarehouse/>
            },
        ]

        const renderSteps = () => {
            return trackContainer.map((steps,index) => {
                const isActive = index === isActiveStatus;
                const isCompleted = index < isActiveStatus;
                return(
                <div key={index} className={`${style.singleStepContainer} ${isActive ? style.active : ""} ${isCompleted ? style.complete :""}`} onClick={() => setisActiveStatus(index)}>
                    <div>{steps.icon}</div>
                    <div>{steps.step}</div>
                </div>
            )})
        }

    return (
        <div className={style.trackMainContainer}>{renderSteps()}</div>
    )
    }

    export default TraclNavbar