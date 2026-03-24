


import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import styles from "./AddProductWizard.module.css";
import { IoMdClose } from "react-icons/io";
import CustomCategoryModal from "./CustomCategoryModal";

const API_BASE = "http://localhost:3000/api/seller";
const CATEGORY_API = "http://localhost:3000/api/publices/categories/tree";

const AddProductWizard = ({ onClose, onCreated, editProduct }) => {
    const isEdit = Boolean(editProduct);

    const [step, setStep] = useState(isEdit ? "details" : "category");

    const [tree, setTree] = useState([]);
    const [level1, setLevel1] = useState("");
    const [level2, setLevel2] = useState("");
    const [level3, setLevel3] = useState("");
    const [customParentId, setCustomParentId] = useState(null);


    const handleCustomCreated = ({ id, parent_id, level }) => {
        fetchTree();

        // LEVEL 2 CREATED (parent = level1)
        if (level === 2) {
            setLevel1(String(parent_id));   // 🔥 IMPORTANT
            setLevel2(String(id));
            setLevel3("");
        }

        // LEVEL 3 CREATED (parent = level2)
        if (level === 3) {
            setLevel2(String(parent_id));   // 🔥 IMPORTANT
            setLevel3(String(id));
        }

        setCustomParentId(null);
    };

    const validateStep = (step, data) => {
        if (step === "category") {
            if (!data.level1) return "Please select main category";
            if (!data.level2) return "Please select sub category";
        }

        if (step === "details") {
            const {
                product_name,
                sku,
                product_price,
                total_stock,
                remaining_stock,
                product_unit,
                short_description,
                long_description,
            } = data;

            if (!product_name || product_name.trim().length < 2)
                return "Product name must be at least 2 characters";

            if (!sku) return "SKU is required";
            if (/\s/.test(sku)) return "SKU must not contain spaces";

            if (!product_price || Number(product_price) <= 0)
                return "Enter valid product price";

            if (total_stock !== "" && Number(total_stock) < 0)
                return "Total stock cannot be negative";

            if (
                remaining_stock !== "" &&
                Number(remaining_stock) > Number(total_stock)
            )
                return "Remaining stock cannot exceed total stock";

            if (!product_unit)
                return "Product unit is required";

            if (!short_description || short_description.length < 10)
                return "Short description must be at least 10 characters";

            if (!long_description || long_description.length < 20)
                return "Long description must be at least 20 characters";
        }

        if (step === "images") {
            const hasImage = data.some((img) => img?.file);
            if (!hasImage) return "Please upload at least one product image";
        }

        return null;
    };



    const [formData, setFormData] = useState({
        product_name: "",
        sku: "",
        brand: "",
        product_price: "",
        total_stock: "",
        remaining_stock: "",
        product_unit: "",
        short_description: "",
        long_description: "",
    });

    const MAX_IMAGES = 4;
    const [images, setImages] = useState(Array(MAX_IMAGES).fill(null));
    const fileInputRefs = useRef([]);

    // 🔥 Remove image at index (set to null, don't splice to keep indexes consistent)
    const removeImage = (index) => {
        const copy = [...images];
        copy[index] = null;
        setImages(copy);
    };

    const [message, setMessage] = useState("");
    const token = localStorage.getItem("sellerToken");

    const fetchTree = async () => {
        try {
            const res = await axios.get(CATEGORY_API);
            setTree(res.data.categories || []);
        } catch (err) {
            console.error("Category fetch error", err);
        }
    };

    useEffect(() => {
        fetchTree();

        if (isEdit) {
            setFormData({
                product_name: editProduct.product_name || "",
                sku: editProduct.sku || "",
                brand: editProduct.brand || "",
                product_price: editProduct.product_price || "",
                total_stock: editProduct.total_stock || "",
                remaining_stock: editProduct.remaining_stock || "",
                product_unit: editProduct.product_unit || "",
                short_description: editProduct.short_description || "",
                long_description: editProduct.long_description || "",
            });
            // ✅ Existing images load karo
        if (editProduct.image_urls?.length > 0) {
            const existingImgs = editProduct.image_urls.map((url) => ({
                file: null,        // file nahi hai, sirf URL hai
                preview: url,      // URL hi preview hai
                isExisting: true,  // existing image ka flag
            }));
            const padded = [
                ...existingImgs,
                ...Array(Math.max(0, MAX_IMAGES - existingImgs.length)).fill(null)
            ];
            setImages(padded);
        }
        }
    }, [isEdit, editProduct]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        // ❌ SKU no spaces
        if (name === "sku" && /\s/.test(value)) return;

        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (index, e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setMessage("Only image files allowed");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setMessage("Image must be under 5MB");
            return;
        }

        const copy = [...images];
        copy[index] = {
            file,
            preview: URL.createObjectURL(file),
        };
        setImages(copy);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
            /* ---------- CATEGORY ---------- */
            if (step === "category") {
                const err = validateStep("category", { level1, level2 });
                if (err) return setMessage(err);

                setStep("details");
                return;
            }

            /* ---------- DETAILS ---------- */
            if (step === "details") {
                const {
                    product_name,
                    product_price,
                    total_stock,
                    remaining_stock,
                    product_unit,
                    short_description,
                    long_description,
                } = formData;

                if (!product_name || product_name.trim().length < 2)
                    return setMessage("Product name is required");

                if (!product_price || Number(product_price) <= 0)
                    return setMessage("Enter valid product price");

                if (total_stock && Number(total_stock) < 0)
                    return setMessage("Total stock cannot be negative");

                if (
                    remaining_stock &&
                    Number(remaining_stock) > Number(total_stock)
                )
                    return setMessage("Remaining stock cannot exceed total stock");

                if (!product_unit)
                    return setMessage("Product unit is required");

                if (!short_description || short_description.length < 10)
                    return setMessage("Short description too short");

                if (!long_description || long_description.length < 20)
                    return setMessage("Long description too short");

                if (isEdit) {
                    await axios.put(
                        `${API_BASE}/product/${editProduct.product_id}`,
                        formData,
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                } else {
                    const category_master_id = level3 || level2;

                    await axios.post(
                        `${API_BASE}/product`,
                        { ...formData, category_master_id },
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                }

                setStep("images");
                return;
            }

            /* ---------- IMAGES ---------- */
           /* ---------- IMAGES ---------- */
if (step === "images") {
    const newImages = images.filter(img => img?.file);

    if (isEdit && newImages.length === 0) {
        onCreated?.();
        onClose();
        return;
    }

    if (!isEdit && newImages.length === 0) {
        return setMessage("Please upload at least one product image");
    }

    const fd = new FormData();
    newImages.forEach((img) => fd.append("image", img.file));

    if (isEdit) {
        await axios.put(
            `${API_BASE}/product/${editProduct.product_id}/images`,
            fd,
            { headers: { Authorization: `Bearer ${token}` } }
        );
    } else {
        await axios.post(`${API_BASE}/product/image`, fd, {
            headers: { Authorization: `Bearer ${token}` }
        });
    }

    onCreated?.();
    onClose();
}

        } catch (err) {
            console.error(err);
            setMessage(err.response?.data?.message || "Something went wrong");
            const errMsg = err.response?.data?.message || "Something went wrong";
            alert(errMsg);
        }
    };

    const selectedL1 = tree.find((c) => String(c.id) === String(level1));
    const selectedL2 = selectedL1?.children?.find(
        (c) => String(c.id) === String(level2)
    );

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h2>{isEdit ? "Edit Product" : "Add Product"}</h2>
                    <IoMdClose onClick={onClose} className={styles.close} />
                </div>

                <form onSubmit={handleSubmit} className={styles.body}>

                    {/* ================= CATEGORY STEP ================= */}
                    {step === "category" && (
                        <>
                            {/* ===== LEVEL 1 ===== */}
                            <label>Category</label>
                            <div className={styles.row}>
                                <select
                                    value={level1}
                                    onChange={(e) => {
                                        setLevel1(e.target.value);
                                        setLevel2("");
                                        setLevel3("");
                                    }}
                                >
                                    <option value="">Select Category</option>
                                    {tree.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.category_name}
                                        </option>
                                    ))}
                                </select>

                                {level1 && (
                                    <button
                                        type="button"
                                        className={styles.addBtn}
                                        onClick={() => setCustomParentId(level1)}
                                    >
                                        + Add Sub
                                    </button>
                                )}
                            </div>

                            {/* ===== LEVEL 2 ===== */}
                            {level1 && (
                                <>
                                    <label>Sub Category</label>
                                    <div className={styles.row}>
                                        <select
                                            value={level2}
                                            onChange={(e) => {
                                                setLevel2(e.target.value);
                                                setLevel3("");
                                            }}
                                        >
                                            <option value="">Select Sub Category</option>
                                            {selectedL1?.children?.map((c) => (
                                                <option key={c.id} value={c.id}>
                                                    {c.category_name}
                                                </option>
                                            ))}
                                        </select>

                                        {level2 && (
                                            <button
                                                type="button"
                                                className={styles.addBtn}
                                                onClick={() => setCustomParentId(level2)}
                                            >
                                                + Add Sub
                                            </button>
                                        )}
                                    </div>
                                </>
                            )}

                            {/* ===== LEVEL 3 ===== */}
                            {level2 && selectedL2?.children?.length > 0 && (
                                <>
                                    <label>Sub Category Level 3</label>
                                    <select
                                        value={level3}
                                        onChange={(e) => setLevel3(e.target.value)}
                                    >
                                        <option value="">Select</option>
                                        {selectedL2.children.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.category_name}
                                            </option>
                                        ))}
                                    </select>
                                </>
                            )}
                        </>
                    )}

                    {/* ================= DETAILS STEP ================= */}
                    {step === "details" && (
                        <>
                            <input
                                name="product_name"
                                value={formData.product_name}
                                placeholder="Product Name"
                                onChange={handleChange}
                            />
                            <input
                                name="sku"
                                value={formData.sku}
                                placeholder="SKU (no spaces)"
                                onChange={handleChange}
                            />
                            <input
                                name="brand"
                                value={formData.brand}
                                placeholder="Brand"
                                onChange={handleChange}
                            />
                            <input
                                type="number"
                                name="product_price"
                                value={formData.product_price}
                                placeholder="Price"
                                onChange={handleChange}
                            />
                            <input
                                type="number"
                                name="total_stock"
                                value={formData.total_stock}
                                placeholder="Total Stock"   
                                onChange={handleChange}
                            />
                            <input
                                type="number"
                                name="remaining_stock" 
                                value={formData.remaining_stock}
                                placeholder="Remaining Stock"
                                onChange={handleChange}
                            />
                            <input
                                name="product_unit"
                                value={formData.product_unit}
                                placeholder="Unit (e.g., kg, pcs)"
                                onChange={handleChange}
                            />
                            <textarea
                                name="short_description"
                                value={formData.short_description}
                                placeholder="Short Description"
                                onChange={handleChange}
                            />
                            <textarea
                                name="long_description"
                                value={formData.long_description}
                                placeholder="Long Description"
                                onChange={handleChange}
                            />
                        </>
                    )}
                    {/* ================= IMAGES STEP ================= */}
                    {/* ================= IMAGES STEP ================= */}
                    {step === "images" && (
                        <div className={styles.imageGrid}>
                            {images.map((img, i) => (
                                <div key={i} className={styles.imageSlot}>

                                    {img ? (
                                        <div className={styles.previewWrapper}>
                                            <img
                                                src={img.preview}
                                                alt="preview"
                                                className={styles.imagePreview}
                                            />

                                            {/* ❌ CUT BUTTON */}
                                            <button
                                                type="button"
                                                className={styles.cutBtn}
                                                onClick={() => removeImage(i)}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <button
                                                type="button"
                                                onClick={() => fileInputRefs.current[i].click()}
                                            >
                                                Upload
                                            </button>

                                            <input
                                                hidden
                                                type="file"
                                                accept="image/png,image/jpg"
                                                ref={(el) => (fileInputRefs.current[i] = el)}
                                                onChange={(e) => handleImageChange(i, e)}
                                            />
                                        </>
                                    )}

                                </div>
                            ))}
                        </div>
                    )}
                    {message && <p className={styles.error}>{message}</p>}

                    {/* UI SAME AS BEFORE – untouched */}
                    {/* category / details / images blocks unchanged */}

                    <div className={styles.footer}>
                        <button type="submit">
                            {step === "images" ? "Finish" : "Next"}
                        </button>
                    </div>
                </form>

                {customParentId && (
                    <CustomCategoryModal
                        tree={tree}
                        parentId={customParentId}
                        onClose={() => setCustomParentId(null)}
                        onCreated={handleCustomCreated}
                    />
                )}
            </div>
        </div>
    );
};

export default AddProductWizard;