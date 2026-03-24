//  src/pages/SupplierSignup/SupplierRegister/ProfilePreview.jsx

export default function ProfilePreview({ data }) {
  const {
    name,
    mobile,
    company,
    email,
    city,
    state,
    pincode,
    products,
  } = data || {};

  return (
    <div className="profile-card">
      <h3 className="profile-title">Your Profile So Far</h3>

      <div className="profile-row">
        <span>Your Name</span>
        <span>{name || "-"}</span>
      </div>
      <div className="profile-row">
        <span>Mobile Number</span>
        <span>{mobile || "-"}</span>
      </div>
      <div className="profile-row">
        <span>Company Name</span>
        <span>{company || "-"}</span>
      </div>
      <div className="profile-row">
        <span>Email</span>
        <span>{email || "-"}</span>
      </div>
      <div className="profile-row">
        <span>Address</span>
        <span>
          {city || ""} {state || ""} {pincode || ""}
        </span>
      </div>
      <div className="profile-row">
        <span>Products</span>
        <span>
          {products && products.length
            ? products.map((p) => p.name).join(" | ")
            : "-"}
        </span>
      </div>
    </div>
  );
}
