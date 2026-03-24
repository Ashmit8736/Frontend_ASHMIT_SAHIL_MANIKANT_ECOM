


// import React, { useEffect, useState } from "react";
// import AddProductWizard from "../../components/sellerDashboard/AddProductWizard";
// import ProductDetailsModal from "../../components/sellerDashboard/ProductDetailsModal";
// import axios from "axios";
// import styles from "./Products.module.css";

// const API_BASE = "http://localhost:3000/api/seller";
// const CATEGORY_API = "http://localhost:3000/api/publices/categories";

// export default function Products() {
//     const [searchTerm, setSearchTerm] = useState("");
//     const [categoryFilter, setCategoryFilter] = useState("all");

//     const [products, setProducts] = useState([]);
//     const [categories, setCategories] = useState([]);

//     const [showWizard, setShowWizard] = useState(false);
//     const [editProduct, setEditProduct] = useState(null);
//     const [selectedProduct, setSelectedProduct] = useState(null);

//     const [page, setPage] = useState(1);
//     const [totalPages, setTotalPages] = useState(1);

//     const token = localStorage.getItem("sellerToken");
//     const axiosConfig = {
//         headers: { Authorization: `Bearer ${token}` },
//         withCredentials: true,
//     };

//     /* ================= FETCH CATEGORY MASTER ================= */
//     const fetchCategories = async () => {
//         try {
//             const res = await axios.get(CATEGORY_API);
//             setCategories(res.data.categories || []);
//         } catch (err) {
//             console.error("Category fetch error:", err);
//         }
//     };

//     /* ================= FETCH PRODUCTS ================= */
//     const fetchProducts = async (p = 1) => {
//         try {
//             const res = await axios.get(`${API_BASE}/products`, axiosConfig);
//             const received = res.data.products || [];

//             const normalized = received.map((item) => {
//                 const copy = { ...item };

//                 if (typeof copy.image_urls === "string") {
//                     try {
//                         copy.image_urls = JSON.parse(copy.image_urls);
//                     } catch {
//                         copy.image_urls = [];
//                     }
//                 }

//                 copy.image_urls = Array.isArray(copy.image_urls)
//                     ? copy.image_urls
//                     : [];

//                 return copy;
//             });

//             setProducts(normalized);
//             setPage(p);
//             setTotalPages(1);
//         } catch (err) {
//             console.error("Fetch products error:", err);
//             setProducts([]);
//         }
//     };

//     useEffect(() => {
//         fetchCategories();
//         fetchProducts(1);
//     }, []);

//     /* ================= FILTER ================= */
//     const filteredProducts = products.filter((product) => {
//         const matchName = product.product_name
//             ?.toLowerCase()
//             .includes(searchTerm.toLowerCase());

//         const matchCategory =
//             categoryFilter === "all" ||
//             String(product.category_master_id) === String(categoryFilter);

//         return matchName && matchCategory;
//     });

//     /* ================= ACTIONS ================= */
//     const handleDelete = async (id) => {
//         if (!window.confirm("Delete this product?")) return;

//         try {
//             await axios.delete(
//                 `${API_BASE}/product/${id}`,   // ✅ CORRECT ROUTE
//                 axiosConfig
//             );
//             fetchProducts(page);
//         } catch (err) {
//             console.error("Delete failed:", err);
//             alert("Delete failed");
//         }
//     };


//     const handleEdit = (product) => {
//         setEditProduct(product);
//         setShowWizard(true);
//     };

//     return (
//         <div className={styles.sellerProducts}>
//             <div className={styles.productsHeader}>
//                 <h1>Product Management</h1>
//                 <button
//                     className={styles.addProductBtn}
//                     onClick={() => {
//                         setEditProduct(null);
//                         setShowWizard(true);
//                     }}
//                 >
//                     Add Product
//                 </button>
//             </div>

//             {/* ================= FILTERS ================= */}
//             <div className={styles.filters}>
//                 <input
//                     type="text"
//                     placeholder="Search products..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     className={styles.searchInput}
//                 />
//             </div>

//             {/* ================= TABLE ================= */}
//             <div className={styles.productsTableContainer}>
//                 <table className={styles.productsTable}>
//                     <thead>
//                         <tr>
//                             <th>Image</th>
//                             <th>Name</th>
//                             <th>Category</th>
//                             <th>Price</th>
//                             <th>Total</th>
//                             <th>Remaining</th>
//                             <th>Unit</th>
//                             <th>Actions</th>
//                         </tr>
//                     </thead>

//                     <tbody>
//                         {filteredProducts.length === 0 ? (
//                             <tr>
//                                 <td colSpan="8" style={{ textAlign: "center" }}>
//                                     No products found
//                                 </td>
//                             </tr>
//                         ) : (
//                             filteredProducts.map((p) => (
//                                 <tr key={p.product_id}>
//                                     <td>
//                                         {p.image_urls?.length > 0 ? (
//                                             <img src={p.image_urls[0]} alt="" width="50" />
//                                         ) : "—"}
//                                     </td>
//                                     <td>{p.product_name}</td>
//                                     <td>{p.category_name || "N/A"}</td>
//                                     <td>₹{p.product_price}</td>
//                                     <td>{p.total_stock}</td>
//                                     <td>{p.remaining_stock}</td>
//                                     <td>{p.product_unit}</td>
//                                     <td>
//                                         <button
//                                             className={styles.viewBtn}
//                                             onClick={() => setSelectedProduct(p)}
//                                         >
//                                             View
//                                         </button>

//                                         <button
//                                             className={styles.editBtn}
//                                             onClick={() => handleEdit(p)}
//                                         >
//                                             Edit
//                                         </button>

//                                         <button
//                                             className={styles.deleteBtn}
//                                             onClick={() => handleDelete(p.product_id)}
//                                         >
//                                             Delete
//                                         </button>
//                                     </td>
//                                 </tr>
//                             ))
//                         )}
//                     </tbody>
//                 </table>
//             </div>

//             {/* ================= MODALS ================= */}
//             {showWizard && (
//                 <AddProductWizard
//                     editProduct={editProduct}
//                     onClose={() => setShowWizard(false)}
//                     onCreated={() => fetchProducts(page)}
//                 />
//             )}

//             {selectedProduct && (
//                 <ProductDetailsModal
//                     product={selectedProduct}
//                     onClose={() => setSelectedProduct(null)}
//                 />
//             )}
//         </div>
//     );
// }


import React, { useEffect, useState } from "react";
import AddProductWizard from "../../components/sellerDashboard/AddProductWizard";
import ProductDetailsModal from "../../components/sellerDashboard/ProductDetailsModal";
import axios from "axios";
import styles from "./Products.module.css";

const API_BASE = "http://localhost:3000/api/seller";
const CATEGORY_API = "http://localhost:3000/api/publices/categories";

const ITEMS_PER_PAGE = 10;

export default function Products() {
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    const [showWizard, setShowWizard] = useState(false);
    const [editProduct, setEditProduct] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const token = localStorage.getItem("sellerToken");
    const axiosConfig = {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
    };

    /* ================= FETCH CATEGORY MASTER ================= */
    const fetchCategories = async () => {
        try {
            const res = await axios.get(CATEGORY_API);
            setCategories(res.data.categories || []);
        } catch (err) {
            console.error("Category fetch error:", err);
        }
    };

    /* ================= FETCH PRODUCTS ================= */
    const fetchProducts = async (p = 1) => {
        try {
            const res = await axios.get(`${API_BASE}/products`, axiosConfig);
            const received = res.data.products || [];

            const normalized = received.map((item) => {
                const copy = { ...item };

                if (typeof copy.image_urls === "string") {
                    try {
                        copy.image_urls = JSON.parse(copy.image_urls);
                    } catch {
                        copy.image_urls = [];
                    }
                }

                copy.image_urls = Array.isArray(copy.image_urls)
                    ? copy.image_urls
                    : [];

                return copy;
            });

            setProducts(normalized);
            setPage(p);
            setTotalPages(Math.ceil(normalized.length / ITEMS_PER_PAGE));
        } catch (err) {
            console.error("Fetch products error:", err);
            setProducts([]);
        }
    };

    useEffect(() => {
        fetchCategories();
        fetchProducts(1);
    }, []);

    /* ================= FILTER ================= */
    const filteredProducts = products.filter((product) => {
        const matchName = product.product_name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase());

        const matchCategory =
            categoryFilter === "all" ||
            String(product.category_master_id) === String(categoryFilter);

        return matchName && matchCategory;
    });

    /* ================= PAGINATION ================= */
    const totalFilteredPages = Math.ceil(
        filteredProducts.length / ITEMS_PER_PAGE
    );

    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const paginatedProducts = filteredProducts.slice(
        startIndex,
        startIndex + ITEMS_PER_PAGE
    );

    /* ================= ACTIONS ================= */
    const handleDelete = async (id) => {
        if (!window.confirm("Delete this product?")) return;

        try {
            await axios.delete(
                `${API_BASE}/product/${id}`,
                axiosConfig
            );
            fetchProducts(page);
        } catch (err) {
            console.error("Delete failed:", err);
            alert("Delete failed");
        }
    };

    const handleEdit = (product) => {
        setEditProduct(product);
        setShowWizard(true);
    };

    return (
        <div className={styles.sellerProducts}>
            <div className={styles.productsHeader}>
                <h1>Product Management</h1>
                <button
                    className={styles.addProductBtn}
                    onClick={() => {
                        setEditProduct(null);
                        setShowWizard(true);
                    }}
                >
                    Add Product
                </button>
            </div>

            {/* ================= FILTERS ================= */}
            <div className={styles.filters}>
                <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setPage(1);
                    }}
                    className={styles.searchInput}
                />
            </div>

            {/* ================= TABLE ================= */}
            <div className={styles.productsTableContainer}>
                <table className={styles.productsTable}>
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Total</th>
                            <th>Remaining</th>
                            <th>Unit</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {paginatedProducts.length === 0 ? (
                            <tr>
                                <td colSpan="8" style={{ textAlign: "center" }}>
                                    No products found
                                </td>
                            </tr>
                        ) : (
                            paginatedProducts.map((p) => (
                                <tr key={p.product_id}>
                                    <td>
                                        {p.image_urls?.length > 0 ? (
                                            <img src={p.image_urls[0]} alt="" width="50" />
                                        ) : "—"}
                                    </td>
                                    <td>{p.product_name}</td>
                                    <td>{p.category_name || "N/A"}</td>
                                    <td>₹{p.product_price}</td>
                                    <td>{p.total_stock}</td>
                                    <td>{p.remaining_stock}</td>
                                    <td>{p.product_unit}</td>
                                    <td>
                                        <button
                                            className={styles.viewBtn}
                                            onClick={() => setSelectedProduct(p)}
                                        >
                                            View
                                        </button>

                                        <button
                                            className={styles.editBtn}
                                            onClick={() => handleEdit(p)}
                                        >
                                            Edit
                                        </button>

                                        <button
                                            className={styles.deleteBtn}
                                            onClick={() => handleDelete(p.product_id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* ================= PAGINATION BUTTONS ================= */}
            {totalFilteredPages > 1 && (
                <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "20px" }}>
                    <button
                        className={styles.editBtn}
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                    >
                        Prev
                    </button>

                    <span style={{ padding: "8px 12px" }}>
                        Page {page} of {totalFilteredPages}
                    </span>

                    <button
                        className={styles.viewBtn}
                        disabled={page === totalFilteredPages}
                        onClick={() => setPage(page + 1)}
                    >
                        Next
                    </button>
                </div>
            )}

            {/* ================= MODALS ================= */}
            {showWizard && (
                <AddProductWizard
                    editProduct={editProduct}
                    onClose={() => setShowWizard(false)}
                    onCreated={() => fetchProducts(page)}
                />
            )}

            {selectedProduct && (
                <ProductDetailsModal
                    product={selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                />
            )}
        </div>
    );
}
