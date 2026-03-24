import { useState, useEffect } from 'react'
import { assets } from '../../assets/assets'
import style from './Carousel.module.css'

import { IoShieldOutline } from "react-icons/io5";
import { LuUsersRound } from "react-icons/lu";
import { PiChartLineUpBold } from "react-icons/pi";

function Carousel() {
    const images = [
        assets.Carousel1,
        assets.Carousel2,
        assets.Carousel3,
    ]
    const [curridx, setCurridx] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => {
            setCurridx((prev) => prev === images.length - 1 ? 0 : prev + 1)
        }, 5000)

        return () => clearInterval(interval);
    }, [images.length])

    return (
        <div>
            <div className={style.Carousel}>
                <img src={images[curridx]} alt={`Carousel no ${curridx + 1}`} className={style.CarouselImg} />

                {/* 🔹 Black transparent overlay */}
                <div className={style.overlay}></div>

                <div className={style.carouselData}>
                    <div className={style.fixedData}>
                        <div className={style.leftData}>


                            <h2>India's Leading <br /> <span>B2B Marketplace</span></h2>

                            <div className={style.sher} >
                                <p>Connect with millions of verifies suppliers, manufacturers and <br />
                                    exporters across India. Source quality product at competitive <br />prices.</p>
                            </div>

                            <div className={style.info}>
                                <div className={style.infoCont}>
                                    <span>3M+</span>
                                    <strong>Suppliers</strong>
                                </div>
                                <div className={style.infoCont}>

                                    <strong>2M+</strong>
                                    <span>Seller</span>
                                </div>

                                <div className={style.infoCont}>
                                    <span>1M+</span>
                                    <strong>Products</strong>
                                </div>

                            </div>
                        </div>

                        <div className={style.rightData}>
                            <div className={style.rightInfo}>
                                <div>
                                    <IoShieldOutline className={style.icon1} />
                                    <strong>Trade Assurance</strong>
                                </div>
                                <p>100% secure transactions with verified suppliers and money-back  <br />gurantee
                                </p>
                            </div>
                            <div className={style.rightInfo}>
                                <div>
                                    <LuUsersRound className={style.icon2} />
                                    <strong>Verified Suppliers</strong>
                                </div>
                                <p>Access to authenticated Indian mnaufacturers and exporters
                                </p>
                            </div>
                            <div className={style.rightInfo}>
                                <div>
                                    <PiChartLineUpBold className={style.icon3} />
                                    <strong>Market Insights</strong>
                                </div>
                                <p>Real-time pricing and market trends for informed decisions</p>
                            </div>
                        </div>

                    </div>
                </div>
                <div className={style.indicators}>
                    {images.map((_, index) => {
                        return (
                            <span
                                key={index}
                                className={`${style.dot} ${curridx === index ? style.active : ""}`}
                                onClick={() => setCurridx(index)}
                            >
                                {curridx === index && <span className={style.fill}></span>}
                            </span>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default Carousel


