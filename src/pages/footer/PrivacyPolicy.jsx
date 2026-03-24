import React from "react";
import style from "./PrivacyPolicy.module.css";

const PrivacyPolicy = () => {
    return (
        <div className={style.privacyPage}>
            {/* HERO */}
            <section className={style.hero}>
                <div className={style.heroContent}>
                    <h1>Privacy Policy</h1>
                    <p>
                        Your privacy is important to us. This Privacy Policy explains how
                        Emojija collects, uses, and protects your information.
                    </p>
                </div>
            </section>

            {/* CONTENT */}
            <section className={style.section}>
                <h2>Information We Collect</h2>
                <p>
                    We may collect personal and business information such as your name,
                    contact details, company information, and transaction data when you
                    use our platform.
                </p>
            </section>

            <section className={style.section}>
                <h2>How We Use Your Information</h2>
                <ul className={style.list}>
                    <li>To provide and improve our B2B marketplace services</li>
                    <li>To process transactions and manage orders</li>
                    <li>To communicate important updates and support messages</li>
                    <li>To enhance security and prevent fraudulent activities</li>
                </ul>
            </section>

            <section className={style.section}>
                <h2>Data Protection & Security</h2>
                <p>
                    Emojija implements appropriate technical and organizational measures
                    to protect your data against unauthorized access, alteration, or
                    disclosure.
                </p>
            </section>

            <section className={style.section}>
                <h2>Sharing of Information</h2>
                <p>
                    We do not sell or rent your personal information. Data may be shared
                    only with trusted partners where necessary to provide services or
                    comply with legal obligations.
                </p>
            </section>

            <section className={style.section}>
                <h2>Your Rights</h2>
                <p>
                    You have the right to access, update, or request deletion of your
                    personal information, subject to applicable laws.
                </p>
            </section>

            <section className={style.section}>
                <h2>Policy Updates</h2>
                <p>
                    This Privacy Policy may be updated periodically. Any changes will be
                    posted on this page to keep you informed.
                </p>
            </section>

            <section className={style.contact}>
                <h2>Contact Us</h2>
                <p>
                    If you have questions regarding this Privacy Policy, please contact us
                    at{" "}
                    <a href="mailto:privacy@emojija.com">privacy@emojija.com</a>.
                </p>
            </section>
        </div>
    );
};

export default PrivacyPolicy;
