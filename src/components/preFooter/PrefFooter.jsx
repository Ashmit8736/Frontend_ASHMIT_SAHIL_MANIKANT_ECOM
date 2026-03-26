import React from "react";
import styles from "./PreFooter.module.css";

import { IoShieldOutline } from "react-icons/io5";
import { LuUsersRound, LuTruck } from "react-icons/lu";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { MdOutlinePayment } from "react-icons/md";
import { TfiHeadphoneAlt } from "react-icons/tfi";

const PreFooter = () => {
    return (
        <section className={styles.container}>
            {/* ================= STATS ================= */}
            <div className={styles.stats}>
                <div className={styles.statItem}>
                    <h2>15+</h2>
                    <p>Years of Industry Experience</p>
                </div>
                <div className={styles.statItem}>
                    <h2>₹50,000 Cr+</h2>
                    <p>Successful Business Transactions</p>
                </div>
                <div className={styles.statItem}>
                    <h2>200+</h2>
                    <p>Countries Served Globally</p>
                </div>
                <div className={styles.statItem}>
                    <h2>98%</h2>
                    <p>Customer Satisfaction Rate</p>
                </div>
            </div>

            {/* ================= INTRO ================= */}
            <div className={styles.intro}>
                <h2>Why Choose Emojija?</h2>
                <p>
                    India’s most trusted B2B marketplace, empowering businesses with
                    secure, scalable, and end-to-end trade solutions.
                </p>
            </div>

            {/* ================= FEATURES ================= */}
            <div className={styles.features}>
                <Feature
                    icon={<IoShieldOutline />}
                    title="Trade Assurance"
                    desc="Secure transactions with escrow protection and money-back assurance on verified orders."
                />

                <Feature
                    icon={<RiVerifiedBadgeFill />}
                    title="Verified Suppliers"
                    desc="All suppliers undergo strict verification and quality compliance checks."
                />

                <Feature
                    icon={<LuUsersRound />}
                    title="2M+ Active Suppliers"
                    desc="Connect with manufacturers, exporters, and wholesalers across India."
                />

                <Feature
                    icon={<LuTruck />}
                    title="Integrated Logistics"
                    desc="End-to-end logistics support with real-time tracking and insurance coverage."
                />

                <Feature
                    icon={<MdOutlinePayment />}
                    title="Flexible Payments"
                    desc="Multiple payment options including LC, T/T, and secure online payments."
                />

                <Feature
                    icon={<TfiHeadphoneAlt />}
                    title="24×7 Customer Support"
                    desc="Dedicated multilingual support available round-the-clock."
                />
            </div>

            {/* ================= CTA ================= */}
            {/* <div className={styles.cta}>
                <h2>Ready to Start Trading?</h2>
                <p>
                    Join millions of businesses already trading on Emojija.
                    Get started in minutes.
                </p>

                <div className={styles.ctaButtons}>
                    <button className={styles.primaryBtn}>Start Buying</button>
                    <button className={styles.secondaryBtn}>Start Selling</button>
                </div>
            </div> */}
        </section>
    );
};

/* ================= FEATURE CARD ================= */
const Feature = ({ icon, title, desc }) => (
    <div className={styles.featureCard}>
        <div className={styles.icon}>{icon}</div>
        <div>
            <h4>{title}</h4>
            <p>{desc}</p>
        </div>
    </div>
);

export default PreFooter;
