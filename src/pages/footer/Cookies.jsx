import React from "react";
import style from "./Cookies.module.css";

const Cookies = () => {
    return (
        <div className={style.cookiesPage}>
            {/* HERO */}
            <section className={style.hero}>
                <div className={style.heroContent}>
                    <h1>Cookie Policy</h1>
                    <p>
                        This Cookie Policy explains how Emojija uses cookies and similar
                        technologies to improve your browsing experience and services.
                    </p>
                </div>
            </section>

            {/* CONTENT */}
            <section className={style.section}>
                <h2>What Are Cookies?</h2>
                <p>
                    Cookies are small text files stored on your device when you visit a
                    website. They help websites remember your preferences, understand user
                    behavior, and provide a more personalized experience.
                </p>
            </section>

            <section className={style.section}>
                <h2>How We Use Cookies</h2>
                <ul className={style.list}>
                    <li>To ensure the platform functions properly</li>
                    <li>To remember your preferences and settings</li>
                    <li>To analyze traffic and improve platform performance</li>
                    <li>To enhance security and prevent fraud</li>
                </ul>
            </section>

            <section className={style.section}>
                <h2>Types of Cookies We Use</h2>
                <div className={style.grid}>
                    <div className={style.card}>
                        <h3>Essential Cookies</h3>
                        <p>
                            Required for core website functionality such as login, navigation,
                            and secure access.
                        </p>
                    </div>

                    <div className={style.card}>
                        <h3>Performance Cookies</h3>
                        <p>
                            Help us understand how users interact with the platform so we can
                            improve usability and performance.
                        </p>
                    </div>

                    <div className={style.card}>
                        <h3>Functional Cookies</h3>
                        <p>
                            Remember user choices to provide enhanced and personalized
                            features.
                        </p>
                    </div>

                    <div className={style.card}>
                        <h3>Analytics Cookies</h3>
                        <p>
                            Used to collect aggregated data on site usage for insights and
                            improvements.
                        </p>
                    </div>
                </div>
            </section>

            <section className={style.section}>
                <h2>Managing Cookies</h2>
                <p>
                    You can manage or disable cookies through your browser settings.
                    Please note that disabling cookies may affect certain features of the
                    Emojija platform.
                </p>
            </section>

            <section className={style.section}>
                <h2>Updates to This Policy</h2>
                <p>
                    We may update this Cookie Policy from time to time to reflect changes
                    in technology, laws, or our services. Updates will be posted on this
                    page.
                </p>
            </section>
        </div>
    );
};

export default Cookies;
