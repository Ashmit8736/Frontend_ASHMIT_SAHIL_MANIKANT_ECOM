
import React, { useState, useEffect } from "react";
import styles from "./AdminProducts.module.css";
import axios from "axios";

const AdminProducts = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [sortType, setSortType] = useState("");

    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const token = localStorage.getItem("adminToken");
                const res = await axios.get(
                    "http://localhost:3000/api/admin/all-products",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                setProducts(res.data.products);
            } catch (err) {
                console.log("ADMIN PRODUCT FETCH ERROR:", err);
            }
        };

        fetchProducts();
    }, []);

    // =========================
    // FILTER + SORT LOGIC
    // =========================
    let filteredProducts = products.filter((p) => {
        const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchStatus = filterStatus ? p.status === filterStatus : true;
        return matchSearch && matchStatus;
    });

    // SORTING LOGIC
    if (sortType === "stock_high") {
        filteredProducts = [...filteredProducts].sort((a, b) => b.stock - a.stock);
    }
    if (sortType === "stock_low") {
        filteredProducts = [...filteredProducts].sort((a, b) => a.stock - b.stock);
    }
    if (sortType === "price_high") {
        filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
    }
    if (sortType === "price_low") {
        filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
    }
    if (sortType === "latest") {
        filteredProducts = [...filteredProducts].sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
    }

    // =========================
    // PAGINATION
    // =========================
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 6;

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2>Product Management</h2>
            </div>

            {/* TOP STATS */}
            <div className={styles.topStats}>
                <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                        <h4>Total Products</h4>
                        <p>{products.length}</p>
                    </div>

                    <div className={styles.statCard}>
                        <h4>In Stock</h4>
                        <p>{products.filter((p) => p.status === "instock").length}</p>
                    </div>

                    <div className={styles.statCard}>
                        <h4>Low Stock</h4>
                        <p>{products.filter((p) => p.status === "lowstock").length}</p>
                    </div>

                    <div className={styles.statCard}>
                        <h4>Out of Stock</h4>
                        <p>{products.filter((p) => p.status === "outofstock").length}</p>
                    </div>
                </div>
            </div>

            {/* SEARCH + FILTERS + SORT */}
            <div className={styles.controls}>
                {/* SEARCH */}
                <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={styles.search}
                />

                {/* STATUS FILTER TABS */}
                <div className={styles.filterTabs}>
                    <button
                        className={`${styles.filterTab} ${filterStatus === "" ? styles.activeTab : ""}`}
                        onClick={() => setFilterStatus("")}
                    >
                        All
                    </button>

                    <button
                        className={`${styles.filterTab} ${filterStatus === "instock" ? styles.activeTab : ""}`}
                        onClick={() => setFilterStatus("instock")}
                    >
                        In Stock
                    </button>

                    <button
                        className={`${styles.filterTab} ${filterStatus === "lowstock" ? styles.activeTab : ""}`}
                        onClick={() => setFilterStatus("lowstock")}
                    >
                        Low Stock
                    </button>

                    <button
                        className={`${styles.filterTab} ${filterStatus === "outofstock" ? styles.activeTab : ""}`}
                        onClick={() => setFilterStatus("outofstock")}
                    >
                        Out of Stock
                    </button>
                </div>

                {/* SORT DROPDOWN */}
                <select
                    className={styles.sortSelect}
                    onChange={(e) => setSortType(e.target.value)}
                >
                    <option value="">Sort By</option>
                    <option value="stock_high">Stock: High to Low</option>
                    <option value="stock_low">Stock: Low to High</option>
                    <option value="price_high">Price: High to Low</option>
                    <option value="price_low">Price: Low to High</option>
                    <option value="latest">Newest First</option>
                </select>
            </div>

            {/* TABLE */}
            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>SKU</th>
                            <th>Category</th>
                            <th>Owner</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Status</th>
                            <th>Type</th>
                        </tr>
                    </thead>

                    <tbody>
                        {currentProducts.length > 0 ? (
                            currentProducts.map((p, i) => (
                                <tr key={i}>
                                    <td>
                                        <div className={styles.productInfo}>
                                            <img src={p.images?.[0]} alt={p.name} />
                                            <span>{p.name}</span>
                                        </div>
                                    </td>
                                    <td>{p.sku}</td>
                                    <td>{p.category}</td>
                                    <td>{p.owner_name}</td>
                                    <td>₹{p.price}</td>
                                    <td className={styles.stockValue}>{p.stock}</td>

                                    <td>
                                        <span className={`${styles.statusBadge} ${styles[p.status]}`}>
                                            {p.status}
                                        </span>
                                    </td>

                                    <td>
                                        <span className={styles.typeBadge}>{p.type}</span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="9" className={styles.noData}>No products found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* PAGINATION */}
            {filteredProducts.length > 0 && (
                <div className={styles.pagination}>
                    <button  className={styles.BtnPrev} onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>← Prev</button>

                    <span className={styles.pageInfo}>Page {currentPage} of {totalPages}</span>

                    <button className={styles.BtnNext} onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>Next →</button>
                </div>
            )}
        </div>
    );
};

export default AdminProducts;
