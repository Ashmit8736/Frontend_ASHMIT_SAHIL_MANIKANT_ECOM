import React from "react";
import style from "./Careers.module.css";

const Careers = () => {
    return (
        <div className={style.careerPage}>
            {/* HERO */}
            <section className={style.hero}>
                <div className={style.heroContent}>
                    <h1>Careers at Emojija</h1>
                    <p>
                        Join us in building the future of B2B commerce. Work with a team that
                        values innovation, ownership, and impact.
                    </p>
                </div>
            </section>

            {/* WHY WORK WITH US */}
            <section className={style.section}>
                <h2>Why Work With Emojija</h2>
                <p>
                    At Emojija, we believe great products are built by great people. We
                    provide an environment where talent thrives, ideas are valued, and
                    growth is continuous.
                </p>

                <ul className={style.list}>
                    <li>Collaborative and growth-driven culture</li>
                    <li>Opportunity to work on large-scale B2B systems</li>
                    <li>Fast-paced startup environment with ownership</li>
                    <li>Competitive compensation and learning opportunities</li>
                </ul>
            </section>

            {/* CULTURE */}
            <section className={style.grid}>
                <div className={style.card}>
                    <h3>Our Culture</h3>
                    <p>
                        We foster transparency, accountability, and innovation. Every team
                        member is encouraged to take ownership and contribute meaningfully.
                    </p>
                </div>

                <div className={style.card}>
                    <h3>Life at Emojija</h3>
                    <p>
                        Work alongside passionate professionals solving real-world B2B
                        challenges with technology, data, and design.
                    </p>
                </div>
            </section>

            {/* OPEN ROLES */}
            <section className={style.section}>
                <h2>Open Positions</h2>

                <div className={style.jobs}>
                    <div className={style.jobCard}>
                        <h4>Frontend Developer</h4>
                        <span>Full-time · Remote / India</span>
                        <p>
                            Build scalable and user-friendly web applications using React and
                            modern frontend technologies.
                        </p>
                    </div>

                    <div className={style.jobCard}>
                        <h4>Backend Developer</h4>
                        <span>Full-time · Noida / Remote</span>
                        <p>
                            Design and develop high-performance APIs, databases, and backend
                            services for B2B workflows.
                        </p>
                    </div>

                    <div className={style.jobCard}>
                        <h4>Product Manager</h4>
                        <span>Full-time · Noida</span>
                        <p>
                            Lead product strategy, collaborate with cross-functional teams,
                            and deliver impactful B2B features.
                        </p>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className={style.cta}>
                <h2>Ready to Join Us?</h2>
                <p>
                    Send your resume to{" "}
                    <a href="mailto:careers@emojija.com">careers@emojija.com</a>
                </p>
            </section>
        </div>
    );
};

export default Careers;
