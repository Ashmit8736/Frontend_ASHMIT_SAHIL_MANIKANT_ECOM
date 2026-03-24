import { useState } from "react";
import adminService from "../../../store/APi/adminService";
import styles from "./BulkCategoryModal.module.css";
import { toast } from "react-toastify";

const BulkCategoryModal = ({ onClose, onCreated }) => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleUpload = async () => {
        if (!file) {
            setError("Please select an Excel (.xlsx) file");
            toast.error("Please select an Excel file");
            return;
        }

        if (!file.name.endsWith(".xlsx")) {
            setError("Only .xlsx files allowed");
            toast.error("Only .xlsx files allowed");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const formData = new FormData();
            formData.append("file", file);

            await adminService.post(
                "/categories/bulk-upload",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            toast.success("File processed. Duplicate categories were skipped.📥");

            onCreated();   // refresh list
            onClose();     // close modal

        } catch (err) {
            const msg =
                err.response?.data?.message || "Bulk upload failed";
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <h3 className={styles.stepTitle}>Bulk Category Upload</h3>

                <p className={styles.hint}>
                    Upload Excel file (.xlsx) using the correct format
                </p>

                {/* 🔥 SAMPLE EXCEL DOWNLOAD LINK */}
                <a
                    href="/sample/Sample.xlsx"
                    download
                    className={styles.downloadLink}
                >
                    📥 Download Sample Category Excel Format
                </a>

                <input
                    type="file"
                    accept=".xlsx"
                    onChange={(e) => setFile(e.target.files[0])}
                />

                {error && <p className={styles.error}>{error}</p>}

                <div className={styles.actions}>
                    <button
                        className={styles.cancel}
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancel
                    </button>

                    <button
                        className={styles.upload}
                        onClick={handleUpload}
                        disabled={loading}
                    >
                        {loading ? "Uploading..." : "Upload"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BulkCategoryModal;
