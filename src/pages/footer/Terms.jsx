import React from "react";
import style from "./Terms.module.css";

const Terms = () => {
    return (
        <div className={style.termsPage}>
            {/* HERO */}
            <section className={style.hero}>
                <div className={style.heroContent}>
                    <h1>Terms & Conditions</h1>
                    <p>
                        These Terms & Conditions govern your access to and use of the Emojija
                        B2B marketplace. By using our platform, you agree to these terms.
                    </p>
                </div>
            </section>

            {/* CONTENT */}
            <section className={style.section}>
                <h2>1. Platform Overview</h2>
                <p>
                    Emojija is a B2B marketplace that connects buyers with verified
                    suppliers. Emojija does not manufacture, store, or directly sell
                    products listed on the platform.
                </p>
            </section>

            <section className={style.section}>
                <h2>2. User Eligibility</h2>
                <p>
                    Users must be legally registered businesses or authorized
                    representatives. By registering, you confirm that all provided
                    information is accurate and up to date.
                </p>
            </section>

            <section className={style.section}>
                <h2>3. Account Responsibilities</h2>
                <p>
                    You are responsible for maintaining the confidentiality of your
                    account credentials and all activities conducted through your
                    account.
                </p>
            </section>

            <section className={style.section}>
                <h2>4. Orders & Payments</h2>
                <p>
                    All transactions on Emojija are subject to agreed pricing, quantity,
                    and delivery terms between buyers and suppliers. Secure payment
                    mechanisms and trade assurance may apply where available.
                </p>
            </section>

            <section className={style.section}>
                <h2>5. Trade Assurance</h2>
                <p>
                    Trade assurance provides protection for eligible transactions.
                    Coverage, eligibility, and claims are subject to specific policy
                    guidelines.
                </p>
            </section>

            <section className={style.section}>
                <h2>6. Prohibited Activities</h2>
                <ul className={style.list}>
                    <li>Providing false or misleading information</li>
                    <li>Engaging in fraudulent or illegal activities</li>
                    <li>Violating intellectual property rights</li>
                    <li>Attempting unauthorized access to the platform</li>
                </ul>
            </section>

            <section className={style.section}>
                <h2>7. Limitation of Liability</h2>
                <p>
                    Emojija shall not be liable for indirect, incidental, or consequential
                    damages arising from platform usage, supplier actions, or third-party
                    services.
                </p>
            </section>

            <section className={style.section}>
                <h2>8. Termination</h2>
                <p>
                    Emojija reserves the right to suspend or terminate accounts that
                    violate these terms or applicable laws.
                </p>
            </section>

            <section className={style.section}>
                <h2>9. Changes to Terms</h2>
                <p>
                    These Terms & Conditions may be updated periodically. Continued use of
                    the platform indicates acceptance of revised terms.
                </p>
            </section>

            <section className={style.contact}>
                <h2>Contact Information</h2>
                <p>
                    For questions regarding these Terms, contact us at{" "}
                    <a href="mailto:legal@emojija.com">legal@emojija.com</a>.
                </p>
            </section>
        </div>
    );
};

export default Terms;
