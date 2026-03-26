import React, { useState } from 'react'
import styles from "./Filter.module.css";

const Filter = () => {

      const [value, setValue] = useState(100)

  return (
    <main className={styles.mainContainer}>
        <h3 style={{marginLeft:"1.3rem"}}>Filter</h3>

        <div className={styles.container}>
                  <aside className={styles.left}>
                    {/* <input className={styles.search} placeholder="Search products, suppliers" /> */}
            
                    <div className={styles.filterSection}>
                      <div className={styles.meta}>Category</div>
                      <div className={styles.chipRow}>
                        <input className={styles.chips} type="checkbox" value="" id="checkDefault" />
            
                        <label className={styles.chip} htmlFor="checkDefault"> All </label>
                      </div>
                      <div className={styles.chipRow}>
                        <input className={styles.chips} type="checkbox" value="" id="checkDefault" />
                        <label className={styles.chip} htmlFor="checkDefault"> Gold </label>
                      </div>
                      <div className={styles.chipRow}>
                        <input className={styles.chips} type="checkbox" value="" id="checkDefault" />
                        <label className={styles.chip} htmlFor="checkDefault"> Diamond </label>
                      </div>
                      <div className={styles.chipRow}>
                        <input className={styles.chips} type="checkbox" value="" id="checkDefault" />
                        <label className={styles.chip} htmlFor="checkDefault"> Silver </label>
                      </div>
            
                    </div>
            
                    <div className={styles.filterSection}>
                      <div className={styles.meta}>Brand</div>
                      <div className={styles.chipRow}>
                        <input className={styles.chip} type="checkbox" value="dressberry" id="brand-dressberry" />
                        <label className={styles.chip} htmlFor="brand-dressberry">Dressberry</label>
                      </div>
                      <div className={styles.chipRow}>
                        <input className={styles.chip} type="checkbox" value="estelle" id="brand-estelle" />
                        <label className={styles.chip} htmlFor="brand-estelle">Estelle</label>
                      </div>
                      <div className={styles.chipRow}>
                        <input className={styles.chip} type="checkbox" value="priyaasi" id="brand-priyaasi" />
                        <label className={styles.chip} htmlFor="brand-priyaasi">Priyaasi</label>
                      </div>
                      <div className={styles.chipRow}>
                        <input className={styles.chip} type="checkbox" value="sukkhi" id="brand-sukkhi" />
                        <label className={styles.chip} htmlFor="brand-sukkhi">Sukkhi</label>
                      </div>
                      <div className={styles.chipRow}>
                        <input className={styles.chip} type="checkbox" />
                        <label className={styles.chip} htmlFor="">Jewel Galaxy</label>
                      </div>
                    </div>
            
                    <div className={styles.filterSection}>
                      <div className={styles.meta}>Price Range</div>
                      <span>{value}</span>
                      <div style={{ display: 'flex', alignItems: "center" }}>
                        <input className={styles.search} type='range' min={100} max={10000} step={100} value={value} onChange={e => setValue(Number(e.target.value))} />
            
                      </div>
                    </div>
            
                    <div className={styles.filterSection}>
                      <div className={styles.meta}>Color</div>
                      <div className={styles.chipRow}>
                        <input className={styles.chip} type="checkbox" />
                        <div className={styles.color} style={{backgroundColor:"red"}}></div>
                        <label className={styles.chip} htmlFor=""> Red</label>
                      </div>
                      <div className={styles.chipRow}>
                        <input className={styles.chip} type="checkbox" />
                        <div className={styles.color} style={{backgroundColor:"Black"}}></div>
                        <label className={styles.chip} htmlFor=""> Black</label>
                      </div>
                      <div className={styles.chipRow}>
                        <input className={styles.chip} type="checkbox" />
                        <div className={styles.color} style={{backgroundColor:"Blue"}}></div>
                        <label className={styles.chip} htmlFor=""> White</label>
                      </div>
                      <div className={styles.chipRow}>
                        <input className={styles.chip} type="checkbox" />
                        <div className={styles.color} style={{backgroundColor:"Green"}}></div>
                        <label className={styles.chip} htmlFor=""> Yellow</label>
                      </div>
                      <div className={styles.chipRow}>
                        <input className={styles.chip} type="checkbox" />
                        <div className={styles.color} style={{backgroundColor:"#374151"}}></div>
                        <label className={styles.chip} htmlFor=""> Navyblue</label>
                      </div>
                      <div className={styles.chipRow}>
                        <input className={styles.chip} type="checkbox" />
                        <div className={styles.color} style={{backgroundColor:"yellowgreen"}}></div>
                        <label className={styles.chip} htmlFor=""> yellowgreen </label>
                      </div>
                    </div>
            
                    <div className={styles.filterSection}>
                      <div className={styles.meta}>Occasion</div>
                      <div className={styles.chipRow}>
                        <input className={styles.chip} type="checkbox" />
                        <label className={styles.chip} htmlFor="">Party</label> 
                      </div>
                       <div className={styles.chipRow}>
                        <input className={styles.chip} type="checkbox" />
                        <label className={styles.chip} htmlFor="">Religion</label> 
                      </div>
                       <div className={styles.chipRow}>
                        <input className={styles.chip} type="checkbox" />
                        <label className={styles.chip} htmlFor="">Love</label> 
                      </div>
                       <div className={styles.chipRow}>
                        <input className={styles.chip} type="checkbox" />
                        <label className={styles.chip} htmlFor="">Workwear</label> 
                      </div>
                       <div className={styles.chipRow}>
                        <input className={styles.chip} type="checkbox" />
                        <label className={styles.chip} htmlFor="">Wedding & Engagment</label> 
                      </div>
                       <div className={styles.chipRow}>
                        <input className={styles.chip} type="checkbox" />
                        <label className={styles.chip} htmlFor="">Everyday</label> 
                      </div>
                    </div>
            
            
                    <div className={styles.filterSection}>
                      <div className={styles.meta}>Customer Rating</div>
                      <div className={styles.chipRow}>
                        <input className={styles.chip} type="checkbox" />
                        <div className={styles.rating}></div>
                        <label className={styles.chip} htmlFor="">4 * & above</label> 
                      </div>
                      <div className={styles.chipRow}>
                        <input className={styles.chip} type="checkbox" />
                        <div className={styles.rating}></div>
                        <label className={styles.chip} htmlFor="">4 * & above</label>
                        
                      </div>
                    </div>
            
                    <button className={styles.applyBtn}>Apply Filters</button>
                  </aside>
        </div>

    </main>
  )
}

export default Filter