// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import styles from "./MyProfile.module.css";

// const MyProfile = () => {
//     const [loading, setLoading] = useState(true);
//     const [editing, setEditing] = useState(false);

//     const [profile, setProfile] = useState({
//         fullname: "",
//         email: "",
//         phone: "",
//         owner_name: "",
//         owner_phone: "",
//         owner_email: "",
//         warehouse_full_address: "",
//         warehouse_state: "",
//         warehouse_pincode: "",
//         approval_status: ""
//     });

//     // FETCH PROFILE
//     useEffect(() => {
//         const token = localStorage.getItem("sellerToken");

//         axios
//             .get("http://localhost:3000/api/auth/seller/seller-data", {
//                 headers: { Authorization: `Bearer ${token}` },
//             })
//             .then((res) => {
//                 const data = res.data.seller || {};

//                 setProfile({
//                     fullname: data.fullname || "",
//                     email: data.email || "",
//                     phone: data.phone || "",
//                     owner_name: data.owner_name || "",
//                     owner_phone: data.owner_phone || "",
//                     owner_email: data.owner_email || "",
//                     warehouse_full_address: data.warehouse_full_address || "",
//                     warehouse_state: data.warehouse_state || "",
//                     warehouse_pincode: data.warehouse_pincode || "",
//                     approval_status: data.approval_status || ""
//                 });

//                 setLoading(false);
//             })
//             .catch(() => setLoading(false));
//     }, []);

//     // HANDLE INPUT CHANGE
//     const handleChange = (e) => {
//         setProfile({ ...profile, [e.target.name]: e.target.value });
//     };

//     // SAVE PROFILE
//     const handleSave = async (e) => {
//         e.preventDefault();

//         const token = localStorage.getItem("sellerToken");

//         await axios.put(
//             "http://localhost:3000/api/auth/seller/seller-update-profile",
//             profile,
//             { headers: { Authorization: `Bearer ${token}` } }
//         );

//         alert("Profile updated!");
//         setEditing(false);
//     };

//     if (loading) return <h2>Loading...</h2>;

//     return (
//         <div className={styles.wrapper}>
//             <h1 className={styles.pageTitle}>Seller Profile</h1>

//             <div className={styles.profileLayout}>

//                 {/* LEFT CARD */}
//                 <div className={styles.leftCard}>
//                     <img
//                         src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
//                         className={styles.avatar}
//                     />
//                     <div className={styles.quickInfo}>
//                         <p><b>Name:</b> {profile.fullname}</p>
//                         <p><b>Email:</b> {profile.email}</p>
//                         <p><b>Phone:</b> {profile.phone}</p>
//                         <p><b>Status:</b> {profile.approval_status}</p>
//                     </div>
//                 </div>

//                 {/* RIGHT FORM */}
//                 <div className={styles.rightCard}>
//                     <form onSubmit={handleSave}>

//                         {/* PERSONAL INFO */}
//                         <div className={styles.section}>
//                             <h2>Personal Information</h2>

//                             <div className={styles.row}>
//                                 <div className={styles.inputBox}>
//                                     <label>Full Name</label>
//                                     <input
//                                         name="fullname"
//                                         value={profile.fullname}
//                                         onChange={handleChange}
//                                         disabled={!editing}
//                                     />
//                                 </div>

//                                 <div className={styles.inputBox}>
//                                     <label>Email</label>
//                                     <input
//                                         name="email"
//                                         value={profile.email}
//                                         onChange={handleChange}
//                                         disabled={!editing}
//                                     />
//                                 </div>
//                             </div>

//                             <div className={styles.row}>
//                                 <div className={styles.inputBox}>
//                                     <label>Phone</label>
//                                     <input
//                                         name="phone"
//                                         value={profile.phone}
//                                         onChange={handleChange}
//                                         disabled={!editing}
//                                     />
//                                 </div>
//                             </div>
//                         </div>

//                         {/* BUSINESS OWNER INFO */}
//                         <div className={styles.section}>
//                             <h2>Business Owner Information</h2>

//                             <div className={styles.row}>
//                                 <div className={styles.inputBox}>
//                                     <label>Owner Name</label>
//                                     <input
//                                         name="owner_name"
//                                         value={profile.owner_name}
//                                         onChange={handleChange}
//                                         disabled={!editing}
//                                     />
//                                 </div>

//                                 <div className={styles.inputBox}>
//                                     <label>Owner Phone</label>
//                                     <input
//                                         name="owner_phone"
//                                         value={profile.owner_phone}
//                                         onChange={handleChange}
//                                         disabled={!editing}
//                                     />
//                                 </div>
//                             </div>

//                             <div className={styles.row}>
//                                 <div className={styles.inputBox}>
//                                     <label>Owner Email</label>
//                                     <input
//                                         name="owner_email"
//                                         value={profile.owner_email}
//                                         onChange={handleChange}
//                                         disabled={!editing}
//                                     />
//                                 </div>
//                             </div>
//                         </div>

//                         {/* WAREHOUSE */}
//                         <div className={styles.section}>
//                             <h2>Warehouse Information</h2>

//                             <div className={styles.inputBox}>
//                                 <label>Full Address</label>
//                                 <textarea
//                                     name="warehouse_full_address"
//                                     value={profile.warehouse_full_address}
//                                     onChange={handleChange}
//                                     disabled={!editing}
//                                 />
//                             </div>

//                             <div className={styles.row}>
//                                 <div className={styles.inputBox}>
//                                     <label>State</label>
//                                     <input
//                                         name="warehouse_state"
//                                         value={profile.warehouse_state}
//                                         onChange={handleChange}
//                                         disabled={!editing}
//                                     />
//                                 </div>

//                                 <div className={styles.inputBox}>
//                                     <label>Pincode</label>
//                                     <input
//                                         name="warehouse_pincode"
//                                         value={profile.warehouse_pincode}
//                                         onChange={handleChange}
//                                         disabled={!editing}
//                                     />
//                                 </div>
//                             </div>
//                         </div>

//                         {/* BUTTON */}
//                         <div className={styles.buttonRow}>
//                             {!editing ? (
//                                 <button
//                                     type="button"
//                                     className={styles.editBtn}
//                                     onClick={() => setEditing(true)}
//                                 >
//                                     Edit Profile
//                                 </button>
//                             ) : (
//                                 <button className={styles.saveBtn}>Save Changes</button>
//                             )}
//                         </div>

//                     </form>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default MyProfile;


import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./MyProfile.module.css";

const MyProfile = () => {
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [profile, setProfile] = useState({});

    /* ==========================================
        FETCH PROFILE
    ========================================== */
    useEffect(() => {
        const token = localStorage.getItem("sellerToken");

        axios.get("http://localhost:3000/api/auth/seller/seller-data", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => {
                setProfile(res.data.seller);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    /* ==========================================
        HANDLE INPUT CHANGE
    ========================================== */
    const handleChange = (e) => {
        setProfile((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    /* ==========================================
        SAVE PROFILE (ONLY ON SAVE BUTTON CLICK)
    ========================================== */
    const handleSave = async (e) => {
        e.preventDefault();

        if (!editing) return;   // ❌ Prevent unwanted auto-submit

        const token = localStorage.getItem("sellerToken");

        const payload = {
            fullname: profile.fullname || "",
            phone: profile.phone || "",
            email: profile.email || "",

            owner_name: profile.owner_name || "",
            owner_phone: profile.owner_phone || "",
            owner_email: profile.owner_email || "",

            warehouse_full_address: profile.warehouse_full_address || "",
            warehouse_state: profile.warehouse_state || "",
            warehouse_pincode: profile.warehouse_pincode || "",

            gst_no: profile.gst_no || "",
            organisation_email: profile.organisation_email || "",
            primary_contact_person_name: profile.primary_contact_person_name || "",
            primary_contact_person_phone: profile.primary_contact_person_phone || "",
            primary_contact_person_email: profile.primary_contact_person_email || "",
            company_name: profile.company_name || "",
            warehouse_order_procising_capacity: profile.warehouse_order_procising_capacity || "",
            bank_account_holder_name: profile.bank_account_holder_name || "",
            bank_account_no: profile.bank_account_no || "",
            bank_IFCS: profile.bank_IFCS || "",
            bank_name: profile.bank_name || "",
            account_type: profile.account_type || "",
            nature_of_business: profile.nature_of_business || "General Business",
            business_category: profile.business_category || "",
            declaration: profile.declaration || 0,
        };

        await axios.put(
            "http://localhost:3000/api/auth/seller/seller-update-profile",
            payload,
            { headers: { Authorization: `Bearer ${token}` } }
        );

        alert("Profile Updated Successfully!");
        setEditing(false);
    };

    if (loading) return <h2>Loading...</h2>;

    return (
        <div className={styles.wrapper}>
            <h1 className={styles.pageTitle}>Seller Profile</h1>

            <div className={styles.profileLayout}>

                {/* LEFT CARD */}
                <div className={styles.leftCard}>
                    <img src="https://cdn-icons-png.flaticon.com/512/149/149071.png" className={styles.avatar} />
                    <div className={styles.quickInfo}>
                        <p><b>Name:</b> {profile.fullname}</p>
                        <p><b>Email:</b> {profile.email}</p>
                        <p><b>Phone:</b> {profile.phone}</p>
                        <p><b>Status:</b> {profile.approval_status}</p>
                    </div>
                </div>

                {/* RIGHT FORM */}
                <div className={styles.rightCard}>
                    <form
                        onSubmit={handleSave}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                            }
                        }}
                    >

                        {/* PERSONAL INFO */}
                        <div className={styles.section}>
                            <h2>Personal Information</h2>

                            <div className={styles.row}>
                                <div className={styles.inputBox}>
                                    <label>Full Name</label>
                                    <input
                                        name="fullname"
                                        value={profile.fullname}
                                        disabled={!editing}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className={styles.inputBox}>
                                    <label>Email</label>
                                    <input
                                        name="email"
                                        value={profile.email}
                                        disabled={!editing}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className={styles.row}>
                                <div className={styles.inputBox}>
                                    <label>Phone</label>
                                    <input
                                        name="phone"
                                        value={profile.phone}
                                        disabled={!editing}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* OWNER INFO */}
                        <div className={styles.section}>
                            <h2>Business Owner Information</h2>

                            <div className={styles.row}>
                                <div className={styles.inputBox}>
                                    <label>Owner Name</label>
                                    <input
                                        name="owner_name"
                                        value={profile.owner_name}
                                        disabled={!editing}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className={styles.inputBox}>
                                    <label>Owner Phone</label>
                                    <input
                                        name="owner_phone"
                                        value={profile.owner_phone}
                                        disabled={!editing}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className={styles.row}>
                                <div className={styles.inputBox}>
                                    <label>Owner Email</label>
                                    <input
                                        name="owner_email"
                                        value={profile.owner_email}
                                        disabled={!editing}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* WAREHOUSE */}
                        <div className={styles.section}>
                            <h2>Warehouse Information</h2>

                            <div className={styles.inputBox}>
                                <label>Full Address</label>
                                <textarea
                                    name="warehouse_full_address"
                                    value={profile.warehouse_full_address}
                                    disabled={!editing}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className={styles.row}>
                                <div className={styles.inputBox}>
                                    <label>State</label>
                                    <input
                                        name="warehouse_state"
                                        value={profile.warehouse_state}
                                        disabled={!editing}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className={styles.inputBox}>
                                    <label>Pincode</label>
                                    <input
                                        name="warehouse_pincode"
                                        value={profile.warehouse_pincode}
                                        disabled={!editing}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* BUTTONS */}
                        <div className={styles.buttonRow}>
                            {!editing ? (
                                <button
                                    type="button"
                                    className={styles.editBtn}
                                    onClick={() => setEditing(true)}
                                >
                                    Edit Profile
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    className={styles.saveBtn}
                                    onClick={handleSave}
                                >
                                    Save Changes
                                </button>
                            )}
                        </div>
                    </form>

                </div>
            </div>
        </div>
    );
};

export default MyProfile;
