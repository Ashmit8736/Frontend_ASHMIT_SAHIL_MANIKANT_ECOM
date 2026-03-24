// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import styles from "./AdminInventory.module.css";

// const ITEMS_PER_PAGE = 8;

// const AdminInventory = () => {
//     const [inventory, setInventory] = useState([]);
//     const [warehouses, setWarehouses] = useState(["All Warehouses"]);
//     const [warehouseFilter, setWarehouseFilter] = useState("All Warehouses");
//     const [statusFilter, setStatusFilter] = useState("All Status");
//     const [loading, setLoading] = useState(true);
//     const [page, setPage] = useState(1);

//     useEffect(() => {
//         const fetchInventory = async () => {
//             try {
//                 const token = localStorage.getItem("adminToken");

//                 const res = await axios.get(
//                     "http://localhost:3000/api/admin/inventory",
//                     { headers: { Authorization: `Bearer ${token}` } }
//                 );

//                 setInventory(res.data.inventory);

//                 // 🟦 Dynamic Warehouse List
//                 const wh = ["All Warehouses", ...(res.data.warehouses || [])];

//                 setWarehouses(wh);
//             } catch (err) {
//                 console.error("Inventory Fetch Error:", err);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchInventory();
//     }, []);

//     // 🔍 Filters
//     const filteredProducts = inventory.filter((p) => {
//         const wMatch =
//             warehouseFilter === "All Warehouses" || p.warehouse === warehouseFilter;

//         const sMatch =
//             statusFilter === "All Status" || p.status === statusFilter;

//         return wMatch && sMatch;
//     });

//     // 🔢 Pagination
//     const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
//     const startIdx = (page - 1) * ITEMS_PER_PAGE;
//     const currentData = filteredProducts.slice(startIdx, startIdx + ITEMS_PER_PAGE);

//     return (
//         <div className={styles.container}>
//             {/* Header */}
//             <div className={styles.header}>
//                 <h2>Inventory Management</h2>
//             </div>

//             {loading ? (
//                 <p>Loading inventory...</p>
//             ) : (
//                 <>
//                     {/* 🔥 Stats Section */}
//                     <div className={styles.stats}>
//                         <div className={styles.card}>
//                             <p>Total Products</p>
//                             <h3>{inventory.length}</h3>
//                         </div>

//                         <div className={styles.card}>
//                             <p>Low Stock</p>
//                             <h3>{inventory.filter((p) => p.status === "Low Stock").length}</h3>
//                         </div>

//                         <div className={styles.card}>
//                             <p>Out of Stock</p>
//                             <h3>{inventory.filter((p) => p.status === "Out of Stock").length}</h3>
//                         </div>
//                     </div>

//                     {/* Filters */}
//                     <div className={styles.filters}>
//                         {/* 🟦 Dynamic Warehouse Dropdown */}
//                         <select
//                             value={warehouseFilter}
//                             onChange={(e) => {
//                                 setWarehouseFilter(e.target.value);
//                                 setPage(1);
//                             }}
//                         >
//                             {warehouses.map((w, i) => (
//                                 <option key={i}>{w}</option>
//                             ))}
//                         </select>

//                         <select
//                             value={statusFilter}
//                             onChange={(e) => {
//                                 setStatusFilter(e.target.value);
//                                 setPage(1);
//                             }}
//                         >
//                             <option>All Status</option>
//                             <option>In Stock</option>
//                             <option>Low Stock</option>
//                             <option>Reorder Soon</option>
//                             <option>Out of Stock</option>
//                         </select>
//                     </div>

//                     {/* Table */}
//                     <table className={styles.table}>
//                         <thead>
//                             <tr>
//                                 <th>Product</th>
//                                 <th>SKU</th>
//                                 <th>Owner</th>
//                                 <th>Warehouse</th>
//                                 <th>Stock</th>
//                                 <th>Reorder Point</th>
//                                 <th>Status</th>
//                                 <th>Days to Stockout</th>
//                             </tr>
//                         </thead>

//                         <tbody>
//                             {currentData.map((p, i) => (
//                                 <tr key={i}>
//                                     <td>{p.name}</td>
//                                     <td>{p.sku}</td>
//                                     <td>{p.owner}</td>
//                                     <td>{p.warehouse}</td>
//                                     <td>{p.stock}</td>
//                                     <td>{p.reorder}</td>

//                                     {/* 🟩 Status With Color Class */}
//                                     <td>
//                                         <span
//                                             className={`${styles.status} ${styles[p.status.replace(/\s+/g, "").toLowerCase()]
//                                                 }`}
//                                         >
//                                             {p.status}
//                                         </span>
//                                     </td>

//                                     <td>{p.days_left}</td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>

//                     {/* 📌 Pagination */}
//                     {totalPages > 1 && (
//                         <div className={styles.pagination}>
//                             <button disabled={page === 1} onClick={() => setPage(page - 1)}>
//                                 Prev
//                             </button>

//                             {[...Array(totalPages)].map((_, i) => (
//                                 <button
//                                     key={i}
//                                     className={`${page === i + 1 ? styles.activePage : ""}`}
//                                     onClick={() => setPage(i + 1)}
//                                 >
//                                     {i + 1}
//                                 </button>
//                             ))}

//                             <button
//                                 disabled={page === totalPages}
//                                 onClick={() => setPage(page + 1)}
//                             >
//                                 Next
//                             </button>
//                         </div>
//                     )}
//                 </>
//             )}
//         </div>
//     );
// };

// export default AdminInventory;

import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./AdminInventory.module.css";

export default function AdminInventory() {
    const [inventory, setInventory] = useState([]);
    const [warehouses, setWarehouses] = useState(["All Warehouses"]);
    const [warehouseFilter, setWarehouseFilter] = useState("All Warehouses");
    const [statusFilter, setStatusFilter] = useState("All Status");
    const [loading, setLoading] = useState(true);

    // ✅ Buyers Style Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const token = localStorage.getItem("adminToken");

    useEffect(() => {
        const fetchInventory = async () => {
            try {
                const res = await axios.get(
                    "http://localhost:3000/api/admin/inventory",
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                setInventory(res.data.inventory);

                const wh = ["All Warehouses", ...(res.data.warehouses || [])];
                setWarehouses(wh);
            } catch (err) {
                console.error("Inventory Fetch Error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchInventory();
    }, []);

    // 🔍 Filters
    const filteredProducts = inventory.filter((p) => {
        const wMatch =
            warehouseFilter === "All Warehouses" || p.warehouse === warehouseFilter;

        const sMatch =
            statusFilter === "All Status" || p.status === statusFilter;

        return wMatch && sMatch;
    });

    // ==============================
    // BUYERS STYLE PAGINATION LOGIC
    // ==============================
    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentData = filteredProducts.slice(indexOfFirst, indexOfLast);

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    const changePage = (num) => setCurrentPage(num);
    // ==============================

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2>Inventory Management</h2>
            </div>

            {loading ? (
                <p>Loading inventory...</p>
            ) : (
                <>
                    {/* Stats */}
                    <div className={styles.stats}>
                        <div className={styles.card}>
                            <p>Total Products</p>
                            <h3>{inventory.length}</h3>
                        </div>

                        <div className={styles.card}>
                            <p>Low Stock</p>
                            <h3>{inventory.filter((p) => p.status === "Low Stock").length}</h3>
                        </div>

                        <div className={styles.card}>
                            <p>Out of Stock</p>
                            <h3>{inventory.filter((p) => p.status === "Out of Stock").length}</h3>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className={styles.filters}>
                        <select
                            value={warehouseFilter}
                            onChange={(e) => {
                                setWarehouseFilter(e.target.value);
                                setCurrentPage(1);
                            }}
                        >
                            {warehouses.map((w, i) => (
                                <option key={i}>{w}</option>
                            ))}
                        </select>

                        <select
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value);
                                setCurrentPage(1);
                            }}
                        >
                            <option>All Status</option>
                            <option>In Stock</option>
                            <option>Low Stock</option>
                            <option>Reorder Soon</option>
                            <option>Out of Stock</option>
                        </select>
                    </div>

                    {/* Table */}
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>SKU</th>
                                <th>Owner</th>
                                <th>Warehouse</th>
                                <th>Stock</th>
                                <th>Reorder Point</th>
                                <th>Status</th>
                                <th>Days to Stockout</th>
                            </tr>
                        </thead>

                        <tbody>
                            {currentData.map((p, i) => (
                                <tr key={i}>
                                    <td>{p.name}</td>
                                    <td>{p.sku}</td>
                                    <td>{p.owner}</td>
                                    <td>{p.warehouse}</td>
                                    <td>{p.stock}</td>
                                    <td>{p.reorder}</td>
                                    <td>
                                        <span
                                            className={`${styles.status} ${
                                                styles[p.status.replace(/\s+/g, "").toLowerCase()]
                                            }`}
                                        >
                                            {p.status}
                                        </span>
                                    </td>
                                    <td>{p.days_left}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* PAGINATION UI (Same as Buyers) */}
                    {totalPages > 1 && (
    <div className={styles.pagination}>
        <button className={styles.BtnPrev}
            disabled={currentPage === 1}
            onClick={() => changePage(currentPage - 1)}
        >
            Prev
        </button>

        <span className={styles.pageInfo}>
            Page {currentPage} of {totalPages}
        </span>

        <button className={styles.BtnNext}
            disabled={currentPage === totalPages}
            onClick={() => changePage(currentPage + 1)}
        >
            Next
        </button>
    </div>
)}
                </>
            )}
        </div>
    );
}



