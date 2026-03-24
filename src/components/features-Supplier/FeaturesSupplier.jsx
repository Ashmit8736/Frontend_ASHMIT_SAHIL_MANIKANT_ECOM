import React, { useEffect, useState } from "react";
import styles from "./FeaturesSupplier.module.css";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";

const FeaturesSupplier = () => {
    const [partners, setPartners] = useState([]);
    const [selected, setSelected] = useState(null);
    const location = useLocation();

    // detect page
    const isAllPage = location.pathname === "/app/suppliers";
    const displayList = isAllPage ? partners : partners.slice(0, 6);

    useEffect(() => {
        axios
            .get("http://localhost:3000/api/public/features/partners")
            .then((res) => {
                if (res.data.success) setPartners(res.data.features);
            })
            .catch(console.error);
    }, []);

    return (
        <div className={styles.FeaturesSupplier}>
            {/* Header */}
            <div className={styles.headerRow}>
                <div className={styles.leftInfo}>
                    <h2 className={styles.title}>Featured Partners</h2>
                    <p className={styles.subtitle}>Verified Sellers & Suppliers</p>
                </div>

                <Link to="/app/suppliers" className={styles.viewAllBtn}>
                    View all Partners
                </Link>
            </div>


            {/* Cards */}
            <div className={styles.supplierProfile}>
                {displayList.map((p, i) => (
                    <div
                        key={i}
                        className={styles.profileCard}
                        onClick={() => setSelected(p)}
                    >
                        <div className={styles.badges}>
                            <span className={styles.verified}>✔ Verified</span>
                        </div>

                        <div className={styles.bussinessName}>{p.name}</div>
                        <div className={styles.city}>{p.role}</div>
                    </div>
                ))}
            </div>

            {/* View All */}
            {/* {!isAllPage && (
                <div className={styles.btn}>
                    <Link to="/app/suppliers" className={styles.MoreSupplier}>
                        View all Partners
                    </Link>
                </div> */}
            {/* )} */}

            {/* 🔥 MODAL */}
            {selected && (
                <div
                    className={styles.modalOverlay}
                    onClick={() => setSelected(null)}
                >
                    <div
                        className={styles.modalContent}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close */}
                        <button
                            className={styles.closeBtn}
                            onClick={() => setSelected(null)}
                        >
                            ✕
                        </button>

                        <h2 className={styles.modalTitle}>{selected.name}</h2>
                        <p className={styles.modalRole}>{selected.role}</p>

                        <span className={styles.verified}>✔ Verified</span>

                        <p className={styles.modalText}>
                            Trusted verified {selected.role.toLowerCase()} on Emojija.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FeaturesSupplier;
