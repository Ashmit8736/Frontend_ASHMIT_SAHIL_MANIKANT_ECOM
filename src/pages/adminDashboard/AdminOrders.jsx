
// // export default AdminOrders;
// import React, { useState, useEffect } from "react";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
// import * as XLSX from "xlsx";
// import axios from "axios";
// import styles from "./AdminOrders.module.css";

// const AdminOrders = () => {
//     const [orders, setOrders] = useState([]);
//     const [filter, setFilter] = useState("All");
//     const [search, setSearch] = useState("");
//     const [selectedOrder, setSelectedOrder] = useState(null);

//     // ===========================
//     // 🔥 FETCH ORDERS
//     // ===========================
//     useEffect(() => {
//         const fetchOrders = async () => {
//             try {
//                 const token = localStorage.getItem("adminToken");

//                 const res = await axios.get(
//                     "http://localhost:3000/api/admin/orders",
//                     { headers: { Authorization: `Bearer ${token}` } }
//                 );

//                 setOrders(res.data.orders || []);
//             } catch (err) {
//                 console.log("ORDER FETCH ERROR:", err);
//             }
//         };

//         fetchOrders();
//     }, []);

//     // ===========================
//     // 🔍 FILTER + SEARCH
//     // ===========================
//     const filteredOrders = orders.filter(o => {
//         const matchesStatus =
//             filter === "All" || o.status === filter;

//         const searchText = search.toLowerCase();

//         const buyer = (o.buyer_name || "").toLowerCase();
//         const party = (o.party_name || "").toLowerCase();
//         const product = (o.product_name || "").toLowerCase();
//         const orderId = String(o.order_id || "");

//         const matchesSearch =
//             buyer.includes(searchText) ||
//             party.includes(searchText) ||
//             product.includes(searchText) ||
//             orderId.includes(searchText);

//         return matchesStatus && matchesSearch;
//     });

//     const statusCount = {
//         All: orders.length,
//         placed: orders.filter(o => o.status === "placed").length,
//         confirmed: orders.filter(o => o.status === "confirmed").length,
//         shipped: orders.filter(o => o.status === "shipped").length,
//         delivered: orders.filter(o => o.status === "delivered").length,
//         cancelled: orders.filter(o => o.status === "cancelled").length,
//     };

//     // ===========================
//     // 🔄 UPDATE STATUS
//     // ===========================
//     const handleStatusChange = async (newStatus) => {
//         try {
//             const token = localStorage.getItem("adminToken");

//             await axios.patch(
//                 `http://localhost:3000/api/admin/order-status/${selectedOrder.order_id}`,
//                 { status: newStatus },
//                 { headers: { Authorization: `Bearer ${token}` } }
//             );

//             setOrders(prev =>
//                 prev.map(o =>
//                     o.order_id === selectedOrder.order_id
//                         ? { ...o, status: newStatus }
//                         : o
//                 )
//             );

//             setSelectedOrder(prev => ({ ...prev, status: newStatus }));
//         } catch (err) {
//             console.log("STATUS UPDATE ERROR:", err);
//         }
//     };

//     // ===========================
//     // 📄 PDF
//     // ===========================
//     const handlePrintInvoice = (order) => {
//         const doc = new jsPDF();

//         doc.setFontSize(16);
//         doc.text(`Invoice - Order #${order.order_id}`, 14, 20);

//         doc.setFontSize(12);
//         doc.text(`Buyer: ${order.buyer_name}`, 14, 30);
//         doc.text(`Type: ${order.order_type}`, 14, 38);
//         doc.text(`Party: ${order.party_name}`, 14, 46);
//         doc.text(`Product: ${order.product_name}`, 14, 54);
//         doc.text(`Qty: ${order.quantity}`, 14, 62);

//         autoTable(doc, {
//             startY: 70,
//             head: [["Field", "Value"]],
//             body: [
//                 ["Amount", `₹${order.amount}`],
//                 ["Status", order.status],
//                 ["Payment", order.payment_mode],
//             ]
//         });

//         doc.save(`order_${order.order_id}.pdf`);
//     };

//     // ===========================
//     // 📊 EXCEL
//     // ===========================
//     const handleExportToExcel = () => {
//         const wb = XLSX.utils.book_new();
//         const wsData = [
//             ["Order ID", "Buyer", "Type", "Party", "Product", "Qty", "Amount", "Status"],
//             ...orders.map(o => [
//                 o.order_id,
//                 o.buyer_name,
//                 o.order_type,
//                 o.party_name,
//                 o.product_name,
//                 o.quantity,
//                 o.amount,
//                 o.status
//             ])
//         ];

//         const ws = XLSX.utils.aoa_to_sheet(wsData);
//         XLSX.utils.book_append_sheet(wb, ws, "Orders");
//         XLSX.writeFile(wb, "Orders_Report.xlsx");
//     };

//     return (
//         <div className={styles.AdminOrdersContainer}>
//             <header className={styles.header}>
//                 <h2>Order Management</h2>
//             </header>

//             <div className={styles.controls}>
//                 <button className={styles.exportBtn} onClick={handleExportToExcel}>
//                     Export Orders
//                 </button>

//                 <input
//                     type="text"
//                     placeholder="Search buyer / seller / supplier / product..."
//                     value={search}
//                     onChange={(e) => setSearch(e.target.value)}
//                     className={styles.searchInput}
//                 />
//             </div>

//             <div className={styles.filters}>
//                 {Object.keys(statusCount).map(key => (
//                     <button
//                         key={key}
//                         className={`${styles.filterBtn} ${filter === key ? styles.activeFilter : ""}`}
//                         onClick={() => setFilter(key)}
//                     >
//                         {key} ({statusCount[key]})
//                     </button>
//                 ))}
//             </div>

//             <div className={styles.tableWrapper}>
//                 <table className={styles.table}>
//                     <thead>
//                         <tr>
//                             <th>Order ID</th>
//                             <th>Buyer</th>
//                             <th>Type</th>
//                             <th>Seller / Supplier</th>
//                             <th>Product</th>
//                             <th>Qty</th>
//                             <th>Amount</th>
//                             <th>Status</th>
//                             <th>Date</th>
//                             <th>Action</th>
//                         </tr>
//                     </thead>

//                     <tbody>
//                         {filteredOrders.map(o => (
//                             <tr key={o.order_id}>
//                                 <td>{o.order_id}</td>
//                                 <td>{o.buyer_name || "N/A"}</td>

//                                 <td>
//                                     <span
//                                         className={`${styles.typeBadge} ${o.order_type === "seller"
//                                             ? styles.seller
//                                             : styles.supplier
//                                             }`}
//                                     >
//                                         {o.order_type}
//                                     </span>
//                                 </td>

//                                 <td>{o.party_name || "N/A"}</td>
//                                 <td>{o.product_name}</td>
//                                 <td>{o.quantity}</td>
//                                 <td>₹{o.amount}</td>

//                                 <td>
//                                     <span className={`${styles.statusBadge} ${styles[o.status] || ""}`}>
//                                         {o.status}
//                                     </span>
//                                 </td>

//                                 <td>
//                                     {o.order_date
//                                         ? new Date(o.order_date).toLocaleDateString()
//                                         : "N/A"}
//                                 </td>

//                                 <td>
//                                     <button
//                                         className={styles.viewBtn}
//                                         onClick={() => setSelectedOrder(o)}
//                                     >
//                                         View
//                                     </button>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>

//                 {filteredOrders.length === 0 && (
//                     <div className={styles.noData}>No orders found</div>
//                 )}
//             </div>

//             {selectedOrder && (
//                 <div className={styles.modalOverlay}>
//                     <div className={styles.modal}>
//                         <div className={styles.modalHeader}>
//                             <h3>Order #{selectedOrder.order_id}</h3>
//                             <button
//                                 className={styles.closeBtn}
//                                 onClick={() => setSelectedOrder(null)}
//                             >
//                                 ✕
//                             </button>
//                         </div>

//                         <div className={styles.modalContent}>
//                             <p><b>Buyer:</b> {selectedOrder.buyer_name}</p>
//                             <p><b>Type:</b> {selectedOrder.order_type}</p>
//                             <p><b>Party:</b> {selectedOrder.party_name}</p>
//                             <p><b>Product:</b> {selectedOrder.product_name}</p>
//                             <p><b>Qty:</b> {selectedOrder.quantity}</p>
//                             <p><b>Amount:</b> ₹{selectedOrder.amount}</p>


//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default AdminOrders;


// import React, { useState, useEffect } from "react";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
// import * as XLSX from "xlsx";
// import axios from "axios";
// import styles from "./AdminOrders.module.css";

// const AdminOrders = () => {
//     const [orders, setOrders] = useState([]);
//     const [filter, setFilter] = useState("All");
//     const [search, setSearch] = useState("");
//     const [selectedOrder, setSelectedOrder] = useState(null);
    

//     // ===========================
//     // 🔥 FETCH ORDERS
//     // ===========================
//     useEffect(() => {
//         const fetchOrders = async () => {
//             try {
//                 const token = localStorage.getItem("adminToken");

//                 const res = await axios.get(
//                     "http://localhost:3000/api/admin/orders",
//                     { headers: { Authorization: `Bearer ${token}` } }
//                 );

//                 setOrders(res.data.orders || []);
//             } catch (err) {
//                 console.log("ORDER FETCH ERROR:", err);
//             }
//         };

//         fetchOrders();
//     }, []);

//     // ===========================
//     // 🔍 FILTER + SEARCH
//     // ===========================
//     const filteredOrders = orders.filter(o => {
//         const matchesStatus = filter === "All" || o.status === filter;

//         const searchText = search.toLowerCase();

//         const buyer = (o.buyer_name || "").toLowerCase();
//         const party = (o.party_name || "").toLowerCase();
//         const product = (o.product_name || "").toLowerCase();
//         const orderId = String(o.order_id || "");

//         const matchesSearch =
//             buyer.includes(searchText) ||
//             party.includes(searchText) ||
//             product.includes(searchText) ||
//             orderId.includes(searchText);

//         return matchesStatus && matchesSearch;
//     });

//     const statusCount = {
//         All: orders.length,
//         placed: orders.filter(o => o.status === "placed").length,
//         confirmed: orders.filter(o => o.status === "confirmed").length,
//         shipped: orders.filter(o => o.status === "shipped").length,
//         delivered: orders.filter(o => o.status === "delivered").length,
//         cancelled: orders.filter(o => o.status === "cancelled").length,
//     };

//     // ===========================
//     // 🔄 UPDATE STATUS
//     // ===========================
//     const handleStatusChange = async (newStatus) => {
//         try {
//             const token = localStorage.getItem("adminToken");

//             await axios.patch(
//                 `http://localhost:3000/api/admin/order-status/${selectedOrder.order_id}`,
//                 { status: newStatus },
//                 { headers: { Authorization: `Bearer ${token}` } }
//             );

//             setOrders(prev =>
//                 prev.map(o =>
//                     o.order_id === selectedOrder.order_id
//                         ? { ...o, status: newStatus }
//                         : o
//                 )
//             );

//             setSelectedOrder(prev => ({ ...prev, status: newStatus }));
//         } catch (err) {
//             console.log("STATUS UPDATE ERROR:", err);
//         }
//     };

//     // ===========================
//     // 📄 SINGLE ORDER PDF
//     // ===========================
//    const handlePrintInvoice = (order) => {
//     const doc = new jsPDF();

//     doc.setFont("times"); // Unicode-friendly font
//     doc.setFontSize(16);
//     doc.text(`Invoice - Order #${order.order_id}`, 14, 20);

//     doc.setFontSize(12);
//     doc.text(`Buyer: ${order.buyer_name}`, 14, 30);
//     doc.text(`Type: ${order.order_type}`, 14, 38);
//     doc.text(`Party: ${order.party_name}`, 14, 46);
//     doc.text(`Product: ${order.product_name}`, 14, 54);
//     doc.text(`Qty: ${order.quantity}`, 14, 62);

//     // Only number, formatted
//     const formattedAmount = Number(order.amount).toLocaleString("en-IN", {
//         minimumFractionDigits: 2
//     });

//     autoTable(doc, {
//         startY: 70,
//         head: [["Field", "Value"]],
//         body: [
//             ["Amount (₹)", formattedAmount], // ₹ in header, not value
//             ["Status", order.status],
//             ["Payment", order.payment_mode || "N/A"]
//         ],
//         styles: { fontSize: 12 },
//         headStyles: { fillColor: [22, 160, 133] }
//     });

//     doc.save(`order_${order.order_id}.pdf`);
// };


//     // ===========================
//     // 📄 ALL ORDERS PDF
//     // ===========================
//     const handleExportAllToPDF = () => {
//         const doc = new jsPDF();

//         doc.setFontSize(16);
//         doc.text("All Orders Report", 14, 20);

//         const tableColumn = ["Order ID", "Buyer", "Type", "Party", "Product", "Qty", "Amount", "Status", "Date"];
//         const tableRows = [];

//         orders.forEach(order => {

//             const formattedAmount = Number(order.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 });
//             const orderData = [
//                 order.order_id,
//                 order.buyer_name || "N/A",
//                 order.order_type,
//                 order.party_name || "N/A",
//                 order.product_name,
//                 order.quantity,
//                 formattedAmount,
//                 order.status,
//                 order.order_date ? new Date(order.order_date).toLocaleDateString() : "N/A"
//             ];
//             tableRows.push(orderData);
//         });

//         autoTable(doc, {
//             startY: 30,
//             head: [tableColumn],
//             body: tableRows,
//             styles: { fontSize: 10 },
//             headStyles: { fillColor: [22, 160, 133] }
//         });

//         doc.save("All_Orders_Report.pdf");
//     };

//     // ===========================
//     // 📊 EXCEL
//     // ===========================
//     const handleExportToExcel = () => {
//         const wb = XLSX.utils.book_new();
//         const wsData = [
//             ["Order ID", "Buyer", "Type", "Party", "Product", "Qty", "Amount", "Status"],
//             ...orders.map(o => [
//                 o.order_id,
//                 o.buyer_name,
//                 o.order_type,
//                 o.party_name,
//                 o.product_name,
//                 o.quantity,
//                 o.amount,
//                 o.status
//             ])
//         ];

//         const ws = XLSX.utils.aoa_to_sheet(wsData);
//         XLSX.utils.book_append_sheet(wb, ws, "Orders");
//         XLSX.writeFile(wb, "Orders_Report.xlsx");
//     };

//     return (
//         <div className={styles.AdminOrdersContainer}>
//             <header className={styles.header}>
//                 <h2>Order Management</h2>
//             </header>

//             <div className={styles.controls}>
//                 <button className={styles.exportBtn} onClick={handleExportToExcel}>
//                     Export Excel
//                 </button>

//                 <button className={styles.exportBtn} onClick={handleExportAllToPDF}>
//                     Export PDF
//                 </button>

//                 <input
//                     type="text"
//                     placeholder="Search buyer / seller / supplier / product..."
//                     value={search}
//                     onChange={(e) => setSearch(e.target.value)}
//                     className={styles.searchInput}
//                 />
//             </div>

//             <div className={styles.filters}>
//                 {Object.keys(statusCount).map(key => (
//                     <button
//                         key={key}
//                         className={`${styles.filterBtn} ${filter === key ? styles.activeFilter : ""}`}
//                         onClick={() => setFilter(key)}
//                     >
//                         {key} ({statusCount[key]})
//                     </button>
//                 ))}
//             </div>

//             <div className={styles.tableWrapper}>
//                 <table className={styles.table}>
//                     <thead>
//                         <tr>
//                             <th>Order ID</th>
//                             <th>Buyer</th>
//                             <th>Type</th>
//                             <th>Seller / Supplier</th>
//                             <th>Product</th>
//                             <th>Qty</th>
//                             <th>Amount (INR)</th>
//                             <th>Status</th>
//                             <th>Date</th>
//                             <th>Action</th>
//                         </tr>
//                     </thead>

//                     <tbody>
//                         {filteredOrders.map(o => (
//                             <tr key={o.order_id}>
//                                 <td>{o.order_id}</td>
//                                 <td>{o.buyer_name || "N/A"}</td>

//                                 <td>
//                                     <span
//                                         className={`${styles.typeBadge} ${o.order_type === "seller"
//                                             ? styles.seller
//                                             : styles.supplier
//                                             }`}
//                                     >
//                                         {o.order_type}
//                                     </span>
//                                 </td>

//                                 <td>{o.party_name || "N/A"}</td>
//                                 <td>{o.product_name}</td>
//                                 <td>{o.quantity}</td>
//                                 <td>₹{o.amount}</td>

//                                 <td>
//                                     <span className={`${styles.statusBadge} ${styles[o.status] || ""}`}>
//                                         {o.status}
//                                     </span>
//                                 </td>

//                                 <td>
//                                     {o.order_date
//                                         ? new Date(o.order_date).toLocaleDateString()
//                                         : "N/A"}
//                                 </td>

//                                 <td>
//                                     <div className={styles.actionButtons}>
//                                     <button
//                                         className={styles.viewBtn}
//                                         onClick={() => setSelectedOrder(o)}
//                                     >
//                                         View
//                                     </button>
//                                     <button
//                                         className={styles.viewBtn}
//                                         onClick={() => handlePrintInvoice(o)}
//                                     >
//                                         PDF
//                                     </button>
//                                     </div>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>

//                 {filteredOrders.length === 0 && (
//                     <div className={styles.noData}>No orders found</div>
//                 )}
//             </div>

//             {selectedOrder && (
//                 <div className={styles.modalOverlay}>
//                     <div className={styles.modal}>
//                         <div className={styles.modalHeader}>
//                             <h3>Order #{selectedOrder.order_id}</h3>
//                             <button
//                                 className={styles.closeBtn}
//                                 onClick={() => setSelectedOrder(null)}
//                             >
//                                 ✕
//                             </button>
//                         </div>

//                         <div className={styles.modalContent}>
//                             <p><b>Buyer:</b> {selectedOrder.buyer_name}</p>
//                             <p><b>Type:</b> {selectedOrder.order_type}</p>
//                             <p><b>Party:</b> {selectedOrder.party_name}</p>
//                             <p><b>Product:</b> {selectedOrder.product_name}</p>
//                             <p><b>Qty:</b> {selectedOrder.quantity}</p>
//                             <p><b>Amount:</b> ₹{selectedOrder.amount}</p>

//                             <div className={styles.modalActions}>
//                                 <button onClick={() => handlePrintInvoice(selectedOrder)}>
//                                     Download PDF
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default AdminOrders;


import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import axios from "axios";
import styles from "./AdminOrders.module.css";

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [filter, setFilter] = useState("All");
    const [search, setSearch] = useState("");
    const [selectedOrder, setSelectedOrder] = useState(null);

    /* ================= PAGINATION STATE ================= */
    const [currentPage, setCurrentPage] = useState(1);
    const ORDERS_PER_PAGE = 5;

    /* ================= FETCH ORDERS ================= */
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem("adminToken");

                const res = await axios.get(
                    "http://localhost:3000/api/admin/orders",
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                // 🔥 latest order first
                const sortedOrders = (res.data.orders || []).sort(
                    (a, b) => new Date(b.order_date) - new Date(a.order_date)
                );

                setOrders(sortedOrders);
            } catch (err) {
                console.log("ORDER FETCH ERROR:", err);
            }
        };

        fetchOrders();
    }, []);

/* ================= FILTER + PRIORITY SEARCH ================= */

    const searchText = search.toLowerCase();

    const filteredOrders = orders
        .filter(o => {
            const matchesStatus = filter === "All" || o.status === filter;
            return matchesStatus;
        })
        .sort((a, b) => {

            if (!searchText) {
                return new Date(b.order_date) - new Date(a.order_date);
            }

            const aMatch =
                (a.buyer_name || "").toLowerCase().includes(searchText) ||
                (a.party_name || "").toLowerCase().includes(searchText) ||
                (a.product_name || "").toLowerCase().includes(searchText) ||
                String(a.order_id).includes(searchText);

            const bMatch =
                (b.buyer_name || "").toLowerCase().includes(searchText) ||
                (b.party_name || "").toLowerCase().includes(searchText) ||
                (b.product_name || "").toLowerCase().includes(searchText) ||
                String(b.order_id).includes(searchText);

            if (aMatch && !bMatch) return -1;
            if (!aMatch && bMatch) return 1;

            return new Date(b.order_date) - new Date(a.order_date);
        });

    /* 🔥 Reset page when filter/search changes */
    useEffect(() => {
        setCurrentPage(1);
    }, [filter, search]);


    /* ================= PAGINATION LOGIC ================= */
    const totalPages = Math.ceil(filteredOrders.length / ORDERS_PER_PAGE);

    const indexOfLastOrder = currentPage * ORDERS_PER_PAGE;
    const indexOfFirstOrder = indexOfLastOrder - ORDERS_PER_PAGE;

    const currentOrders = filteredOrders.slice(
        indexOfFirstOrder,
        indexOfLastOrder
    );

    /* ================= STATUS COUNT ================= */
    const statusCount = {
        All: orders.length,
        placed: orders.filter(o => o.status === "placed").length,
        confirmed: orders.filter(o => o.status === "confirmed").length,
        shipped: orders.filter(o => o.status === "shipped").length,
        delivered: orders.filter(o => o.status === "delivered").length,
        cancelled: orders.filter(o => o.status === "cancelled").length,
    };

    /* ================= UPDATE STATUS ================= */
    const handleStatusChange = async (newStatus) => {
        try {
            const token = localStorage.getItem("adminToken");

            await axios.patch(
                `http://localhost:3000/api/admin/order-status/${selectedOrder.order_id}`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setOrders(prev =>
                prev.map(o =>
                    o.order_id === selectedOrder.order_id
                        ? { ...o, status: newStatus }
                        : o
                )
            );

            setSelectedOrder(prev => ({ ...prev, status: newStatus }));
        } catch (err) {
            console.log("STATUS UPDATE ERROR:", err);
        }
    };

    /* ================= SINGLE ORDER PDF ================= */
    const handlePrintInvoice = (order) => {
        const doc = new jsPDF();

        doc.setFontSize(16);
        doc.text(`Invoice - Order #${order.order_id}`, 14, 20);

        doc.setFontSize(12);
        doc.text(`Buyer: ${order.buyer_name}`, 14, 30);
        doc.text(`Type: ${order.order_type}`, 14, 38);
        doc.text(`Party: ${order.party_name}`, 14, 46);
        doc.text(`Product: ${order.product_name}`, 14, 54);
        doc.text(`Qty: ${order.quantity}`, 14, 62);

        const formattedAmount = Number(order.amount).toLocaleString("en-IN", {
            minimumFractionDigits: 2
        });

        autoTable(doc, {
            startY: 70,
            head: [["Field", "Value"]],
            body: [
                ["Amount (₹)", formattedAmount],
                ["Status", order.status],
                ["Payment", order.payment_mode || "N/A"]
            ]
        });

        doc.save(`order_${order.order_id}.pdf`);
    };

    /* ================= ALL ORDERS PDF ================= */
    const handleExportAllToPDF = () => {
        const doc = new jsPDF();

        doc.text("All Orders Report", 14, 20);

        const tableColumn = ["Order ID", "Buyer", "Type", "Party", "Product", "Qty", "Amount", "Status", "Date"];
        const tableRows = [];

        orders.forEach(order => {
            tableRows.push([
                order.order_id,
                order.buyer_name,
                order.order_type,
                order.party_name,
                order.product_name,
                order.quantity,
                order.amount,
                order.status,
                order.order_date
                    ? new Date(order.order_date).toLocaleDateString()
                    : "N/A"
            ]);
        });

        autoTable(doc, {
            startY: 30,
            head: [tableColumn],
            body: tableRows
        });

        doc.save("All_Orders_Report.pdf");
    };

    /* ================= EXCEL ================= */
    const handleExportToExcel = () => {
        const wb = XLSX.utils.book_new();
        const wsData = [
            ["Order ID", "Buyer", "Type", "Party", "Product", "Qty", "Amount", "Status"],
            ...orders.map(o => [
                o.order_id,
                o.buyer_name,
                o.order_type,
                o.party_name,
                o.product_name,
                o.quantity,
                o.amount,
                o.status
            ])
        ];

        const ws = XLSX.utils.aoa_to_sheet(wsData);
        XLSX.utils.book_append_sheet(wb, ws, "Orders");
        XLSX.writeFile(wb, "Orders_Report.xlsx");
    };

    return (
        <div className={styles.AdminOrdersContainer}>
            <header className={styles.header}>
                <h2>Order Management</h2> 
            </header>
            {/* CONTROLS */}
            <div className={styles.controls}>
                <button className={styles.exportBtn} onClick={handleExportToExcel}>
                    Export Excel
                </button>

                <button className={styles.exportBtnPdf} onClick={handleExportAllToPDF}>
                    Export PDF
                </button>

                <input
                    type="text"
                    placeholder="Search buyer / seller / supplier / product..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className={styles.searchInput}
                />
            </div>
            {/* FILTERS */}
            <div className={styles.filters}>
                {Object.keys(statusCount).map(key => (
                    <button
                        key={key}
                        className={`${styles.filterBtn} ${filter === key ? styles.activeFilter : ""}`}
                        onClick={() => setFilter(key)}
                    >
                        {key} ({statusCount[key]})
                    </button>
                ))}
            </div> 
            
             {/* TABLE */}

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Buyer</th>
                            <th>Type</th>
                            <th>Seller / Supplier</th>
                            <th>Product</th>
                            <th>Qty</th>
                            <th>Amount (INR)</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {currentOrders.map((o, index) => (
                            <tr key={`${o.order_id}-${index}`}>
                                <td>{o.order_id}</td>
                                <td>{o.buyer_name || "N/A"}</td>
                                <td ><span
                                        className={`${styles.typeBadge} ${o.order_type === "seller"
                                            ? styles.seller
                                        : styles.supplier }`}
                                    >
                                        {o.order_type}
                                    </span></td>
                                <td>{o.party_name || "N/A"}</td>
                                <td>{o.product_name}</td>
                                <td>{o.quantity}</td>
                                <td>₹{o.amount}</td>
                                <td><span className={`${styles.statusBadge} ${styles[o.status] || ""}`}>
                                        {o.status}
                                </span></td>
                                <td>
                                    {o.order_date
                                        ? new Date(o.order_date).toLocaleDateString()
                                        : "N/A"}
                                </td>
                                <div className={styles.actionButtons}>
                                <td>
                                    <button className={styles.viewBtn} onClick={() => setSelectedOrder(o)}>
                                        View
                                    </button>
                                    <button className={styles.viewBtnPdf} onClick={() => handlePrintInvoice(o)}>
                                        PDF
                                    </button>
                                </td>
                                </div>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredOrders.length === 0 && (
                    <div className={styles.noData}>No orders found</div>
                )}
            </div>

            {/* ================= PAGINATION ================= */}
            {totalPages > 1 && (
                <div className={styles.pagination}>
                    <button className={styles.viewBtnPrev}
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => prev - 1)}
                    >
                        Prev
                    </button>

                    <span className={styles.pageInfo}>
                        Page {currentPage} of {totalPages}
                    </span>

                    <button
                        className={styles.viewBtnNext}
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(prev => prev + 1)}
                    >
                        Next
                    </button>
                </div> 
            )}
            {selectedOrder && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <p><b>Buyer:</b> {selectedOrder.buyer_name}</p>
                        <p><b>Type:</b> {selectedOrder.order_type}</p>
                        <p><b>Party:</b> {selectedOrder.party_name}</p>
                        <p><b>Product:</b> {selectedOrder.product_name}</p>
                        <p><b>Qty:</b> {selectedOrder.quantity}</p> 
                        <p><b>Amount:</b> ₹{selectedOrder.amount}</p>
                        <button onClick={() => setSelectedOrder(null)}>Close</button>
                    </div>
                </div>
            )}
            
        </div>
        
    );
};

export default AdminOrders;
