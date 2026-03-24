import React from "react";
import styles from "./ProductDetailsModal.module.css";
import { IoMdClose } from "react-icons/io";

const ProductDetailsModal = ({ product, onClose }) => {
    if (!product) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>

                {/* ===== HEADER ===== */}
                <div className={styles.header}>
                    <h2>{product.product_name}</h2>
                    <button className={styles.closeBtn} onClick={onClose}>
                        <IoMdClose />
                    </button>
                </div>

                {/* ===== IMAGES ===== */}
                <div className={styles.imageStrip}>
                    {product.image_urls?.length > 0 ? (
                        product.image_urls.map((img, i) => (
                            <img key={i} src={img} alt={`product-${i}`} />
                        ))
                    ) : (
                        <p className={styles.noImage}>No images available</p>
                    )}
                </div>

                {/* ===== DETAILS ===== */}
                <div className={styles.detailsGrid}>
                    <div className={styles.row}>
                        <span>Category</span>
                        <span>{product.category_name || "N/A"}</span>
                    </div>
                    <div className={styles.row}>
                        <span>Price</span>
                        <span>₹{product.product_price}</span>
                    </div>
                    <div className={styles.row}>
                        <span>Unit</span>
                        <span>{product.product_unit}</span>
                    </div>
                    <div className={styles.row}>
                        <span>Total Stock</span>
                        <span>{product.total_stock}</span>
                    </div>
                    <div className={styles.row}>
                        <span>Remaining Stock</span>
                        <span>{product.remaining_stock}</span>
                    </div>
                </div>

                {/* ===== DESCRIPTIONS ===== */}
                <div className={styles.descriptionBox}>
                    <h4>Short Description</h4>
                    <p>{product.short_description || "—"}</p>
                </div>

                <div className={styles.descriptionBox}>
                    <h4>Long Description</h4>
                    <p>{product.long_description || "—"}</p>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailsModal;









