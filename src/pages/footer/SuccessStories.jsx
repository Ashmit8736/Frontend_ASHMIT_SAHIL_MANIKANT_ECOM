import React from "react";
import style from "./SuccessStories.module.css";

const SuccessStories = () => {
    return (
        <div className={style.successPage}>
            {/* HERO */}
            <section className={style.hero}>
                <div className={style.heroContent}>
                    <h1>Success Stories</h1>
                    <p>
                        Discover how businesses across India are growing and scaling
                        efficiently with Emojija’s B2B marketplace.
                    </p>
                </div>
            </section>

            {/* INTRO */}
            <section className={style.section}>
                <h2>Trusted by Businesses Nationwide</h2>
                <p>
                    Emojija empowers buyers to source quality products from verified
                    suppliers, streamline procurement, and build long-term partnerships.
                </p>
            </section>

            {/* STORIES */}
            <section className={style.section}>
                <div className={style.storiesGrid}>
                    <div className={style.storyCard}>
                        <h3>Textile Manufacturer – Surat</h3>
                        <p className={style.quote}>
                            “With Emojija, we found reliable raw material suppliers within
                            days. Our sourcing cost reduced by 18%.”
                        </p>
                        <span>— Operations Head</span>
                    </div>

                    <div className={style.storyCard}>
                        <h3>Electronics Distributor – Delhi NCR</h3>
                        <p className={style.quote}>
                            “Bulk ordering and verified suppliers helped us scale our
                            distribution network confidently.”
                        </p>
                        <span>— Founder</span>
                    </div>

                    <div className={style.storyCard}>
                        <h3>Construction Firm – Mumbai</h3>
                        <p className={style.quote}>
                            “Trade Assurance gave us peace of mind while working with new
                            suppliers for large projects.”
                        </p>
                        <span>— Procurement Manager</span>
                    </div>

                    <div className={style.storyCard}>
                        <h3>Chemicals Trading Company – Ahmedabad</h3>
                        <p className={style.quote}>
                            “Transparent pricing and real-time communication saved us time
                            and improved supplier relationships.”
                        </p>
                        <span>— Supply Chain Lead</span>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className={style.cta}>
                <h2>Ready to Grow Your Business?</h2>
                <p>
                    Join thousands of businesses using Emojija to source smarter and grow
                    faster.
                </p>
                <button>Start Sourcing</button>
            </section>
        </div>
    );
};

export default SuccessStories;
