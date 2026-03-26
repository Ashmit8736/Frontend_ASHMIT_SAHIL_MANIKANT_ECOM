// import React from "react";
// import style from "./HowItWorks.module.css";

// const HowItWorks = () => {
//     return (
//         <div className={style.howPage}>
//             {/* HERO */}
//             <section className={style.hero}>
//                 <div className={style.heroContent}>
//                     <h1>How It Works</h1>
//                     <p>
//                         Emojija makes B2B sourcing simple, secure, and transparent.
//                         Follow these steps to source products confidently.
//                     </p>
//                 </div>
//             </section>

//             {/* STEPS */}
//             <section className={style.section}>
//                 <h2>Simple Buying Process</h2>

//                 <div className={style.steps}>
//                     <div className={style.stepCard}>
//                         <span>01</span>
//                         <h3>Browse Products</h3>
//                         <p>
//                             Explore thousands of products across multiple categories
//                             from verified suppliers.
//                         </p>
//                     </div>

//                     <div className={style.stepCard}>
//                         <span>02</span>
//                         <h3>Compare Suppliers</h3>
//                         <p>
//                             Check supplier profiles, pricing, ratings, and reviews
//                             to make informed decisions.
//                         </p>
//                     </div>

//                     <div className={style.stepCard}>
//                         <span>03</span>
//                         <h3>Place Bulk Orders</h3>
//                         <p>
//                             Order products in bulk with transparent pricing and
//                             flexible quantity options.
//                         </p>
//                     </div>

//                     <div className={style.stepCard}>
//                         <span>04</span>
//                         <h3>Secure Payment</h3>
//                         <p>
//                             Make payments safely using Emojija’s trade assurance
//                             and secure payment systems.
//                         </p>
//                     </div>

//                     <div className={style.stepCard}>
//                         <span>05</span>
//                         <h3>Track & Receive</h3>
//                         <p>
//                             Track your order in real-time and receive products
//                             with quality assurance.
//                         </p>
//                     </div>
//                 </div>
//             </section>

//             {/* TRUST */}
//             <section className={style.trust}>
//                 <h2>Why Buyers Trust Emojija</h2>
//                 <ul>
//                     <li>Verified suppliers and manufacturers</li>
//                     <li>Secure payments with buyer protection</li>
//                     <li>Transparent pricing and communication</li>
//                     <li>Dedicated customer support</li>
//                 </ul>
//             </section>
//         </div>
//     );
// };

// export default HowItWorks;


import React, { useEffect } from "react";
import style from "./HowItWorks.module.css";

const HowItWorks = () => {

    // ✅ Page open hote hi top pe smooth scroll
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    return (
        <div className={style.howPage}>
            {/* HERO */}
            <section className={style.hero}>
                <div className={style.heroContent}>
                    <h1>How It Works</h1>
                    <p>
                        Emojija makes B2B sourcing simple, secure, and transparent.
                        Follow these steps to source products confidently.
                    </p>
                </div>
            </section>

            {/* STEPS */}
            <section className={style.section}>
                <h2>Simple Buying Process</h2>

                <div className={style.steps}>
                    <div className={style.stepCard}>
                        <span>01</span>
                        <h3>Browse Products</h3>
                        <p>
                            Explore thousands of products across multiple categories
                            from verified suppliers.
                        </p>
                    </div>

                    <div className={style.stepCard}>
                        <span>02</span>
                        <h3>Compare Suppliers</h3>
                        <p>
                            Check supplier profiles, pricing, ratings, and reviews
                            to make informed decisions.
                        </p>
                    </div>

                    <div className={style.stepCard}>
                        <span>03</span>
                        <h3>Place Bulk Orders</h3>
                        <p>
                            Order products in bulk with transparent pricing and
                            flexible quantity options.
                        </p>
                    </div>

                    <div className={style.stepCard}>
                        <span>04</span>
                        <h3>Secure Payment</h3>
                        <p>
                            Make payments safely using Emojija's trade assurance
                            and secure payment systems.
                        </p>
                    </div>

                    <div className={style.stepCard}>
                        <span>05</span>
                        <h3>Track & Receive</h3>
                        <p>
                            Track your order in real-time and receive products
                            with quality assurance.
                        </p>
                    </div>
                </div>
            </section>

            {/* TRUST */}
            <section className={style.trust}>
                <h2>Why Buyers Trust Emojija</h2>
                <ul>
                    <li>Verified suppliers and manufacturers</li>
                    <li>Secure payments with buyer protection</li>
                    <li>Transparent pricing and communication</li>
                    <li>Dedicated customer support</li>
                </ul>
            </section>
        </div>
    );
};

export default HowItWorks;