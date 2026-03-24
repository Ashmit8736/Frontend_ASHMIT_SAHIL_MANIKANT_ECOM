import React, { useState } from "react";
import axios from "axios";
import styles from "./CustomCategoryModal.module.css";
import { IoMdClose } from "react-icons/io";

const API = "http://localhost:3000/api/seller/category/custom";

const CustomCategoryModal = ({ parentId, onClose, onCreated }) => {
    const [categoryName, setCategoryName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const token = localStorage.getItem("sellerToken");

    const handleSubmit = async () => {
        if (!categoryName) {
            setError("Category name required");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const res = await axios.post(
                "http://localhost:3000/api/seller/category/custom",
                {
                    category_name: categoryName,
                    parent_id: parentId, // 🔥 AUTO PARENT
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            onCreated(res.data.data); // 🔥 return {id, parent_id, level}
            onClose();
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Failed to create category");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h3>Add Sub Category</h3>
                    <IoMdClose className={styles.close} onClick={onClose} />
                </div>

                <div className={styles.body}>
                    {error && <p className={styles.error}>{error}</p>}

                    <label>Category Name</label>
                    <input
                        type="text"
                        placeholder="Enter category name"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                    />
                </div>

                <div className={styles.footer}>
                    <button onClick={onClose}>Cancel</button>
                    <button onClick={handleSubmit} disabled={loading}>
                        {loading ? "Creating..." : "Create"}
                    </button>
                </div>
            </div>
        </div>
    );
};


export default CustomCategoryModal;

