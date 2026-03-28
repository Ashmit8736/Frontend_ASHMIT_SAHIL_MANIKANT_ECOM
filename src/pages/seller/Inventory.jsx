// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import styles from "./Inventory.module.css";

// const API_BASE = "http://localhost:3000/api/seller";

// const Inventory = () => {
//     const [filter, setFilter] = useState("All");
//     const [inventory, setInventory] = useState([]);
//     const [loading, setLoading] = useState(true);

//     const token = localStorage.getItem("sellerToken");
//     const config = { headers: { Authorization: `Bearer ${token}` }, withCredentials: true };

//     useEffect(() => {
//         axios
//             .get(`${API_BASE}/inventory`, config)
//             .then((res) => {
//                 setInventory(res.data.inventory || []);
//                 setLoading(false);
//             })
//             .catch((err) => {
//                 console.error("FETCH INVENTORY ERROR:", err);
//                 setLoading(false);
//             });
//     }, []);

//     const filteredInventory = inventory.filter(item => {
//         if (filter === "Low Stock") return item.stock <= item.min_stock && item.stock > 0;
//         if (filter === "Out of Stock") return item.stock === 0;
//         return true; // All products
//     });

//     // const handleStockUpdate = async (id, newStock) => {
//     //     const stockValue = parseInt(newStock);
//     //     if (isNaN(stockValue) || stockValue < 0) {
//     //         alert("Invalid stock value");
//     //         return;
//     //     }

//     //     try {
//     //         await axios.put(`${API_BASE}/inventory/${id}`, { stock: stockValue }, config);

//     //         setInventory(prev =>
//     //             prev.map(item =>
//     //                 item.id === id ? { ...item, stock: stockValue } : item
//     //             )
//     //         );
//     //     } catch (err) {
//     //         console.error("UPDATE STOCK ERROR:", err);
//     //         alert("Failed to update stock");
//     //     }
//     // };
//     const handleStockUpdate = async (id, newStock) => {
//         const stockValue = parseInt(newStock);

//         if (isNaN(stockValue) || stockValue < 0) {
//             alert("Invalid stock value");
//             return;
//         }

//         // 🔔 CONFIRMATION ALERT
//         const confirmUpdate = window.confirm(
//             `Are you sure you want to update stock to ${stockValue}?`
//         );

//         if (!confirmUpdate) {
//             return; // ❌ user cancelled
//         }

//         try {
//             await axios.put(
//                 `${API_BASE}/inventory/${id}`,
//                 { stock: stockValue },
//                 config
//             );

//             setInventory(prev =>
//                 prev.map(item =>
//                     item.id === id ? { ...item, stock: stockValue } : item
//                 )
//             );

//             // ✅ SUCCESS FEEDBACK (optional but recommended)
//             alert("Stock updated successfully");
//         } catch (err) {
//             console.error("UPDATE STOCK ERROR:", err);
//             alert("Failed to update stock");
//         }
//     };

//     if (loading) return <h2>Loading Inventory...</h2>;

//     return (
//         <div className={styles.sellerInventory}>
//             <h1>Inventory Management</h1>

//             <div className={styles.inventoryControls}>
//                 <select
//                     value={filter}
//                     onChange={(e) => setFilter(e.target.value)}
//                     className={styles.filterSelect}
//                 >
//                     <option value="All">All Products</option>
//                     <option value="Low Stock">Low Stock</option>
//                     <option value="Out of Stock">Out of Stock</option>
//                 </select>
//             </div>

//             <div className={styles.inventoryTableContainer}>
//                 <table className={styles.inventoryTable}>
//                     <thead>
//                         <tr>
//                             <th>Product</th>
//                             <th>Stock</th>
//                             <th>Min Stock</th>
//                             <th>Status</th>
//                             <th>Update</th>
//                         </tr>
//                     </thead>

//                     <tbody>
//                         {filteredInventory.map(item => (
//                             <tr
//                                 key={item.id}
//                                 className={
//                                     item.stock <= item.min_stock ? styles.rowLowStock : ""
//                                 }
//                             >
//                                 <td>{item.name}</td>
//                                 <td>{item.stock}</td>
//                                 <td>{item.min_stock}</td>

//                                 <td>
//                                     <span
//                                         className={`${styles.stockStatus}
//                                             ${item.stock === 0
//                                                 ? styles.outOfStock
//                                                 : item.stock <= item.min_stock
//                                                     ? styles.lowStock
//                                                     : styles.inStock
//                                             }`}
//                                     >
//                                         {item.stock === 0
//                                             ? "Out of Stock"
//                                             : item.stock <= item.min_stock
//                                                 ? "Low Stock"
//                                                 : "In Stock"}
//                                     </span>
//                                 </td>

//                                 <td>
//                                     <input
//                                         type="number"
//                                         defaultValue={item.stock}
//                                         onBlur={(e) => handleStockUpdate(item.id, e.target.value)}
//                                         className={styles.stockInput}
//                                     />
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// };

// export default Inventory;

import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./Inventory.module.css";

const API_BASE = "http://localhost:3000/api/seller";
const ITEMS_PER_PAGE = 10;

const Inventory = () => {
  const [filter, setFilter] = useState("All");
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);

  const token = localStorage.getItem("sellerToken");
  const config = {
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true,
  };

  useEffect(() => {
    axios
      .get(`${API_BASE}/inventory`, config)
      .then((res) => {
        setInventory(res.data.inventory || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("FETCH INVENTORY ERROR:", err);
        setLoading(false);
      });
  }, []);

  const filteredInventory = inventory.filter((item) => {
    if (filter === "Low Stock")
      return item.stock <= item.min_stock && item.stock > 0;
    if (filter === "Out of Stock") return item.stock === 0;
    return true;
  });

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(filteredInventory.length / ITEMS_PER_PAGE);

  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const paginatedInventory = filteredInventory.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  /* ================= STOCK UPDATE ================= */
  const handleStockUpdate = async (id, newStock) => {
    const stockValue = parseInt(newStock);

    if (isNaN(stockValue) || stockValue < 0) {
      alert("Invalid stock value");
      return;
    }

    const confirmUpdate = window.confirm(
      `Are you sure you want to update stock to ${stockValue}?`,
    );

    if (!confirmUpdate) return;

    try {
      await axios.put(
        `${API_BASE}/inventory/${id}`,
        { stock: stockValue },
        config,
      );

      setInventory((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, stock: stockValue } : item,
        ),
      );

      alert("Stock updated successfully");
    } catch (err) {
      console.error("UPDATE STOCK ERROR:", err);
      alert("Failed to update stock");
    }
  };

  if (loading) return <h2>Loading Inventory...</h2>;

  return (
    <div className={styles.sellerInventory}>
      <h1>Inventory Management</h1>

      <div className={styles.inventoryControls}>
        <select
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setPage(1);
          }}
          className={styles.filterSelect}
        >
          <option value="All">All Products</option>
          <option value="Low Stock">Low Stock</option>
          <option value="Out of Stock">Out of Stock</option>
        </select>
      </div>

      <div className={styles.inventoryTableContainer}>
        <table className={styles.inventoryTable}>
          <thead>
            <tr>
              <th>Product</th>
              <th>Stock</th>
              <th>Min Stock</th>
              <th>Status</th>
              <th>Enter Stock</th>
              <th>Update Stock</th>
            </tr>
          </thead>

          <tbody>
            {paginatedInventory.map((item) => (
              <tr
                key={item.id}
                className={
                  item.stock <= item.min_stock ? styles.rowLowStock : ""
                }
              >
                <td>{item.name}</td>
                <td>{item.stock}</td>
                <td>{item.min_stock}</td>

                <td>
                  <span
                    className={`${styles.stockStatus} 
                                            ${
                                              item.stock === 0
                                                ? styles.outOfStock
                                                : item.stock <= item.min_stock
                                                  ? styles.lowStock
                                                  : styles.inStock
                                            }`}
                  >
                    {item.stock === 0
                      ? "Out of Stock"
                      : item.stock <= item.min_stock
                        ? "Low Stock"
                        : "In Stock"}
                  </span>
                </td>

                <td>
                  <input
                    type="number"
                    defaultValue={item.stock}
                    id={`stock-input-${item.id}`}
                    className={styles.stockInput}
                  />
                </td>
                <td>
                  <div className={styles.updateWrapper}>
                    <button
                      className={styles.updateBtn}
                      onClick={() => {
                        const val = document.getElementById(
                          `stock-input-${item.id}`,
                        ).value;
                        handleStockUpdate(item.id, val);
                      }}
                    >
                      Update
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= PAGINATION ================= */}
      {totalPages > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            marginTop: "20px",
          }}
        >
          <button
            className={styles.BtnPrev}
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Prev
          </button>

          <span style={{ padding: "8px 12px" }}>
            Page {page} of {totalPages}
          </span>

          <button
            className={styles.BtnNext}
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Inventory;
