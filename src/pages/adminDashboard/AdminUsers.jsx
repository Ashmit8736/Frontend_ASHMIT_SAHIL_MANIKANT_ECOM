// import React, { useEffect, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { FaSearch, FaUserCheck, FaUserTimes } from "react-icons/fa";
// import { MdPersonOff } from "react-icons/md";
// import axios from "axios";
// import styles from "./AdminUsers.module.css";

// const AdminUsers = () => {
//     const [users, setUsers] = useState([]);
//     const [search, setSearch] = useState("");
//     const [selectedRole, setSelectedRole] = useState("All");
//     const [viewUser, setViewUser] = useState(null);

//     const [currentPage, setCurrentPage] = useState(1);
//     const itemsPerPage = 10;

//     const token = localStorage.getItem("adminToken");

//     // Fetch all users
//     const fetchUsers = async () => {
//         try {
//             const { data } = await axios.get(
//                 "http://localhost:3000/api/admin/users",
//                 { headers: { Authorization: `Bearer ${token}` } }
//             );

//             setUsers(data.users);
//         } catch (error) {
//             console.error("User Fetch Error:", error);
//         }
//     };

//     useEffect(() => {
//         fetchUsers();
//     }, []);

//     // SEARCH + ROLE FILTER
//     const filteredUsers = users.filter(
//         (u) =>
//             (selectedRole === "All" || u.role === selectedRole) &&
//             (u.name.toLowerCase().includes(search.toLowerCase()) ||
//                 u.email.toLowerCase().includes(search.toLowerCase()))
//     );

//     // RESET PAGE ON FILTER / SEARCH
//     useEffect(() => {
//         setCurrentPage(1);
//     }, [search, selectedRole]);

//     // PAGINATION LOGIC
//     const indexOfLast = currentPage * itemsPerPage;
//     const indexOfFirst = indexOfLast - itemsPerPage;
//     const currentUsers = filteredUsers.slice(indexOfFirst, indexOfLast);
//     const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

//     const changePage = (num) => setCurrentPage(num);

//     // STATUS COUNTS
//     const totalUsers = users.length;
//     const activeUsers = users.filter((u) => u.status === "active").length;
//     const inactiveUsers = users.filter((u) => u.status === "inactive").length;
//     const suspendedUsers = users.filter((u) => u.status === "suspended").length;

//     return (
//         <div className={styles.container}>
//             <div className={styles.header}>
//                 <h2>User Management</h2>
//             </div>

//             {/* Analytics */}
//             <div className={styles.statsGrid}>
//                 <div className={`${styles.statCard} ${styles.blue}`}>
//                     <div>
//                         <p>Total Users</p>
//                         <h3>{totalUsers}</h3>
//                     </div>
//                     <FaUserCheck className={styles.icon} />
//                 </div>

//                 <div className={`${styles.statCard} ${styles.green}`}>
//                     <div>
//                         <p>Active Users</p>
//                         <h3>{activeUsers}</h3>
//                     </div>
//                     <FaUserCheck className={styles.icon} />
//                 </div>

//                 <div className={`${styles.statCard} ${styles.orange}`}>
//                     <div>
//                         <p>Inactive Users</p>
//                         <h3>{inactiveUsers}</h3>
//                     </div>
//                     <FaUserTimes className={styles.icon} />
//                 </div>

//                 <div className={`${styles.statCard} ${styles.red}`}>
//                     <div>
//                         <p>Suspended</p>
//                         <h3>{suspendedUsers}</h3>
//                     </div>
//                     <MdPersonOff className={styles.icon} />
//                 </div>
//             </div>

//             {/* Filter Tabs */}
//             <div className={styles.filterTabs}>
//                 {["All", "Buyer", "Seller", "Supplier", "Admin"].map((role) => {
//                     const count =
//                         role === "All"
//                             ? users.length
//                             : users.filter((u) => u.role === role).length;

//                     return (
//                         <button
//                             key={role}
//                             onClick={() => setSelectedRole(role)}
//                             className={`${styles.filterTab} ${selectedRole === role ? styles.activeTab : ""}`}
//                         >
//                             {role === "All" ? "All Users" : role + "s"} ({count})
//                         </button>
//                     );
//                 })}
//             </div>

//             {/* Search */}
//             <div className={styles.controls}>
//                 <div className={styles.searchBox}>
//                     <FaSearch className={styles.searchIcon} />
//                     <input
//                         type="text"
//                         placeholder="Search users..."
//                         value={search}
//                         onChange={(e) => setSearch(e.target.value)}
//                     />
//                 </div>
//             </div>

//             {/* Table */}
//             <div className={styles.tableWrapper}>
//                 <table className={styles.table}>
//                     <thead>
//                         <tr>
//                             <th>ID</th>
//                             <th>Name</th>
//                             <th>Email</th>
//                             <th>Role</th>
//                             <th>Status</th>
//                             <th>Joined</th>
//                             <th>Action</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {currentUsers.length > 0 ? (
//                             currentUsers.map((u) => (
//                                 <tr key={u.id}>
//                                     <td>{u.id}</td>
//                                     <td>{u.name}</td>
//                                     <td>{u.email}</td>
//                                     <td>{u.role}</td>
//                                     <td>
//                                         <span className={`${styles.statusBadge} ${styles[u.status]}`}>
//                                             {u.status}
//                                         </span>
//                                     </td>
//                                     <td>{u.created_at?.slice(0, 10)}</td>
//                                     <td>
//                                         <button className={styles.viewBtn} onClick={() => setViewUser(u)}>
//                                             View
//                                         </button>
//                                     </td>
//                                 </tr>
//                             ))
//                         ) : (
//                             <tr>
//                                 <td colSpan="7" className={styles.noData}>
//                                     No users found.
//                                 </td>
//                             </tr>
//                         )}
//                     </tbody>
//                 </table>
//             </div>

//             {/* PAGINATION */}
//             <div className={styles.pagination}>
//                 <button className={styles.BtnPrev} disabled={currentPage === 1} onClick={() => changePage(currentPage - 1)}>
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

//                 <button className={styles.BtnNext} disabled={currentPage === totalPages} onClick={() => changePage(currentPage + 1)}>
//                     Next
//                 </button>
//             </div>

//             {/* MODAL */}
//             <AnimatePresence>
//                 {viewUser && (
//                     <motion.div
//                         className={styles.modalOverlay}
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         exit={{ opacity: 0 }}
//                     >
//                         <motion.div
//                             className={styles.modalContent}
//                             initial={{ scale: 0.8, opacity: 0 }}
//                             animate={{ scale: 1, opacity: 1 }}
//                             exit={{ scale: 0.8, opacity: 0 }}
//                         >
//                             <h3>User Profile</h3>

//                             <p><strong>ID:</strong> {viewUser.id}</p>
//                             <p><strong>Name:</strong> {viewUser.name}</p>
//                             <p><strong>Email:</strong> {viewUser.email}</p>
//                             <p><strong>Role:</strong> {viewUser.role}</p>
//                             <p><strong>Status:</strong> {viewUser.status}</p>
//                             <p><strong>Joined:</strong> {viewUser.created_at?.slice(0, 10)}</p>

//                             <button
//                                 className={styles.closeBtn}
//                                 onClick={() => setViewUser(null)}
//                             >
//                                 Close
//                             </button>
//                         </motion.div>
//                     </motion.div>
//                 )}
//             </AnimatePresence>
//         </div>
//     );
// };

// export default AdminUsers;


import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearch, FaUserCheck, FaUserTimes } from "react-icons/fa";
import { MdPersonOff } from "react-icons/md";
import axios from "axios";
import styles from "./AdminUsers.module.css";

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedRole, setSelectedRole] = useState("All");
    const [viewUser, setViewUser] = useState(null);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const token = localStorage.getItem("adminToken");

    // Fetch Users
    const fetchUsers = async () => {
        try {
            const { data } = await axios.get(
                "http://localhost:3000/api/admin/users",
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setUsers(data.users);
        } catch (error) {
            console.error("User Fetch Error:", error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Search + Role Filter
    const filteredUsers = users.filter(
        (u) =>
            (selectedRole === "All" || u.role === selectedRole) &&
            (u.name.toLowerCase().includes(search.toLowerCase()) ||
                u.email.toLowerCase().includes(search.toLowerCase()))
    );

    // Reset page on filter/search
    useEffect(() => {
        setCurrentPage(1);
    }, [search, selectedRole]);

    // Pagination Logic
    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

    // Stats
    const totalUsers = users.length;
    const activeUsers = users.filter((u) => u.status === "active").length;
    const inactiveUsers = users.filter((u) => u.status === "inactive").length;
    const suspendedUsers = users.filter((u) => u.status === "suspended").length;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2>User Management</h2>
            </div>

            {/* Stats */}
            <div className={styles.statsGrid}>
                <div className={`${styles.statCard} ${styles.blue}`}>
                    <div>
                        <p>Total Users</p>
                        <h3>{totalUsers}</h3>
                    </div>
                    <FaUserCheck className={styles.icon} />
                </div>

                <div className={`${styles.statCard} ${styles.green}`}>
                    <div>
                        <p>Active Users</p>
                        <h3>{activeUsers}</h3>
                    </div>
                    <FaUserCheck className={styles.icon} />
                </div>

                <div className={`${styles.statCard} ${styles.orange}`}>
                    <div>
                        <p>Inactive Users</p>
                        <h3>{inactiveUsers}</h3>
                    </div>
                    <FaUserTimes className={styles.icon} />
                </div>

                <div className={`${styles.statCard} ${styles.red}`}>
                    <div>
                        <p>Suspended</p>
                        <h3>{suspendedUsers}</h3>
                    </div>
                    <MdPersonOff className={styles.icon} />
                </div>
            </div>

            {/* Role Filter */}
            <div className={styles.filterTabs}>
                {["All", "Buyer", "Seller", "Supplier", "Admin"].map((role) => {
                    const count =
                        role === "All"
                            ? users.length
                            : users.filter((u) => u.role === role).length;

                    return (
                        <button
                            key={role}
                            onClick={() => setSelectedRole(role)}
                            className={`${styles.filterTab} ${
                                selectedRole === role ? styles.activeTab : ""
                            }`}
                        >
                            {role === "All" ? "All Users" : role + "s"} ({count})
                        </button>
                    );
                })}
            </div>

            {/* Search */}
            <div className={styles.controls}>
                <div className={styles.searchBox}>
                    <FaSearch className={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
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
                            <th>Role</th>
                            <th>Status</th>
                            <th>Joined</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentUsers.length > 0 ? (
                            currentUsers.map((u) => (
                                <tr key={u.id}>
                                    <td>{u.id}</td>
                                    <td>{u.name}</td>
                                    <td>{u.email}</td>
                                    <td>{u.role}</td>
                                    <td>
                                        <span
                                            className={`${styles.statusBadge} ${styles[u.status]}`}
                                        >
                                            {u.status}
                                        </span>
                                    </td>
                                    <td>{u.created_at?.slice(0, 10)}</td>
                                    <td>
                                        <button
                                            className={styles.viewBtn}
                                            onClick={() => setViewUser(u)}
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className={styles.noData}>
                                    No users found.
                                </td>
                            </tr>
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

            {/* Modal */}
            <AnimatePresence>
                {viewUser && (
                    <motion.div
                        className={styles.modalOverlay}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className={styles.modalContent}
                            initial={{ scale: 0.85, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.85, opacity: 0 }}
                        >
                            <h3>User Profile</h3>

                            <p><strong>ID:</strong> {viewUser.id}</p>
                            <p><strong>Name:</strong> {viewUser.name}</p>
                            <p><strong>Email:</strong> {viewUser.email}</p>
                            <p><strong>Role:</strong> {viewUser.role}</p>
                            <p><strong>Status:</strong> {viewUser.status}</p>
                            <p><strong>Joined:</strong> {viewUser.created_at?.slice(0, 10)}</p>

                            <button
                                className={styles.closeBtn}
                                onClick={() => setViewUser(null)}
                            >
                                Close
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminUsers;
