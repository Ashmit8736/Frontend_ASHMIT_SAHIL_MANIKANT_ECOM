import React, { useEffect, useState } from "react";
import styles from "./SupplierCard.module.css";

const SupplierCard = () => {
    const [partners, setPartners] = useState([]);
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        fetch("http://localhost:3000/api/public/features/partners")
            .then((res) => res.json())
            .then((data) => {
                if (data.success) setPartners(data.features);
            })
            .catch(console.error);
    }, []);

    return (
        <>
            {/* GRID */}
            <div className={styles.supplierProfile}>
                {partners.map((item, index) => (
                    <div
                        key={index}
                        className={styles.profileCard}
                        onClick={() => setSelected(item)}
                    >
                        <div className={styles.badges}>
                            <span className={styles.verified}>✔ Verified</span>
                        </div>

                        <div className={styles.bussinessName}>{item.name}</div>
                        <div className={styles.city}>{item.role}</div>
                    </div>
                ))}
            </div>

            {/* MODAL */}
            {selected && (
                <div
                    className={styles.modalOverlay}
                    onClick={() => setSelected(null)}
                >
                    <div
                        className={styles.modalContent}
                        onClick={(e) => e.stopPropagation()}
                    >
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
        </>
    );
};

export default SupplierCard;
