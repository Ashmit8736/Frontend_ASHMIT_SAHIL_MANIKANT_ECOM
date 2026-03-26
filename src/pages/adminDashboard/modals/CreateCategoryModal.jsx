import { useState } from "react";
import { IKContext, IKUpload } from "imagekitio-react";
import styles from "./CategoryModal.module.css";
import adminService from "../../../store/APi/adminService";

const CreateCategoryModal = ({ onClose, onCreated }) => {
    const [step, setStep] = useState(1); // 1 → 2 → 3
    const [parentId, setParentId] = useState(null);

    const [form, setForm] = useState({
        category_name: "",
        description: "",
        image_url: "",
    });

    const [loading, setLoading] = useState(false);

    const imagekitAuthenticator = async () => {
        const token = localStorage.getItem("adminToken");
        const res = await fetch("http://localhost:3000/api/admin/imagekit-auth", {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.json();
    };

    const handleCreate = async () => {
        if (!form.category_name || !form.image_url) {
            return alert("Name & Image required");
        }

        setLoading(true);
        try {
            const res = await adminService.post("/categories-v2", {
                ...form,
                parent_id: parentId, // ✅ THIS IS KEY
            });

            // ✅ FIX: correct id path
            const createdId = res.data?.data?.id;

            if (!createdId) {
                throw new Error("Category ID not returned from server");
            }

            // reset form for next step
            setForm({
                category_name: "",
                description: "",
                image_url: "",
            });

            if (step < 3) {
                // 🔥 next level will use this as parent
                setParentId(createdId);
                setStep((prev) => prev + 1);
            } else {
                onCreated();
                onClose();
            }
        } catch (err) {
            alert(err.response?.data?.message || err.message || "Create failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <h3 className={styles.stepTitle}>
                    Step {step}:{" "}
                    {step === 1
                        ? "Main Category"
                        : step === 2
                            ? "Sub Category"
                            : "Nested Category"}
                </h3>

                <input
                    placeholder="Category name"
                    value={form.category_name}
                    onChange={(e) =>
                        setForm({ ...form, category_name: e.target.value })
                    }
                />

                <textarea
                    placeholder="Description (optional)"
                    value={form.description}
                    onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                    }
                />

                <IKContext
                    publicKey={import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY}
                    urlEndpoint={import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}
                    authenticator={imagekitAuthenticator}
                >
                    <IKUpload
                        onSuccess={(res) =>
                            setForm((p) => ({ ...p, image_url: res.url }))
                        }
                    />
                </IKContext>

                {form.image_url && (
                    <img src={form.image_url} className={styles.preview} />
                )}

                <div className={styles.actions}>
                    <button onClick={onClose} className={styles.cancel}>
                        Cancel
                    </button>

                    <button onClick={handleCreate} disabled={loading}>
                        {step === 3 ? "Finish" : "Create & Next"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateCategoryModal;
