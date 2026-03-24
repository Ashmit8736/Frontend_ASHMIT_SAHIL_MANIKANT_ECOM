// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import styles from "./AdminSuppliers.module.css";

// export default function AdminSuppliers() {
//     const [suppliers, setSuppliers] = useState([]);
//     const [filtered, setFiltered] = useState([]);
//     const [search, setSearch] = useState("");

//     const [statusCount, setStatusCount] = useState({
//         approved: 0,
//         rejected: 0,
//         pending: 0,
//     });

//     const [selectedSupplier, setSelectedSupplier] = useState(null);
//     const [modalOpen, setModalOpen] = useState(false);

//     // Pagination state
//     const [currentPage, setCurrentPage] = useState(1);
//     const itemsPerPage = 10;

//     const token = localStorage.getItem("adminToken");

//     // Fetch all suppliers
//     const fetchSuppliers = async () => {
//         try {
//             const { data } = await axios.get(
//                 "http://localhost:3000/api/admin/all-suppliers",
//                 { headers: { Authorization: `Bearer ${token}` } }
//             );

//             setSuppliers(data.suppliers);
//             setFiltered(data.suppliers);
//         } catch (err) {
//             console.error("Error fetching suppliers:", err);
//         }
//     };

//     // Status count
//     const fetchSupplierStatusCount = async () => {
//         const { data } = await axios.get(
//             "http://localhost:3000/api/admin/suppliers/status-count",
//             { headers: { Authorization: `Bearer ${token}` } }
//         );
//         setStatusCount(data);
//     };

//     useEffect(() => {
//         fetchSuppliers();
//         fetchSupplierStatusCount();
//     }, []);

//     // Search filter
//     useEffect(() => {
//         const results = suppliers.filter((s) =>
//             (s.fullname || "").toLowerCase().includes(search.toLowerCase())
//         );
//         setFiltered(results);
//         setCurrentPage(1); // Reset page on search
//     }, [search, suppliers]);

//     const approveSupplier = async (id) => {
//         await axios.patch(
//             `http://localhost:3000/api/admin/approveSupplier/${id}`,
//             {},
//             { headers: { Authorization: `Bearer ${token}` } }
//         );

//         fetchSuppliers();
//         fetchSupplierStatusCount();
//         setModalOpen(false);
//     };

//     const rejectSupplier = async (id) => {
//         await axios.patch(
//             `http://localhost:3000/api/admin/rejectSupplier/${id}`,
//             {},
//             { headers: { Authorization: `Bearer ${token}` } }
//         );

//         fetchSuppliers();
//         fetchSupplierStatusCount();
//         setModalOpen(false);
//     };

//     // PAGINATION LOGIC -------------------------------
//     const indexOfLast = currentPage * itemsPerPage;
//     const indexOfFirst = indexOfLast - itemsPerPage;

//     const currentSuppliers = filtered.slice(indexOfFirst, indexOfLast);

//     const totalPages = Math.ceil(filtered.length / itemsPerPage);

//     const changePage = (num) => setCurrentPage(num);
//     // ------------------------------------------------

//     return (
//         <div className={styles.container}>
//             {/* HEADER */}
//             <div className={styles.heading}>
//                 <h2>Supplier Verification</h2>
//                 <p>Review and approve registered suppliers.</p>
//             </div>

//             {/* SUMMARY CARDS */}
//             <div className={styles.summaryWrapper}>
//                 <div className={`${styles.summaryCard} ${styles.pendingCard}`}>
//                     <p className={styles.summaryTitle}>Pending Suppliers</p>
//                     <p className={styles.summarySubtitle}>Awaiting approval</p>
//                     <p className={styles.summaryValue}>{statusCount.pending}</p>
//                 </div>

//                 <div className={`${styles.summaryCard} ${styles.approvedCard}`}>
//                     <p className={styles.summaryTitle}>Approved Suppliers</p>
//                     <p className={styles.summarySubtitle}>Verified suppliers</p>
//                     <p className={styles.summaryValue}>{statusCount.approved}</p>
//                 </div>

//                 <div className={`${styles.summaryCard} ${styles.rejectedCard}`}>
//                     <p className={styles.summaryTitle}>Rejected Suppliers</p>
//                     <p className={styles.summarySubtitle}>Declined profiles</p>
//                     <p className={styles.summaryValue}>{statusCount.rejected}</p>
//                 </div>
//             </div>

//             {/* SEARCH INPUT */}
//             <div className={styles.controls}>
//                 <input
//                     type="text"
//                     className={styles.searchInput}
//                     placeholder="Search suppliers..."
//                     value={search}
//                     onChange={(e) => setSearch(e.target.value)}
//                 />
//             </div>

//             {/* TABLE */}
//             <div className={styles.tableWrapper}>
//                 <table className={styles.table}>
//                     <thead>
//                         <tr>
//                             <th>ID</th>
//                             <th>Name</th>
//                             <th>Company</th>
//                             <th>Email</th>
//                             <th>Status</th>
//                             <th>Joined</th>
//                             <th>Action</th>
//                         </tr>
//                     </thead>

//                     <tbody>
//                         {currentSuppliers.length === 0 ? (
//                             <tr>
//                                 <td colSpan="6" className={styles.noData}>
//                                     No suppliers found
//                                 </td>
//                             </tr>
//                         ) : (
//                             currentSuppliers.map((sup) => (
//                                 <tr key={sup.id}>
//                                     <td>{sup.id}</td>
//                                     <td>{sup.fullname}</td>
//                                     <td>{sup.company_name}</td>
//                                     <td>{sup.email}</td>
//                                     <td>
//                                         <span
//                                             className={
//                                                 sup.approval_status === "approved"
//                                                     ? styles.approved
//                                                     : sup.approval_status === "rejected"
//                                                         ? styles.rejected
//                                                         : styles.pending
//                                             }
//                                         >
//                                             {sup.approval_status}
//                                         </span>
//                                     </td>
//                                     <td>{sup.created_at?.slice(0, 10)}</td>
//                                     <td>
//                                         <button
//                                             className={styles.viewBtn}
//                                             onClick={() => {
//                                                 setSelectedSupplier(sup);
//                                                 setModalOpen(true);
//                                             }}
//                                         >
//                                             Review
//                                         </button>
//                                     </td>
//                                 </tr>
//                             ))
//                         )}
//                     </tbody>
//                 </table>
//             </div>

//             {/* PAGINATION UI */}
//             <div className={styles.pagination}>
//                 <button className={styles.BtnPrev} 
//                     disabled={currentPage === 1}
//                     onClick={() => changePage(currentPage - 1)}
//                 >
//                     Prev
//                 </button>

//                 {[...Array(totalPages).keys()].map((num) => (
//                     <button
//                         key={num}
//                         className={currentPage === num + 1 ? styles.activePage : ""}
//                         onClick={() => changePage(num + 1)}
//                     >
//                         {num + 1}
//                     </button>
//                 ))}

//                 <button className={styles.BtnNext}
//                     disabled={currentPage === totalPages}
//                     onClick={() => changePage(currentPage + 1)}
//                 >
//                     Next
//                 </button>
//             </div>

//             {/* MODAL */}
//             {modalOpen && selectedSupplier && (
//                 <div className={styles.modalOverlay}>
//                     <div className={styles.modal}>
//                         <h3>Supplier Details</h3>

//                         <div className={styles.modalContent}>
//                             <p><strong>Name:</strong> {selectedSupplier.fullname}</p>
//                             <p><strong>Company:</strong> {selectedSupplier.company_name}</p>
//                             <p><strong>Email:</strong> {selectedSupplier.email}</p>
//                             <p><strong>Phone:</strong> {selectedSupplier.phone}</p>
//                             <p><strong>Status:</strong> {selectedSupplier.approval_status}</p>
//                         </div>

//                         <div className={styles.modalActions}>
//                             <button
//                                 className={styles.approveBtn}
//                                 onClick={() => approveSupplier(selectedSupplier.id)}
//                             >
//                                 Approve
//                             </button>

//                             <button
//                                 className={styles.rejectBtn}
//                                 onClick={() => rejectSupplier(selectedSupplier.id)}
//                             >
//                                 Reject
//                             </button>

//                             <button
//                                 className={styles.closeBtn}
//                                 onClick={() => setModalOpen(false)}
//                             >
//                                 Close
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }

import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./AdminSuppliers.module.css";

export default function AdminSuppliers() {
    const [suppliers, setSuppliers] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [search, setSearch] = useState("");

    const [statusCount, setStatusCount] = useState({
        approved: 0,
        rejected: 0,
        pending: 0,
    });

    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;

    const token = localStorage.getItem("adminToken");

    // Fetch suppliers
    const fetchSuppliers = async () => {
        const { data } = await axios.get(
            "http://localhost:3000/api/admin/all-suppliers",
            { headers: { Authorization: `Bearer ${token}` } }
        );

        setSuppliers(data.suppliers);
        setFiltered(data.suppliers);
    };

    // Status counts
    const fetchSupplierStatusCount = async () => {
        const { data } = await axios.get(
            "http://localhost:3000/api/admin/suppliers/status-count",
            { headers: { Authorization: `Bearer ${token}` } }
        );
        setStatusCount(data);
    };

    useEffect(() => {
        fetchSuppliers();
        fetchSupplierStatusCount();
    }, []);

    // Search
    useEffect(() => {
        const results = suppliers.filter((s) =>
            (s.fullname || "").toLowerCase().includes(search.toLowerCase())
        );
        setFiltered(results);
        setCurrentPage(1);
    }, [search, suppliers]);

    const approveSupplier = async (id) => {
        await axios.patch(
            `http://localhost:3000/api/admin/approveSupplier/${id}`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
        );
        fetchSuppliers();
        fetchSupplierStatusCount();
        setModalOpen(false);
    };

    const rejectSupplier = async (id) => {
        await axios.patch(
            `http://localhost:3000/api/admin/rejectSupplier/${id}`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
        );
        fetchSuppliers();
        fetchSupplierStatusCount();
        setModalOpen(false);
    };

    // ===============================
    // PAGINATION LOGIC
    // ===============================
    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentSuppliers = filtered.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    // ===============================

    return (
        <div className={styles.container}>
            {/* HEADER */}
            <div className={styles.heading}>
                <h2>Supplier Verification</h2>
                <p>Review and approve registered suppliers.</p>
            </div>

            {/* SUMMARY */}
            <div className={styles.summaryWrapper}>
                <div className={`${styles.summaryCard} ${styles.pendingCard}`}>
                    <p className={styles.summaryTitle}>Pending Suppliers</p>
                    <p className={styles.summarySubtitle}>Awaiting approval</p>
                    <p className={styles.summaryValue}>{statusCount.pending}</p>
                </div>

                <div className={`${styles.summaryCard} ${styles.approvedCard}`}>
                    <p className={styles.summaryTitle}>Approved Suppliers</p>
                    <p className={styles.summarySubtitle}>Verified suppliers</p>
                    <p className={styles.summaryValue}>{statusCount.approved}</p>
                </div>

                <div className={`${styles.summaryCard} ${styles.rejectedCard}`}>
                    <p className={styles.summaryTitle}>Rejected Suppliers</p>
                    <p className={styles.summarySubtitle}>Declined profiles</p>
                    <p className={styles.summaryValue}>{statusCount.rejected}</p>
                </div>
            </div>

            {/* SEARCH */}
            <div className={styles.controls}>
                <input
                    type="text"
                    className={styles.searchInput}
                    placeholder="Search suppliers..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* TABLE */}
            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Company</th>
                            <th>Email</th>
                            <th>Status</th>
                            <th>Joined</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {currentSuppliers.length === 0 ? (
                            <tr>
                                <td colSpan="7" className={styles.noData}>
                                    No suppliers found
                                </td>
                            </tr>
                        ) : (
                            currentSuppliers.map((sup) => (
                                <tr key={sup.id}>
                                    <td>{sup.id}</td>
                                    <td>{sup.fullname}</td>
                                    <td>{sup.company_name}</td>
                                    <td>{sup.email}</td>
                                    <td>
                                        <span
                                            className={
                                                sup.approval_status === "approved"
                                                    ? styles.approved
                                                    : sup.approval_status === "rejected"
                                                    ? styles.rejected
                                                    : styles.pending
                                            }
                                        >
                                            {sup.approval_status}
                                        </span>
                                    </td>
                                    <td>{sup.created_at?.slice(0, 10)}</td>
                                    <td>
                                        <button
                                            className={styles.viewBtn}
                                            onClick={() => {
                                                setSelectedSupplier(sup);
                                                setModalOpen(true);
                                            }}
                                        >
                                            Review
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
                <div className={styles.pagination}>
                    <button
                        className={styles.BtnPrev}
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(currentPage - 1)}
                    >
                        Prev
                    </button>

                    <span className={styles.pageInfo}>
                        Page {currentPage} of {totalPages}
                    </span>

                    <button
                        className={styles.BtnNext}
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(currentPage + 1)}
                    >
                        Next
                    </button>
                </div>
            )}

            {/* MODAL */}
            {modalOpen && selectedSupplier && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h3>Supplier Details</h3>

                        <div className={styles.modalContent}>
                            <p><strong>Name:</strong> {selectedSupplier.fullname}</p>
                            <p><strong>Company:</strong> {selectedSupplier.company_name}</p>
                            <p><strong>Email:</strong> {selectedSupplier.email}</p>
                            <p><strong>Phone:</strong> {selectedSupplier.phone}</p>
                            <p><strong>Status:</strong> {selectedSupplier.approval_status}</p>
                        </div>

                        <div className={styles.modalActions}>
                            <button
                                className={styles.approveBtn}
                                onClick={() => approveSupplier(selectedSupplier.id)}
                            >
                                Approve
                            </button>

                            <button
                                className={styles.rejectBtn}
                                onClick={() => rejectSupplier(selectedSupplier.id)}
                            >
                                Reject
                            </button>

                            <button
                                className={styles.closeBtn}
                                onClick={() => setModalOpen(false)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

