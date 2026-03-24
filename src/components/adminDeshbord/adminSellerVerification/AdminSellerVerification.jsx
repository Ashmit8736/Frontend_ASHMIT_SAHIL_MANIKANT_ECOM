
// import React, { useEffect, useState } from "react";
// import style from "./AdminSellerVerification.module.css";
// import axios from "axios";

// export default function AdminSellerVerification() {
//   const [sellers, setSellers] = useState([]);
//   const [selectedSeller, setSelectedSeller] = useState(null);

//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10;

//   const token = localStorage.getItem("adminToken");

//   const [actionLoading, setActionLoading] = useState(false);

//   // Fetch all sellers
//   const fetchSellers = async () => {
//     try {
//       const { data } = await axios.get(
//         "http://localhost:3000/api/admin/all-seller",
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       setSellers(data.sellers);
//     } catch (error) {
//       console.error("Seller Fetch Error:", error);
//     }
//   };

//   useEffect(() => {
//     fetchSellers();
//   }, []);

//   // Summary card counts
//   const counts = {
//     pending: sellers.filter((s) => s.approval_status === "pending").length,
//     approved: sellers.filter((s) => s.approval_status === "approved").length,
//     rejected: sellers.filter((s) => s.approval_status === "rejected").length,
//   };

//   // CSS class for status
//   const getStatusClass = (status) => {
//     if (status === "approved") return style.approved;
//     if (status === "rejected") return style.rejected;
//     return style.pending;
//   };

//   // Approve Seller
//   const approve = async (id) => {
//     try {
//       setActionLoading(true);
//       await axios.patch(
//         `http://localhost:3000/api/admin/approveSeller/${id}`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       await fetchSellers();
//       setSelectedSeller(null);
//     } catch (err) {
//       console.error("Approve Error:", err);
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   // Reject Seller
//   const reject = async (id) => {
//     try {
//       setActionLoading(true);
//       await axios.patch(
//         `http://localhost:3000/api/admin/rejectSeller/${id}`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       await fetchSellers();
//       setSelectedSeller(null);
//     } catch (err) {
//       console.error("Reject Error:", err);
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   // Pagination ----------------------------------------
//   const indexOfLast = currentPage * itemsPerPage;
//   const indexOfFirst = indexOfLast - itemsPerPage;
//   const currentSellers = sellers.slice(indexOfFirst, indexOfLast);

//   const totalPages = Math.ceil(sellers.length / itemsPerPage);

//   const changePage = (num) => setCurrentPage(num);
//   // ----------------------------------------------------

//   return (
//     <div className={style.AdminSellerVerificationContainer}>
//       <div className={style.heading}>
//         <h2>Seller Verification</h2>
//         <p>Manage and verify seller accounts</p>
//       </div>

//       {/* Summary Cards */}
//       <div className={style.summaryCards}>
//         <div className={`${style.card} ${style.pendingCard}`}>
//           <h4>Pending</h4>
//           <p>Awaiting approval</p>
//           <span>{counts.pending}</span>
//         </div>

//         <div className={`${style.card} ${style.approvedCard}`}>
//           <h4>Approved</h4>
//           <p>Verified sellers</p>
//           <span>{counts.approved}</span>
//         </div>

//         <div className={`${style.card} ${style.rejectedCard}`}>
//           <h4>Rejected</h4>
//           <p>Declined profiles</p>
//           <span>{counts.rejected}</span>
//         </div>
//       </div>

//       {/* Table */}
//       <div className={style.tableWrapper}>
//         <table className={style.table}>
//           <thead>
//             <tr>
//               <th>ID</th>
//               <th>Company</th>
//               <th>GST</th>
//               <th>Contact</th>
//               <th>City</th>
//               <th>Registered</th>
//               <th>Status</th>
//               <th>Action</th>
//             </tr>
//           </thead>

//           <tbody>
//             {currentSellers.map((s) => (
//               <tr key={s.id}>
//                 <td>{s.id}</td>

//                 <td>
//                   <strong>{s.company_name}</strong>
//                   <div className={style.username}>{s.fullname}</div>
//                 </td>

//                 <td>{s.gst_no}</td>

//                 <td>
//                   <div>{s.email}</div>
//                   <div>{s.phone}</div>
//                 </td>

//                 <td>
//                   {s.branch_city}, {s.branch_state}
//                 </td>

//                 <td>{s.created_at?.slice(0, 10)}</td>

//                 <td>
//                   <span className={getStatusClass(s.approval_status)}>
//                     {s.approval_status}
//                   </span>
//                 </td>

//                 <td>
//                   <button
//                     className={style.viewBtn}
//                     onClick={() => setSelectedSeller(s)}
//                   >
//                     Review
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* PAGINATION UI */}
//       <div className={style.pagination}>
//         <button
//           disabled={currentPage === 1}
//           onClick={() => changePage(currentPage - 1)}
//         >
//           Prev
//         </button>

//         {[...Array(totalPages).keys()].map((num) => (
//           <button
//             key={num}
//             className={currentPage === num + 1 ? style.activePage : ""}
//             onClick={() => changePage(num + 1)}
//           >
//             {num + 1}
//           </button>
//         ))}

//         <button
//           disabled={currentPage === totalPages}
//           onClick={() => changePage(currentPage + 1)}
//         >
//           Next
//         </button>
//       </div>

//       {/* MODAL */}
//       {selectedSeller && (
//         <div className={style.modalOverlay}>
//           <div className={style.modal}>
//             <h3>Seller Details</h3>

//             <div className={style.modalContent}>
//               <p><strong>ID:</strong> {selectedSeller.id}</p>
//               <p><strong>Full Name:</strong> {selectedSeller.fullname}</p>
//               <p><strong>Company:</strong> {selectedSeller.company_name}</p>
//               <p><strong>GST:</strong> {selectedSeller.gst_no}</p>
//               <p><strong>Email:</strong> {selectedSeller.email}</p>
//               <p><strong>Phone:</strong> {selectedSeller.phone}</p>
//               <p><strong>City:</strong> {selectedSeller.branch_city}</p>
//               <p><strong>State:</strong> {selectedSeller.branch_state}</p>
//               <p><strong>Pincode:</strong> {selectedSeller.branch_pincode}</p>
//               <p><strong>Registered:</strong> {selectedSeller.created_at?.slice(0, 10)}</p>

//               <p>
//                 <strong>Status:</strong>{" "}
//                 <span className={getStatusClass(selectedSeller.approval_status)}>
//                   {selectedSeller.approval_status}
//                 </span>
//               </p>
//             </div>

//             <div className={style.modalActions}>
//               {selectedSeller.approval_status === "pending" && (
//                 <>
//                   <button
//                     className={style.approveBtn}
//                     onClick={() => approve(selectedSeller.id)}
//                   >
//                     Approve
//                   </button>

//                   <button
//                     className={style.rejectBtn}
//                     onClick={() => reject(selectedSeller.id)}
//                   >
//                     Reject
//                   </button>
//                 </>
//               )}

//               <button
//                 className={style.closeBtn}
//                 onClick={() => setSelectedSeller(null)}
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import style from "./AdminSellerVerification.module.css";
import axios from "axios";

export default function AdminSellerVerification() {
  const [sellers, setSellers] = useState([]);
  const [selectedSeller, setSelectedSeller] = useState(null);

  // PAGINATION STATE
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

  const [actionLoading, setActionLoading] = useState(false);

  const token = localStorage.getItem("adminToken");

  // ================= FETCH SELLERS =================
  const fetchSellers = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:3000/api/admin/all-seller",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSellers(data.sellers || []);
    } catch (error) {
      console.error("Seller Fetch Error:", error);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  // ================= COUNTS =================
  const counts = {
    pending: sellers.filter(s => s.approval_status === "pending").length,
    approved: sellers.filter(s => s.approval_status === "approved").length,
    rejected: sellers.filter(s => s.approval_status === "rejected").length,
  };

  // ================= STATUS CLASS =================
  const getStatusClass = (status) => {
    if (status === "approved") return style.approved;
    if (status === "rejected") return style.rejected;
    return style.pending;
  };

  // ================= ACTIONS =================
  const approveSeller = async (id) => {
    try {
      setActionLoading(true);
      await axios.patch(
        `http://localhost:3000/api/admin/approveSeller/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchSellers();
      setSelectedSeller(null);
    } catch (err) {
      console.error("Approve Error:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const rejectSeller = async (id) => {
    try {
      setActionLoading(true);
      await axios.patch(
        `http://localhost:3000/api/admin/rejectSeller/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchSellers();
      setSelectedSeller(null);
    } catch (err) {
      console.error("Reject Error:", err);
    } finally {
      setActionLoading(false);
    }
  };

  // ================= PAGINATION LOGIC =================
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentSellers = sellers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(sellers.length / itemsPerPage);

  const goPrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const goNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  // ================= RENDER =================
  return (
    <div className={style.AdminSellerVerificationContainer}>
      <div className={style.heading}>
        <h2>Seller Verification</h2>
        <p>Manage and verify seller accounts</p>
      </div>

      {/* SUMMARY */}
      <div className={style.summaryCards}>
        <div className={`${style.card} ${style.pendingCard}`}>
          <h4>Pending</h4>
          <span>{counts.pending}</span>
        </div>
        <div className={`${style.card} ${style.approvedCard}`}>
          <h4>Approved</h4>
          <span>{counts.approved}</span>
        </div>
        <div className={`${style.card} ${style.rejectedCard}`}>
          <h4>Rejected</h4>
          <span>{counts.rejected}</span>
        </div>
      </div>

      {/* TABLE */}
      <div className={style.tableWrapper}>
        <table className={style.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Company</th>
              <th>GST</th>
              <th>Contact</th>
              <th>City</th>
              <th>Registered</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {currentSellers.length === 0 ? (
              <tr>
                <td colSpan="8" className={style.noData}>
                  No sellers found
                </td>
              </tr>
            ) : (
              currentSellers.map((s) => (
                <tr key={s.id}>
                  <td>{s.id}</td>
                  <td>
                    <strong>{s.company_name}</strong>
                    <div className={style.username}>{s.fullname}</div>
                  </td>
                  <td>{s.gst_no}</td>
                  <td>
                    <div>{s.email}</div>
                    <div>{s.phone}</div>
                  </td>
                  <td>{s.branch_city}, {s.branch_state}</td>
                  <td>{s.created_at?.slice(0, 10)}</td>
                  <td>
                    <span className={getStatusClass(s.approval_status)}>
                      {s.approval_status}
                    </span>
                  </td>
                  <td>
                    <button
                      className={style.viewBtn}
                      onClick={() => setSelectedSeller(s)}
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

      {/* ✅ PAGINATION UI */}
      {totalPages > 1 && (
        <div className={style.pagination}>
          <button
            className={style.BtnPrev}
            disabled={currentPage === 1}
            onClick={goPrev}
          >
            Prev
          </button>

          <span className={style.pageInfo}>
            Page {currentPage} of {totalPages}
          </span>

          <button
            className={style.BtnNext}
            disabled={currentPage === totalPages}
            onClick={goNext}
          >
            Next
          </button>
        </div>
      )}

      {/* MODAL */}
      {selectedSeller && (
        <div className={style.modalOverlay}>
          <div className={style.modal}>
            <h3>Seller Details</h3>

            <div className={style.modalContent}>
              <p><b>Company:</b> {selectedSeller.company_name}</p>
              <p><b>Owner:</b> {selectedSeller.fullname}</p>
              <p><b>Email:</b> {selectedSeller.email}</p>
              <p><b>Phone:</b> {selectedSeller.phone}</p>
              <p>
                <b>Status:</b>{" "}
                <span className={getStatusClass(selectedSeller.approval_status)}>
                  {selectedSeller.approval_status}
                </span>
              </p>
            </div>

            <div className={style.modalActions}>
              <button
                className={style.approveBtn}
                disabled={
                  actionLoading ||
                  selectedSeller.approval_status === "approved"
                }
                onClick={() => approveSeller(selectedSeller.id)}
              >
                Approve
              </button>

              <button
                className={style.rejectBtn}
                disabled={
                  actionLoading ||
                  selectedSeller.approval_status === "rejected"
                }
                onClick={() => rejectSeller(selectedSeller.id)}
              >
                Reject
              </button>

              <button
                className={style.closeBtn}
                onClick={() => setSelectedSeller(null)}
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
