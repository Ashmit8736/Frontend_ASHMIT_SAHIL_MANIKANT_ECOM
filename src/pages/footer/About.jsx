// import React from "react";
// import style from "./About.module.css";

// const About = () => {
//     return (
//         <div className={style.aboutPage}>
//             {/* HERO */}
//             <section className={style.hero}>
//                 <div className={style.heroContent}>
//                     <h1>About Emojija</h1>
//                     <p>
//                         Emojija is a trusted B2B marketplace empowering businesses to source
//                         products efficiently from verified suppliers across India.
//                     </p>
//                 </div>
//             </section>

//             {/* INTRO */}
//             <section className={style.section}>
//                 <h2>Who We Are</h2>
//                 <p>
//                     Emojija is built to simplify B2B trade by connecting buyers with
//                     manufacturers, wholesalers, and distributors through a secure and
//                     transparent digital platform. We help businesses discover products,
//                     compare suppliers, and make informed purchasing decisions.
//                 </p>
//             </section>

//             {/* MISSION + VISION */}
//             <section className={style.grid}>
//                 <div className={style.card}>
//                     <h3>Our Mission</h3>
//                     <p>
//                         To enable businesses of all sizes to source quality products with
//                         confidence, transparency, and efficiency.
//                     </p>
//                 </div>

//                 <div className={style.card}>
//                     <h3>Our Vision</h3>
//                     <p>
//                         To become India’s most reliable B2B commerce ecosystem by building
//                         trust, technology, and long-term partnerships.
//                     </p>
//                 </div>
//             </section>

//             {/* WHY EMOJIJA */}
//             <section className={style.section}>
//                 <h2>Why Choose Emojija</h2>
//                 <ul className={style.list}>
//                     <li>Verified and trusted suppliers</li>
//                     <li>Secure payments with trade assurance</li>
//                     <li>Wide range of industries and categories</li>
//                     <li>Buyer-first experience and support</li>
//                     <li>Transparent pricing and sourcing</li>
//                 </ul>
//             </section>

//             {/* TRUST */}
//             <section className={style.trust}>
//                 <h2>Built on Trust</h2>
//                 <p>
//                     Every supplier on Emojija goes through verification processes to
//                     ensure quality, reliability, and authenticity. Our trade assurance
//                     and buyer protection systems are designed to safeguard every
//                     transaction.
//                 </p>
//             </section>
//         </div>
//     );
// };

// export default About;



import React, { useEffect } from "react";
import style from "./About.module.css";

const About = () => {

    // ✅ Page open hote hi top pe smooth scroll
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    return (
        <div className={style.aboutPage}>
            {/* HERO */}
            <section className={style.hero}>
                <div className={style.heroContent}>
                    <h1>About Emojija</h1>
                    <p>
                        Emojija is a trusted B2B marketplace empowering businesses to source
                        products efficiently from verified suppliers across India.
                    </p>
                </div>
            </section>

            {/* INTRO */}
            <section className={style.section}>
                <h2>Who We Are</h2>
                <p>
                    Emojija is built to simplify B2B trade by connecting buyers with
                    manufacturers, wholesalers, and distributors through a secure and
                    transparent digital platform. We help businesses discover products,
                    compare suppliers, and make informed purchasing decisions.
                </p>
            </section>

            {/* MISSION + VISION */}
            <section className={style.grid}>
                <div className={style.card}>
                    <h3>Our Mission</h3>
                    <p>
                        To enable businesses of all sizes to source quality products with
                        confidence, transparency, and efficiency.
                    </p>
                </div>

                <div className={style.card}>
                    <h3>Our Vision</h3>
                    <p>
                        To become India's most reliable B2B commerce ecosystem by building
                        trust, technology, and long-term partnerships.
                    </p>
                </div>
            </section>

            {/* WHY EMOJIJA */}
            <section className={style.section}>
                <h2>Why Choose Emojija</h2>
                <ul className={style.list}>
                    <li>Verified and trusted suppliers</li>
                    <li>Secure payments with trade assurance</li>
                    <li>Wide range of industries and categories</li>
                    <li>Buyer-first experience and support</li>
                    <li>Transparent pricing and sourcing</li>
                </ul>
            </section>

            {/* TRUST */}
            <section className={style.trust}>
                <h2>Built on Trust</h2>
                <p>
                    Every supplier on Emojija goes through verification processes to
                    ensure quality, reliability, and authenticity. Our trade assurance
                    and buyer protection systems are designed to safeguard every
                    transaction.
                </p>
            </section>
        </div>
    );
};

export default About;