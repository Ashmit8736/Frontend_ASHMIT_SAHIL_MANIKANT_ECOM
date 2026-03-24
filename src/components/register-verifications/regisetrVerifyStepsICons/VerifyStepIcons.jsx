import React from "react";
import style from "./VerifyStepsICons.module.css";
import { IoIosArrowForward } from "react-icons/io";

const VerifyStepIcons = ({currentStep, steps }) => {
  return (
    <div className={style.sellerRegisterSteps}>
      {steps.map((step, index) => {
        const isActive = index +1 <= currentStep

        return (
         <div key={index}
         className={`${style.sellerStepContainer} ${isActive ? style.activeStep : ""}`}>
           <div  className={style.iconsConatiner}>
              {React.cloneElement(step.icon,{
                color:isActive ? "#6CB4EE" : "grey" 
              })}
          </div>
          <p>{step.name}</p>
         </div>
        )
      }
      )}
    </div>
  );
};

export default VerifyStepIcons;
