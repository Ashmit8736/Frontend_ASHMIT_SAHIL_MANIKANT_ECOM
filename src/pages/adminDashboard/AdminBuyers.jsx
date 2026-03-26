// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import styles from "./AdminBuyers.module.css";

// export default function AdminBuyers() {
//     const [buyers, setBuyers] = useState([]);
//     const [statusCount, setStatusCount] = useState({
//         approved: 0,
//         rejected: 0,
//         pending: 0,
//     });

//     const [selectedBuyer, setSelectedBuyer] = useState(null);
//     const [modalOpen, setModalOpen] = useState(false);

//     const token = localStorage.getItem("adminToken");

//     // Fetch Buyers
//     const fetchBuyers = async () => {
//         const { data } = await axios.get("http://localhost:3000/api/admin/all-buyers", {
//             headers: { Authorization: `Bearer ${token}` },
//         });
//         setBuyers(data.buyers);

//         // Calculate counts here directly
//         const pending = data.buyers.filter(b => b.approval_status === "pending").length;
//         const approved = data.buyers.filter(b => b.approval_status === "approved").length;
//         const rejected = data.buyers.filter(b => b.approval_status === "rejected").length;

//         setStatusCount({ pending, approved, rejected });
//     };

//     useEffect(() => {
//         fetchBuyers();
//     }, []);

//     const handleApprove = async (id) => {
//         await axios.patch(
//             `http://localhost:3000/api/admin/approveBuyer/${id}`,
//             {},
//             { headers: { Authorization: `Bearer ${token}` } }
//         );
//         fetchBuyers();
//         setModalOpen(false);
//     };

//     const handleReject = async (id) => {
//         await axios.patch(
//             `http://localhost:3000/api/admin/rejectBuyer/${id}`,
//             {},
//             { headers: { Authorization: `Bearer ${token}` } }
//         );
//         fetchBuyers();
//         setModalOpen(false);
//     };

//     return (
//         <div className={styles.container}>
//             <div className={styles.heading}>
//                 <h2>Buyer Verification</h2>
//                 <p>Review and approve platform buyers</p>
//             </div>

//             {/* Summary Cards */}
//             <div className={styles.summaryWrapper}>

//                 <div className={`${styles.summaryCard} ${styles.pendingCard}`}>
//                     <p className={styles.summaryTitle}>Pending Buyers</p>
//                     <p className={styles.summarySubtitle}>Awaiting approval</p>
//                     <p className={styles.summaryValue}>{statusCount.pending}</p>
//                 </div>

//                 <div className={`${styles.summaryCard} ${styles.approvedCard}`}>
//                     <p className={styles.summaryTitle}>Approved Buyers</p>
//                     <p className={styles.summarySubtitle}>Verified users</p>
//                     <p className={styles.summaryValue}>{statusCount.approved}</p>
//                 </div>

//                 <div className={`${styles.summaryCard} ${styles.rejectedCard}`}>
//                     <p className={styles.summaryTitle}>Rejected Buyers</p>
//                     <p className={styles.summarySubtitle}>Declined profiles</p>
//                     <p className={styles.summaryValue}>{statusCount.rejected}</p>
//                 </div>

//             </div>


//             {/* Table */}
//             <div className={styles.tableWrapper}>
//                 <table className={styles.table}>
//                     <thead>
//                         <tr>
//                             <th>Name</th>
//                             <th>Email</th>
//                             <th>Status</th>
//                             <th>Phone</th>
//                             <th>Joined</th>
//                             <th>Action</th>
//                         </tr>
//                     </thead>

//                     <tbody>
//                         {buyers.map((buyer) => (
//                             <tr key={buyer.id}>
//                                 <td>{buyer.username}</td>
//                                 <td>{buyer.email}</td>
//                                 <td>
//                                     <span
//                                         className={
//                                             buyer.approval_status === "approved"
//                                                 ? styles.approved
//                                                 : buyer.approval_status === "rejected"
//                                                     ? styles.rejected
//                                                     : styles.pending
//                                         }
//                                     >
//                                         {buyer.approval_status}
//                                     </span>
//                                 </td>
//                                 <td>{buyer.phone}</td>
//                                 <td>{buyer.created_at?.slice(0, 10)}</td>
//                                 <td>
//                                     <button
//                                         className={styles.viewBtn}
//                                         onClick={() => {
//                                             setSelectedBuyer(buyer);
//                                             setModalOpen(true);
//                                         }}
//                                     >
//                                         Review
//                                     </button>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>

//             {/* Modal */}
//             {modalOpen && selectedBuyer && (
//                 <div className={styles.modalOverlay}>
//                     <div className={styles.modal}>
//                         <h3>Review Buyer</h3>

//                         <div className={styles.modalContent}>
//                             <p><strong>Name:</strong> {selectedBuyer.username}</p>
//                             <p><strong>Email:</strong> {selectedBuyer.email}</p>
//                             <p><strong>Phone:</strong> {selectedBuyer.phone}</p>
//                         </div>

//                         <div className={styles.modalActions}>
//                             <button
//                                 className={styles.approveBtn}
//                                 onClick={() => handleApprove(selectedBuyer.id)}
//                             >
//                                 Approve
//                             </button>

//                             <button
//                                 className={styles.rejectBtn}
//                                 onClick={() => handleReject(selectedBuyer.id)}
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
import styles from "./AdminBuyers.module.css";

export default function AdminBuyers() {
    const [buyers, setBuyers] = useState([]);
    const [statusCount, setStatusCount] = useState({
        approved: 0,
        rejected: 0,
        pending: 0,
    });

    const [selectedBuyer, setSelectedBuyer] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;

    const token = localStorage.getItem("adminToken");

    // Fetch Buyers
    const fetchBuyers = async () => {
        const { data } = await axios.get(
            "http://localhost:3000/api/admin/all-buyers",
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );

        setBuyers(data.buyers);

        const pending = data.buyers.filter(
            (b) => b.approval_status === "pending"
        ).length;
        const approved = data.buyers.filter(
            (b) => b.approval_status === "approved"
        ).length;
        const rejected = data.buyers.filter(
            (b) => b.approval_status === "rejected"
        ).length;

        setStatusCount({ pending, approved, rejected });
    };

    useEffect(() => {
        fetchBuyers();
    }, []);

    // Approve Buyer
    const handleApprove = async (id) => {
        await axios.patch(
            `http://localhost:3000/api/admin/approveBuyer/${id}`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
        );
        fetchBuyers();
        setModalOpen(false);
    };

    // Reject Buyer
    const handleReject = async (id) => {
        await axios.patch(
            `http://localhost:3000/api/admin/rejectBuyer/${id}`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
        );
        fetchBuyers();
        setModalOpen(false);
    };

    // ==============================
    // PAGINATION LOGIC
    // ==============================
    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentBuyers = buyers.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(buyers.length / itemsPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [buyers]);
    // ==============================

    return (
        <div className={styles.container}>
            <div className={styles.heading}>
                <h2>Buyer Verification</h2>
                <p>Review and approve platform buyers</p>
            </div>

            {/* Summary Cards */}
            <div className={styles.summaryWrapper}>
                <div className={`${styles.summaryCard} ${styles.pendingCard}`}>
                    <p className={styles.summaryTitle}>Pending Buyers</p>
                    <p className={styles.summarySubtitle}>Awaiting approval</p>
                    <p className={styles.summaryValue}>{statusCount.pending}</p>
                </div>

                <div className={`${styles.summaryCard} ${styles.approvedCard}`}>
                    <p className={styles.summaryTitle}>Approved Buyers</p>
                    <p className={styles.summarySubtitle}>Verified users</p>
                    <p className={styles.summaryValue}>{statusCount.approved}</p>
                </div>

                <div className={`${styles.summaryCard} ${styles.rejectedCard}`}>
                    <p className={styles.summaryTitle}>Rejected Buyers</p>
                    <p className={styles.summarySubtitle}>Declined profiles</p>
                    <p className={styles.summaryValue}>{statusCount.rejected}</p>
                </div>
            </div>

            {/* Table */}
            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Status</th>
                            <th>Phone</th>
                            <th>Joined</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {currentBuyers.map((buyer) => (
                            <tr key={buyer.id}>
                                <td>{buyer.id}</td>
                                <td>{buyer.username}</td>
                                <td>{buyer.email}</td>
                                <td>
                                    <span
                                        className={
                                            buyer.approval_status === "approved"
                                                ? styles.approved
                                                : buyer.approval_status === "rejected"
                                                ? styles.rejected
                                                : styles.pending
                                        }
                                    >
                                        {buyer.approval_status}
                                    </span>
                                </td>
                                <td>{buyer.phone}</td>
                                <td>{buyer.created_at?.slice(0, 10)}</td>
                                <td>
                                    <button
                                        className={styles.viewBtn}
                                        onClick={() => {
                                            setSelectedBuyer(buyer);
                                            setModalOpen(true);
                                        }}
                                    >
                                        Review
                                    </button>
                                </td>
                            </tr>
                        ))}
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

            {/* Modal */}
            {modalOpen && selectedBuyer && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h3>Review Buyer</h3>

                        <div className={styles.modalContent}>
                            <p><strong>Name:</strong> {selectedBuyer.username}</p>
                            <p><strong>Email:</strong> {selectedBuyer.email}</p>
                            <p><strong>Phone:</strong> {selectedBuyer.phone}</p>
                        </div>

                        <div className={styles.modalActions}>
                            <button
                                className={styles.approveBtn}
                                onClick={() => handleApprove(selectedBuyer.id)}
                            >
                                Approve
                            </button>

                            <button
                                className={styles.rejectBtn}
                                onClick={() => handleReject(selectedBuyer.id)}
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
