import React from "react";
import style from "./Press.module.css";

const Press = () => {
    return (
        <div className={style.pressPage}>
            {/* HERO */}
            <section className={style.hero}>
                <div className={style.heroContent}>
                    <h1>Press & Media</h1>
                    <p>
                        Latest news, announcements, and media coverage about Emojija and
                        our journey in B2B commerce.
                    </p>
                </div>
            </section>

            {/* INTRO */}
            <section className={style.section}>
                <h2>About Emojija</h2>
                <p>
                    Emojija is a fast-growing B2B marketplace connecting buyers with
                    verified suppliers across multiple industries. Our platform focuses
                    on transparency, trust, and technology-driven trade.
                </p>
            </section>

            {/* PRESS RELEASES */}
            <section className={style.section}>
                <h2>Press Releases</h2>

                <div className={style.pressGrid}>
                    <div className={style.pressCard}>
                        <span>March 2025</span>
                        <h3>Emojija Launches Secure B2B Trade Platform</h3>
                        <p>
                            Emojija announces the launch of its B2B marketplace aimed at
                            simplifying sourcing and procurement for businesses in India.
                        </p>
                    </div>

                    <div className={style.pressCard}>
                        <span>April 2025</span>
                        <h3>Emojija Introduces Trade Assurance for Buyers</h3>
                        <p>
                            The platform rolls out trade assurance to protect buyers and
                            ensure secure and transparent transactions.
                        </p>
                    </div>

                    <div className={style.pressCard}>
                        <span>May 2025</span>
                        <h3>Emojija Expands into Multiple Industrial Categories</h3>
                        <p>
                            Emojija expands its product catalog across machinery,
                            electronics, textiles, and chemicals.
                        </p>
                    </div>
                </div>
            </section>

            {/* MEDIA CONTACT */}
            <section className={style.contact}>
                <h2>Media Contact</h2>
                <p>
                    For press inquiries, interviews, or media-related questions,
                    please contact us at:
                </p>
                <a href="mailto:press@emojija.com">press@emojija.com</a>
            </section>
        </div>
    );
};

export default Press;
