import React, { useEffect, useRef, useState } from 'react';
import style from './SuppllierFilter.module.css';
import { IoIosArrowDown } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";

const SuppllierFilter = () => {

  const data = [
    { "Category": "Electronics", "Location": "Delhi", "Ratings": "4.5" },
    { "Category": "Clothing", "Location": "Mumbai", "Ratings": "4.2" },
    { "Category": "Furniture", "Location": "Bangalore", "Ratings": "4.7" },
    { "Category": "Food & Beverages", "Location": "Kolkata", "Ratings": "4.0" }
  ];

  const [isClickedCat, setClickedCat] = useState(false);
  const [isClickedLoc, setClickedLoc] = useState(false);
  const [isClickedRate, setClickedRate] = useState(false);
  const [isClickedSort, setClickedSort] = useState(false);

  const [cat, setCat] = useState(''); 
  const [loc, setLoc] = useState('');
  const [rating, setRating] = useState('');
  const [sort, setSort] = useState('');

  const dropdownCatRef = useRef(null);
  const dropdownLocRef = useRef(null);
  const dropdownRateRef = useRef(null);
  const dropdownSortRef = useRef(null);

  useEffect(()=>{
    const hanleClickOutside = (e)=>{
      if(dropdownCatRef.current && !dropdownCatRef.current.contains(e.target)){
        setClickedCat(false)
      }
    }
    document.addEventListener("mousedown",hanleClickOutside);
    return ()=> removeEventListener("mousedown",hanleClickOutside);
  },[])

  useEffect(()=>{
    const hanleClickOutside = (e)=>{
      if(dropdownLocRef.current && !dropdownLocRef.current.contains(e.target)){
        setClickedLoc(false)
      }
    }
    document.addEventListener("mousedown",hanleClickOutside);
    return ()=> removeEventListener("mousedown",hanleClickOutside);
  },[])
  useEffect(()=>{
    const hanleClickOutside = (e)=>{
      if(dropdownRateRef.current && !dropdownRateRef.current.contains(e.target)){
        setClickedRate(false)
      }
    }
    document.addEventListener("mousedown",hanleClickOutside);
    return ()=> removeEventListener("mousedown",hanleClickOutside);
  },[])
  useEffect(()=>{
    const hanleClickOutside = (e)=>{
      if(dropdownSortRef.current && !dropdownSortRef.current.contains(e.target)){
        setClickedSort(false)
      }
    }
    document.addEventListener("mousedown",hanleClickOutside);
    return ()=> removeEventListener("mousedown",hanleClickOutside);
  },[])

  return (
    <div className={style.cont}>

      {/* Category */}
      <div  
      ref={dropdownCatRef}
      className={style.filterWrapper}>
        <div className={style.outer}>
          <input 
            type="text"
            placeholder='Category*'
            value={cat}
            onFocus={() => setClickedCat(true)}
            onChange={(e) => {
              setCat(e.target.value);
              setClickedCat(true);
            }}
          />
          {cat && <RxCross2 className={style.icon} onClick={(e) => {
            e.stopPropagation();
            setCat('');
            setClickedCat(false);
          }} />}
        </div>
        {isClickedCat && (
          <div className={style.dropdown}>
            {data.filter(item => item.Category.toLowerCase().includes(cat.toLowerCase()))
              .map((item, index) => (
              <div
                key={index}
                className={style.option}
                onClick={() => {
                  setCat(item.Category);
                  setClickedCat(false);
                }}
              >
                {item.Category}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Location */}
      <div 
      ref={dropdownLocRef}
      className={style.filterWrapper}>
        <div className={style.outer}>
          <input
            type="text"
            placeholder='Location*'
            value={loc}
            onFocus={() => setClickedLoc(true)}
            onChange={(e) => {
              setLoc(e.target.value);
              setClickedLoc(true);
            }}
          />
          {loc && <RxCross2 className={style.icon} onClick={(e) => {
            e.stopPropagation();
            setLoc('');
            setClickedLoc(false);
          }} />}
        </div>
        {isClickedLoc && (
          <div className={style.dropdown}>
            {data.filter(item => item.Location.toLowerCase().includes(loc.toLowerCase()))
              .map((item, index) => (
              <div
                key={index}
                className={style.option}
                onClick={() => {
                  setLoc(item.Location);
                  setClickedLoc(false);
                }}
              >
                {item.Location}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Ratings */}
      <div 
      ref={dropdownRateRef}
      className={style.filterWrapper}>
        <div className={style.outer}>
          <input
            type="text"
            placeholder='Ratings'
            value={rating}
            className={style.ratingInput}
            onFocus={() => setClickedRate(true)}
            onChange={(e) => {
              setRating(e.target.value);
              setClickedRate(true);
            }}
          />
          {rating && <RxCross2 className={style.icon} onClick={(e) => {
            e.stopPropagation();
            setRating('');
            setClickedRate(false);
          }} />}
        </div>
        {isClickedRate && (
          <div className={style.dropdown}>
            {data.filter(item => item.Ratings.includes(rating))
              .map((item, index) => (
              <div
                key={index}
                className={style.option}
                onClick={() => {
                  setRating(item.Ratings);
                  setClickedRate(false);
                }}
              >
                {item.Ratings}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sort */}
      <div 
      ref={dropdownSortRef}
      className={style.sortWrapper}>
        <div className={style.outer} onClick={() => setClickedSort(prev => !prev)}>
          <p className={style.sort}>
            {sort || "Sort By"} <IoIosArrowDown />
          </p>
        </div>
        {isClickedSort && (
          <div className={style.dropdown}>
            <div className={style.option} onClick={() => {
              setSort("Low-to-high");
              setClickedSort(false);
            }}>
              Low-to-high
            </div>
            <div className={style.option} onClick={() => {
              setSort("High-to-low");
              setClickedSort(false);
            }}>
              High-to-low
            </div>
          </div>
        )}
      </div>

    </div>
  )
}

export default SuppllierFilter;
