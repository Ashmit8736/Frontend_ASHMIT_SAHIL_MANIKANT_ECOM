import { useState } from "react";
import styles from "./EditCategoryModal.module.css";
import adminService from "../../../store/APi/adminService";
import { IKContext, IKUpload } from "imagekitio-react";

const EditCategoryModal = ({ category, onClose, onUpdated }) => {
    const level = Number(category.level); // 🔥 IMPORTANT

    /* ===== EDIT STATE ===== */
    const [description, setDescription] = useState(category.description || "");
    const [image, setImage] = useState(category.image_url || "");
    const [loading, setLoading] = useState(false);

    /* ===== CHILD CREATE STATE ===== */
    const [childForm, setChildForm] = useState({
        category_name: "",
        description: "",
        image_url: "",
    });

    /* ===== IMAGEKIT ===== */
    const imagekitAuthenticator = async () => {
        const token = localStorage.getItem("adminToken");
        const res = await fetch(
            "http://localhost:3000/api/admin/imagekit-auth",
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return res.json();
    };

    /* ===== UPDATE CURRENT CATEGORY ===== */
    const handleUpdate = async () => {
        setLoading(true);
        try {
            await adminService.patch(`/categories/${category.id}`, {
                description,
                image_url: image,
            });
            onUpdated();
        } catch (err) {
            alert(err.response?.data?.message || "Update failed");
        } finally {
            setLoading(false);
        }
    };

    /* ===== ADD CHILD (LEVEL 2 OR 3) ===== */
    const handleAddChild = async () => {
        const { category_name, description, image_url } = childForm;

        if (!category_name) {
            return alert("Name & Image required");
        }

        try {
            await adminService.post("/categories-v2", {
                category_name,
                description,
                image_url,
                parent_id: category.id, // 🔥 THIS IS THE KEY
            });

            setChildForm({
                category_name: "",
                description: "",
                image_url: "",
            });

            onUpdated(); // 🔥 refresh tree
        } catch (err) {
            alert(err.response?.data?.message || "Create failed");
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <h3 className={styles.title}>
                    Edit Category
                    <span className={styles.levelTag}>
                        Level {level}
                    </span>
                </h3>

                {/* ===== EDIT CURRENT CATEGORY ===== */}
                <div className={styles.section}>
                    <h4>Category Details</h4>

                    <label>Name</label>
                    <input value={category.category_name} disabled />

                    <label>Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    <label>Image</label>
                    <IKContext
                        publicKey={import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY}
                        urlEndpoint={import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}
                        authenticator={imagekitAuthenticator}
                    >
                        <IKUpload onSuccess={(res) => setImage(res.url)} />
                    </IKContext>

                    {image && (
                        <img src={image} className={styles.preview} />
                    )}

                    <button
                        onClick={handleUpdate}
                        className={styles.primary}
                        disabled={loading}
                    >
                        {loading ? "Updating..." : "Update"}
                    </button>
                </div>

                {/* ===== ADD CHILD (ONLY IF LEVEL < 3) ===== */}
                {level < 3 && (
                    <div className={styles.section}>
                        <h4>
                            Add{" "}
                            {level === 1
                                ? "Sub Category (Level 2)"
                                : "Nested Category (Level 3)"}
                        </h4>

                        <input
                            placeholder="Category name"
                            value={childForm.category_name}
                            onChange={(e) =>
                                setChildForm({
                                    ...childForm,
                                    category_name: e.target.value,
                                })
                            }
                        />

                        <textarea
                            placeholder="Description (optional)"
                            value={childForm.description}
                            onChange={(e) =>
                                setChildForm({
                                    ...childForm,
                                    description: e.target.value,
                                })
                            }
                        />

                        <IKContext
                            publicKey={import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY}
                            urlEndpoint={import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}
                            authenticator={imagekitAuthenticator}
                        >
                            <IKUpload
                                onSuccess={(res) =>
                                    setChildForm({
                                        ...childForm,
                                        image_url: res.url,
                                    })
                                }
                            />
                        </IKContext>

                        {childForm.image_url && (
                            <img
                                src={childForm.image_url}
                                className={styles.preview}
                            />
                        )}

                        <button
                            onClick={handleAddChild}
                            className={styles.secondary}
                        >
                            + Add
                        </button>
                    </div>
                )}

                <div className={styles.footer}>
                    <button onClick={onClose} className={styles.cancel}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditCategoryModal;

// import { useState } from "react";
// import styles from "./EditCategoryModal.module.css";
// import adminService from "../../../store/APi/adminService";
// import { IKContext, IKUpload } from "imagekitio-react";

// const EditCategoryModal = ({ category, onClose, onUpdated }) => {
//     const canAddChild = category.level < 4;

//     /* ===== EDIT STATE ===== */
//     const [description, setDescription] = useState(category.description || "");
//     const [image, setImage] = useState(category.image_url || "");
//     const [loading, setLoading] = useState(false);

//     /* ===== CHILD CREATE STATE ===== */
//     const [childForm, setChildForm] = useState({
//         category_name: "",
//         description: "",
//         image_url: "",
//     });

//     const imagekitAuthenticator = async () => {
//         const token = localStorage.getItem("adminToken");
//         const res = await fetch(
//             "http://localhost:3000/api/admin/imagekit-auth",
//             { headers: { Authorization: `Bearer ${token}` } }
//         );
//         return res.json();
//     };

//     /* ===== UPDATE CATEGORY ===== */
//     const handleUpdate = async () => {
//         setLoading(true);
//         try {
//             await adminService.patch(`/categories/${category.id}`, {
//                 description,
//                 image_url: image,
//             });
//             onUpdated();
//         } catch (err) {
//             alert(err.response?.data?.message || "Update failed");
//         } finally {
//             setLoading(false);
//         }
//     };

//     /* ===== ADD CHILD CATEGORY ===== */
//     const handleAddChild = async () => {
//         const { category_name, description, image_url } = childForm;

//         if (!category_name || !image_url) {
//             return alert("Name & Image required");
//         }

//         try {
//             await adminService.post("/categories-v2", {
//                 category_name,
//                 description,
//                 image_url,
//                 parent_id: category.id, // 🔥 parent is CURRENT category
//             });

//             setChildForm({
//                 category_name: "",
//                 description: "",
//                 image_url: "",
//             });

//             onUpdated();
//         } catch (err) {
//             alert(err.response?.data?.message || "Create failed");
//         }
//     };

//     return (
//         <div className={styles.overlay}>
//             <div className={styles.modal}>
//                 <h3 className={styles.title}>
//                     Category Manager
//                     <span className={styles.levelTag}>
//                         Level {category.level}
//                     </span>
//                 </h3>

//                 {/* ===== EDIT ===== */}
//                 <div className={styles.section}>
//                     <h4>Edit Category</h4>

//                     <label>Name</label>
//                     <input value={category.category_name} disabled />

//                     <label>Description</label>
//                     <textarea
//                         value={description}
//                         onChange={(e) => setDescription(e.target.value)}
//                     />

//                     <label>Image</label>
//                     <IKContext
//                         publicKey={import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY}
//                         urlEndpoint={import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}
//                         authenticator={imagekitAuthenticator}
//                     >
//                         <IKUpload onSuccess={(res) => setImage(res.url)} />
//                     </IKContext>

//                     {image && (
//                         <img
//                             src={image}
//                             alt="preview"
//                             className={styles.preview}
//                         />
//                     )}

//                     <button
//                         onClick={handleUpdate}
//                         className={styles.primary}
//                         disabled={loading}
//                     >
//                         {loading ? "Updating..." : "Update"}
//                     </button>
//                 </div>

//                 {/* ===== ADD CHILD ===== */}
//                 {canAddChild && (
//                     <div className={styles.section}>
//                         <h4>
//                             Add{" "}
//                             {category.level === 1
//                                 ? "Sub Category (Level 2)"
//                                 : "Nested Category (Level 3)"}
//                         </h4>

//                         <input
//                             placeholder="Category name"
//                             value={childForm.category_name}
//                             onChange={(e) =>
//                                 setChildForm({
//                                     ...childForm,
//                                     category_name: e.target.value,
//                                 })
//                             }
//                         />

//                         <textarea
//                             placeholder="Description"
//                             value={childForm.description}
//                             onChange={(e) =>
//                                 setChildForm({
//                                     ...childForm,
//                                     description: e.target.value,
//                                 })
//                             }
//                         />

//                         <IKContext
//                             publicKey={import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY}
//                             urlEndpoint={import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}
//                             authenticator={imagekitAuthenticator}
//                         >
//                             <IKUpload
//                                 onSuccess={(res) =>
//                                     setChildForm({
//                                         ...childForm,
//                                         image_url: res.url,
//                                     })
//                                 }
//                             />
//                         </IKContext>

//                         {childForm.image_url && (
//                             <img
//                                 src={childForm.image_url}
//                                 alt="preview"
//                                 className={styles.preview}
//                             />
//                         )}

//                         <button
//                             onClick={handleAddChild}
//                             className={styles.secondary}
//                         >
//                             + Add
//                         </button>
//                     </div>
//                 )}

//                 <div className={styles.footer}>
//                     <button onClick={onClose} className={styles.cancel}>
//                         Close
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default EditCategoryModal;
