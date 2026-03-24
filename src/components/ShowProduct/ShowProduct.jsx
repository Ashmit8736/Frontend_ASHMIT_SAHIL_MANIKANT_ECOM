
import React from "react";
import { MdOutlineVerifiedUser } from "react-icons/md";
import styles from "./ShowProduct.module.css";
import { useNavigate } from "react-router-dom";

const ShowProduct = ({ products = [] }) => {
  const navigate = useNavigate();

  if (!products.length) {
    return (
      <div className={styles.mainContainer}>
        <h3 style={{ marginLeft: "1.3rem" }}>Products</h3>
        <p style={{ marginLeft: "1.3rem" }}>No products found.</p>
      </div>
    );
  }

  const handleClick = (pdt) => {
    const slug =
      (pdt.product_name || "product")
        .toLowerCase()
        .replace(/\s+/g, "-");

    navigate(`/app/${slug}`, { state: { pdt } });
  };

  return (
    <div className={styles.mainContainer}>
      <h3 style={{ marginLeft: "1.3rem" }}>Products</h3>

      <main className={styles.right}>
        <div className={styles.productsCard}>
          <div className={styles.meta}>
            Showing <strong>{products.length}</strong> products
          </div>

          <div className={styles.productsGrid}>
            {products.map((p, index) => (
              <div
                key={`${p.product_id || index}`}
                className={styles.product}
                onClick={() => handleClick(p)}
              >
                <img
                  className={styles.thumb}
                  src={p.images?.[0]}
                  alt={p.product_name}
                />

                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div className={styles.productTitle}>
                    {p.product_name}
                  </div>
                  <div className={styles.meta}>
                    {p.brand || "Brand"}
                  </div>
                  <div className={styles.badge}>
                    <MdOutlineVerifiedUser />{" "}
                    {p.gst_verified || "GST Verified"}
                  </div>
                  <div className={styles.price}>
                    ₹ {p.product_price}{" "}
                    <span>
                      Rating: {p.rating_avg ?? "—"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ShowProduct;
