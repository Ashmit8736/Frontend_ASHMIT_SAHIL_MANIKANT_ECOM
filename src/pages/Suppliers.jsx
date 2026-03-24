import React, { useEffect, useState } from "react";
import styles from "../PagesStyles/Supplier.module.css";

const ITEMS_PER_PAGE = 6;

const Suppliers = () => {
  const [partners, setPartners] = useState([]);
  const [selected, setSelected] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetch("http://localhost:3000/api/public/features/partners")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setPartners(data.features);
      })
      .catch(console.error);
  }, []);

  // modal open => body scroll lock
  useEffect(() => {
    document.body.style.overflow = selected ? "hidden" : "auto";
  }, [selected]);

  // pagination logic
  const totalPages = Math.ceil(partners.length / ITEMS_PER_PAGE);
  const start = (page - 1) * ITEMS_PER_PAGE;
  const currentList = partners.slice(start, start + ITEMS_PER_PAGE);

  return (
    <div className={styles.mainCont}>
      <h1>All Suppliers</h1>
      <p>
        Explore all verified sellers & suppliers from across India.
        Trusted business partners on Emojija.
      </p>

      {/* ================= GRID ================= */}
      <div className={styles.supplierProfile}>
        {currentList.map((item, index) => (
          <div
            key={index}
            className={styles.profileCard}
            onClick={() => setSelected(item)}
          >
            <span className={styles.verified}>✔ Verified</span>

            <div className={styles.avatar}>
              <img
                src={`https://ui-avatars.com/api/?name=${item.name}&background=E5F7EE&color=065F46`}
                alt={item.name}
              />
            </div>

            <div className={styles.bussinessName}>{item.name}</div>
            <div className={styles.city}>{item.role}</div>
          </div>
        ))}
      </div>

      {/* ================= PAGINATION ================= */}
      <div className={styles.pagination}>
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
        >
          ← Prev
        </button>

        <span>
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next →
        </button>
      </div>

      {/* ================= MODAL ================= */}
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
    </div>
  );
};

export default Suppliers;
