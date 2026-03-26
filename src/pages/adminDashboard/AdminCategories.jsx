// import { useEffect, useState, useCallback } from "react";
// import adminService from "../../store/APi/adminService";
// import styles from "./AdminCategories.module.css";

// // Modals
// import CreateCategoryModal from "./modals/CreateCategoryModal";
// import EditCategoryModal from "./modals/EditCategoryModal";
// import ViewCategoryModal from "./modals/ViewCategoryModal";
// import ConfirmModal from "./modals/ConfirmModal";
// import BulkCategoryModal from "./modals/BulkCategoryModal";



// const AdminCategories = () => {
//     const [tree, setTree] = useState([]);
//     const [level1, setLevel1] = useState([]);

//     // modal states
//     const [modal, setModal] = useState({
//         create: false,
//         bulk: false,
//         edit: null,
//         view: null,
//         editImage: null,
//         disableId: null,
//         deleteId: null,
//     });

//     /* ================= FETCH ================= */
//     const fetchCategoryTree = useCallback(async () => {
//         try {
//             const res = await adminService.get("/categories/tree");
//             const data = res.data.categories || [];
//             setTree(data);
//             setLevel1(data);
//         } catch (err) {
//             console.error("Category fetch error", err);
//         }
//     }, []);

//     useEffect(() => {
//         fetchCategoryTree();
//     }, [fetchCategoryTree]);

//     /* ================= ACTIONS ================= */
//     const handleStatusChange = async (id, action) => {
//         try {
//             await adminService.patch(`/categories/${id}/${action}`);
//             fetchCategoryTree();
//         } catch {
//             alert(`${action} failed`);
//         }
//     };

//     const handleDelete = async () => {
//         try {
//             await adminService.delete(`/categories/${modal.deleteId}`);
//             setModal((p) => ({ ...p, deleteId: null }));
//             fetchCategoryTree();
//         } catch (err) {
//             alert(err.response?.data?.message || "Delete failed");
//         }
//     };

//     /* ================= UI ================= */
//     return (
//         <div className={styles.container}>
//             {/* ================= HEADER ================= */}
//             <div className={styles.header}>
//                 <h2>Category Management</h2>

//                 <div className={styles.headerActions}>
//                     <button
//                         className={styles.addBtn}
//                         onClick={() =>
//                             setModal((p) => ({ ...p, create: true }))
//                         }
//                     >
//                         + Create Category
//                     </button>

//                     <button
//                         className={styles.bulkBtn}
//                         onClick={() =>
//                             setModal((p) => ({ ...p, bulk: true }))
//                         }
//                     >
//                         + Add Multiple
//                     </button>
//                 </div>
//             </div>

//             {/* ================= GRID ================= */}
//             <div className={styles.grid}>
//                 {level1.map((cat) => (
//                     <div
//                         key={cat.id}
//                         className={styles.card}
//                         onClick={() =>
//                             setModal((p) => ({ ...p, view: cat }))
//                         }
//                     >
//                         <img
//                             src={cat.image_url || "/icons/category-placeholder.png"}
//                             alt={cat.category_name}
//                         />

//                         <h4>{cat.category_name}</h4>


//                         <span
//                             className={
//                                 cat.status === 1
//                                     ? styles.active
//                                     : styles.disabled
//                             }
//                         >
//                             {cat.status === 1 ? "Active" : "Disabled"}
//                         </span>

//                         <div className={styles.actions}>
//                             <button
//                                 onClick={(e) => {
//                                     e.stopPropagation();
//                                     setModal((p) => ({ ...p, edit: cat }));
//                                 }}
//                             >
//                                 Edit
//                             </button>

//                             {cat.status === 1 ? (
//                                 <button
//                                     className={styles.disable}
//                                     onClick={(e) => {
//                                         e.stopPropagation();
//                                         setModal((p) => ({
//                                             ...p,
//                                             disableId: cat.id,
//                                         }));
//                                     }}
//                                 >
//                                     Disable
//                                 </button>
//                             ) : (
//                                 <button
//                                     className={styles.enable}
//                                     onClick={(e) => {
//                                         e.stopPropagation();
//                                         handleStatusChange(cat.id, "enable");
//                                     }}
//                                 >
//                                     Enable
//                                 </button>
//                             )}

//                             <button
//                                 className={styles.delete}
//                                 onClick={(e) => {
//                                     e.stopPropagation();
//                                     setModal((p) => ({
//                                         ...p,
//                                         deleteId: cat.id,
//                                     }));
//                                 }}
//                             >
//                                 Delete
//                             </button>
//                         </div>
//                     </div>
//                 ))}
//             </div>

//             {/* ================= MODALS ================= */}

//             {modal.create && (
//                 <CreateCategoryModal
//                     onClose={() =>
//                         setModal((p) => ({ ...p, create: false }))
//                     }
//                     onCreated={fetchCategoryTree}
//                 />
//             )}

//             {modal.bulk && (
//                 <BulkCategoryModal
//                     onClose={() =>
//                         setModal((p) => ({ ...p, bulk: false }))
//                     }
//                     onCreated={fetchCategoryTree}
//                 />
//             )}

//             {modal.edit && (
//                 <EditCategoryModal
//                     category={modal.edit}
//                     onClose={() =>
//                         setModal((p) => ({ ...p, edit: null }))
//                     }
//                     onUpdated={fetchCategoryTree}
//                 />
//             )}

//             {modal.view && (
//                 <ViewCategoryModal
//                     category={modal.view}

//                     onClose={() =>
//                         setModal((p) => ({ ...p, view: null }))
//                     }

//                     /* 🔥 ADD / EDIT LEVEL-2 OR LEVEL-3 */
//                     onEdit={(cat) => {
//                         setModal((p) => ({
//                             ...p,
//                             view: null,
//                             edit: cat, // ✅ opens EditCategoryModal
//                         }));
//                     }}

//                     /* 🔥 DISABLE LEVEL-2 / LEVEL-3 */
//                     onDisable={(id) => {
//                         setModal((p) => ({
//                             ...p,
//                             view: null,
//                             disableId: id, // ✅ opens ConfirmModal
//                         }));
//                     }}

//                     /* 🔥 DELETE LEVEL-2 / LEVEL-3 */
//                     onDelete={(id) => {
//                         setModal((p) => ({
//                             ...p,
//                             view: null,
//                             deleteId: id, // ✅ opens ConfirmModal
//                         }));
//                     }}
//                 />
//             )}


//             {modal.disableId && (
//                 <ConfirmModal
//                     title="Disable Category"
//                     text="This category will be hidden from sellers & buyers."
//                     onCancel={() =>
//                         setModal((p) => ({ ...p, disableId: null }))
//                     }
//                     // onConfirm={() =>
//                     //     handleStatusChange(modal.disableId, "disable")
//                     // }
//                     onConfirm={async () => {
//     await handleStatusChange(modal.disableId, "disable");

//     // 🔥 modal close karo
//     setModal((p) => ({ ...p, disableId: null }));
// }}

//                 />
//             )}

//             {modal.deleteId && (
//                 <ConfirmModal
//                     danger
//                     title="Delete Category"
//                     text="This action is permanent and cannot be undone."
//                     onCancel={() =>
//                         setModal((p) => ({ ...p, deleteId: null }))
//                     }
//                     onConfirm={handleDelete}
//                 />
//             )}
//         </div>
//     );
// };

// export default AdminCategories;




import { useEffect, useState, useCallback, useRef } from "react";
import adminService from "../../store/APi/adminService";
import styles from "./AdminCategories.module.css";

import CreateCategoryModal from "./modals/CreateCategoryModal";
import EditCategoryModal from "./modals/EditCategoryModal";
import ViewCategoryModal from "./modals/ViewCategoryModal";
import ConfirmModal from "./modals/ConfirmModal";
import BulkCategoryModal from "./modals/BulkCategoryModal";

// =======================
// ⭐ PAGINATION
// =======================
const Pagination = ({ currentPage, totalPages, onPageChange }) => (
    <div className={styles.pagination}>
        <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
        >
            ◀ Prev
        </button>
        <span>{currentPage} / {totalPages}</span>
        <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
        >
            Next ▶
        </button>
    </div>
);

const AdminCategories = () => {
    const [level1, setLevel1] = useState([]);

    // ✅ Pagination states
    const [page, setPage]             = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // ✅ Scroll ref
    const topRef = useRef(null);

    const [modal, setModal] = useState({
        create: false,
        bulk: false,
        edit: null,
        view: null,
        editImage: null,
        disableId: null,
        deleteId: null,
    });

    /* ================= FETCH ================= */
    const fetchCategories = useCallback(async (pageNum = 1) => {
        try {
            const res = await adminService.get(
             `/categories/tree?page=${pageNum}&limit=10`
            );
            setLevel1(res.data.categories || []);
            setTotalPages(res.data.pagination?.totalPages || 1);
            setPage(pageNum);

            // ✅ Auto scroll to top
            setTimeout(() => {
                topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 100);

        } catch (err) {
            console.error("Category fetch error", err);
        }
    }, []);

    useEffect(() => {
        fetchCategories(1);
    }, [fetchCategories]);

    /* ================= ACTIONS ================= */
    const handleStatusChange = async (id, action) => {
        try {
            await adminService.patch(`/categories/${id}/${action}`);
            fetchCategories(page); // ✅ same page pe raho
        } catch {
            alert(`${action} failed`);
        }
    };

    const handleDelete = async () => {
        try {
            await adminService.delete(`/categories/${modal.deleteId}`);
            setModal((p) => ({ ...p, deleteId: null }));
            fetchCategories(page); // ✅ same page pe raho
        } catch (err) {
            alert(err.response?.data?.message || "Delete failed");
        }
    };

    /* ================= UI ================= */
    return (
        <div className={styles.container} ref={topRef}> {/* ✅ ref yahan */}

            {/* HEADER */}
            <div className={styles.header}>
                <h2>Category Management</h2>
                <div className={styles.headerActions}>
                    <button
                        className={styles.addBtn}
                        onClick={() => setModal((p) => ({ ...p, create: true }))}
                    >
                        + Create Category
                    </button>
                    <button
                        className={styles.bulkBtn}
                        onClick={() => setModal((p) => ({ ...p, bulk: true }))}
                    >
                        + Add Multiple
                    </button>
                </div>
            </div>

            {/* GRID */}
            <div className={styles.grid}>
                {level1.map((cat) => (
                    <div
                        key={cat.id}
                        className={styles.card}
                        onClick={() => setModal((p) => ({ ...p, view: cat }))}
                    >
                        <img
                            src={cat.image_url || "/icons/category-placeholder.png"}
                            alt={cat.category_name}
                        />
                        <h4>{cat.category_name}</h4>
                        <span className={cat.status === 1 ? styles.active : styles.disabled}>
                            {cat.status === 1 ? "Active" : "Disabled"}
                        </span>

                        <div className={styles.actions}>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setModal((p) => ({ ...p, edit: cat }));
                                }}
                            >
                                Edit
                            </button>

                            {cat.status === 1 ? (
                                <button
                                    className={styles.disable}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setModal((p) => ({ ...p, disableId: cat.id }));
                                    }}
                                >
                                    Disable
                                </button>
                            ) : (
                                <button
                                    className={styles.enable}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleStatusChange(cat.id, "enable");
                                    }}
                                >
                                    Enable
                                </button>
                            )}

                            <button
                                className={styles.delete}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setModal((p) => ({ ...p, deleteId: cat.id }));
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* ✅ PAGINATION */}
            <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={fetchCategories}
            />

            {/* MODALS */}
            {modal.create && (
                <CreateCategoryModal
                    onClose={() => setModal((p) => ({ ...p, create: false }))}
                    onCreated={() => fetchCategories(page)}
                />
            )}

            {modal.bulk && (
                <BulkCategoryModal
                    onClose={() => setModal((p) => ({ ...p, bulk: false }))}
                    onCreated={() => fetchCategories(page)}
                />
            )}

            {modal.edit && (
                <EditCategoryModal
                    category={modal.edit}
                    onClose={() => setModal((p) => ({ ...p, edit: null }))}
                    onUpdated={() => fetchCategories(page)}
                />
            )}

            {modal.view && (
                <ViewCategoryModal
                    category={modal.view}
                    onClose={() => setModal((p) => ({ ...p, view: null }))}
                    onEdit={(cat) => setModal((p) => ({ ...p, view: null, edit: cat }))}
                    onDisable={(id) => setModal((p) => ({ ...p, view: null, disableId: id }))}
                    onDelete={(id) => setModal((p) => ({ ...p, view: null, deleteId: id }))}
                />
            )}

            {modal.disableId && (
                <ConfirmModal
                    title="Disable Category"
                    text="This category will be hidden from sellers & buyers."
                    onCancel={() => setModal((p) => ({ ...p, disableId: null }))}
                    onConfirm={async () => {
                        await handleStatusChange(modal.disableId, "disable");
                        setModal((p) => ({ ...p, disableId: null }));
                    }}
                />
            )}

            {modal.deleteId && (
                <ConfirmModal
                    danger
                    title="Delete Category"
                    text="This action is permanent and cannot be undone."
                    onCancel={() => setModal((p) => ({ ...p, deleteId: null }))}
                    onConfirm={handleDelete}
                />
            )}
        </div>
    );
};

export default AdminCategories;