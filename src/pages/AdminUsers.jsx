import React, { useState, useEffect } from "react";
import styles from "../PagesStyles/AdminUsers.module.css";
import { FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import axios from "axios";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://192.168.1.51:3000/api/auth/allusers", {
          withCredentials: true,
        });

        // backend may return { users: [...] } or an array directly
        const payload = res.data;
        const userList = Array.isArray(payload) ? payload : payload.users || [];
        setUsers(userList);
      } catch (err) {
        console.error("Error fetching users:", err);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <p className={styles.loading}>Loading users...</p>;

  const filteredUsers = users.filter((u) =>
    u.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.phone?.includes(searchTerm)
  );

  return (
    <div className={styles.adminWrapper}>
      <h2>Registered Users</h2>
      <br />
      <div className={styles.searchBar}>
        <FaSearch />
        <input
          type="text"
          placeholder="Search by name, email, or mobile..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <table className={styles.userTable}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user, i) => (
            <tr key={user.id ?? i}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>
                <span className={`${styles.status} ${user.is_active === "Active" ? styles.active : styles.inactive}`}>
                  {user.is_active}
                </span>
              </td>
              <td className={styles.actions}>
                <button title="Edit"><FaEdit /></button>
                <button title="Delete"><FaTrash /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUsers;
