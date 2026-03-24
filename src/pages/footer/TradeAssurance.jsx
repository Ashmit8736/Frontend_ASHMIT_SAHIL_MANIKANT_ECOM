// import React from "react";
// import style from "./TradeAssurance.module.css";

// const TradeAssurance = () => {
//     return (
//         <div className={style.tradePage}>
//             {/* HERO */}
//             <section className={style.hero}>
//                 <div className={style.heroContent}>
//                     <h1>Trade Assurance</h1>
//                     <p>
//                         Secure your B2B transactions with Emojija’s Trade Assurance program.
//                         Buy with confidence from verified suppliers.
//                     </p>
//                 </div>
//             </section>

//             {/* OVERVIEW */}
//             <section className={style.section}>
//                 <h2>What is Trade Assurance?</h2>
//                 <p>
//                     Trade Assurance is a buyer protection service that safeguards your
//                     payments and ensures order fulfillment as per agreed terms. It
//                     provides security against delays, quality issues, and non-delivery
//                     risks.
//                 </p>
//             </section>

//             {/* HOW IT WORKS */}
//             <section className={style.section}>
//                 <h2>How Trade Assurance Works</h2>

//                 <div className={style.steps}>
//                     <div className={style.stepCard}>
//                         <span>01</span>
//                         <h3>Place Order</h3>
//                         <p>
//                             Choose Trade Assurance while placing your bulk order with a
//                             verified supplier.
//                         </p>
//                     </div>

//                     <div className={style.stepCard}>
//                         <span>02</span>
//                         <h3>Secure Payment</h3>
//                         <p>
//                             Your payment is securely held until the supplier meets delivery
//                             and quality commitments.
//                         </p>
//                     </div>

//                     <div className={style.stepCard}>
//                         <span>03</span>
//                         <h3>Order Fulfillment</h3>
//                         <p>
//                             Supplier delivers products as per agreed specifications and
//                             timeline.
//                         </p>
//                     </div>

//                     <div className={style.stepCard}>
//                         <span>04</span>
//                         <h3>Buyer Protection</h3>
//                         <p>
//                             In case of disputes, Emojija assists in resolution or refund
//                             as per policy.
//                         </p>
//                     </div>
//                 </div>
//             </section>

//             {/* BENEFITS */}
//             <section className={style.benefits}>
//                 <h2>Benefits for Buyers</h2>
//                 <ul>
//                     <li>Protection against non-delivery</li>
//                     <li>Assured quality and compliance</li>
//                     <li>Secure and transparent payments</li>
//                     <li>Dispute resolution support</li>
//                 </ul>
//             </section>

//             {/* DISCLAIMER */}
//             <section className={style.disclaimer}>
//                 <h2>Important Notes</h2>
//                 <p>
//                     Trade Assurance coverage applies only to eligible orders and is
//                     subject to specific terms and conditions. Buyers are advised to review
//                     supplier agreements carefully before placing orders.
//                 </p>
//             </section>

//             {/* CTA */}
//             <section className={style.cta}>
//                 <h2>Trade with Confidence</h2>
//                 <p>
//                     Secure your next bulk order with Emojija’s Trade Assurance and source
//                     products without risk.
//                 </p>
//                 <button>Start Trading</button>
//             </section>
//         </div>
//     );
// };

// export default TradeAssurance;



import React, { useEffect } from "react";
import style from "./TradeAssurance.module.css";

const TradeAssurance = () => {

    // ✅ Page open hote hi top pe smooth scroll
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    return (
        <div className={style.tradePage}>
            {/* HERO */}
            <section className={style.hero}>
                <div className={style.heroContent}>
                    <h1>Trade Assurance</h1>
                    <p>
                        Secure your B2B transactions with Emojija's Trade Assurance program.
                        Buy with confidence from verified suppliers.
                    </p>
                </div>
            </section>

            {/* OVERVIEW */}
            <section className={style.section}>
                <h2>What is Trade Assurance?</h2>
                <p>
                    Trade Assurance is a buyer protection service that safeguards your
                    payments and ensures order fulfillment as per agreed terms. It
                    provides security against delays, quality issues, and non-delivery
                    risks.
                </p>
            </section>

            {/* HOW IT WORKS */}
            <section className={style.section}>
                <h2>How Trade Assurance Works</h2>

                <div className={style.steps}>
                    <div className={style.stepCard}>
                        <span>01</span>
                        <h3>Place Order</h3>
                        <p>
                            Choose Trade Assurance while placing your bulk order with a
                            verified supplier.
                        </p>
                    </div>

                    <div className={style.stepCard}>
                        <span>02</span>
                        <h3>Secure Payment</h3>
                        <p>
                            Your payment is securely held until the supplier meets delivery
                            and quality commitments.
                        </p>
                    </div>

                    <div className={style.stepCard}>
                        <span>03</span>
                        <h3>Order Fulfillment</h3>
                        <p>
                            Supplier delivers products as per agreed specifications and
                            timeline.
                        </p>
                    </div>

                    <div className={style.stepCard}>
                        <span>04</span>
                        <h3>Buyer Protection</h3>
                        <p>
                            In case of disputes, Emojija assists in resolution or refund
                            as per policy.
                        </p>
                    </div>
                </div>
            </section>

            {/* BENEFITS */}
            <section className={style.benefits}>
                <h2>Benefits for Buyers</h2>
                <ul>
                    <li>Protection against non-delivery</li>
                    <li>Assured quality and compliance</li>
                    <li>Secure and transparent payments</li>
                    <li>Dispute resolution support</li>
                </ul>
            </section>

            {/* DISCLAIMER */}
            <section className={style.disclaimer}>
                <h2>Important Notes</h2>
                <p>
                    Trade Assurance coverage applies only to eligible orders and is
                    subject to specific terms and conditions. Buyers are advised to review
                    supplier agreements carefully before placing orders.
                </p>
            </section>

            {/* CTA */}
            <section className={style.cta}>
                <h2>Trade with Confidence</h2>
                <p>
                    Secure your next bulk order with Emojija's Trade Assurance and source
                    products without risk.
                </p>
                <button>Start Trading</button>
            </section>
        </div>
    );
};

export default TradeAssurance;