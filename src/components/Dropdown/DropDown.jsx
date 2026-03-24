import React from 'react'
import style from './DropDown.module.css'
const DropDown = ({categories ,visible }) => {
    if (!categories) return null; // safeguard

  return (
        <header className={`${style.dropDownContainer} ${visible ? style.show : ""}`}>
            {categories .map((cat,index) => (
            <div className={style.dropdowncat} key={index}>
                <h3>{cat.heading}</h3>
                {cat.subCategories.map((sub,index) => (
                    <span key={index}><p>{sub.name}</p></span>
                ))}
            </div>
        ))}
        </header>
  )
}

export default DropDown