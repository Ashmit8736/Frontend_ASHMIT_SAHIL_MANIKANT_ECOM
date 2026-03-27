import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux"; 
import { clearCart } from "../../store/slices/cartSlice"; 
import api from "../../store/APi/axiosInstance";
import styles from "./Checkout.module.css";

const CheckoutPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [step, setStep] = useState(2);
    const [buyer, setBuyer] = useState(null);
    const onlyText = (v) => v.replace(/[^a-zA-Z\s]/g, "");
    const onlyNumber = (v) => v.replace(/\D/g, "");

    const [addrErrors, setAddrErrors] = useState({});


    const [addresses, setAddresses] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [loading, setLoading] = useState(false);


    /* ================= COUPON ================= */
    const [couponCode, setCouponCode] = useState("");
    const [couponLoading, setCouponLoading] = useState(false);
    const [discount, setDiscount] = useState(0);
    const [couponApplied, setCouponApplied] = useState(false);



    
    

    /* MODAL STATES */
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [editAddress, setEditAddress] = useState(null);

    const buyerName = buyer?.full_name || buyer?.name || "Buyer";
    const buyerPhone = buyer?.phone || buyer?.mobile || "";

    const [addrForm, setAddrForm] = useState({
        full_name: "",
        phone: "",
        address_line: "",
        city: "",
        state: "",
        pincode: "",
    });
    const validateAddress = (values) => {
        const errors = {};

        if (!values.full_name.trim()) {
            errors.full_name = "Full name is required";
        } else if (!/^[a-zA-Z\s]+$/.test(values.full_name)) {
            errors.full_name = "Only letters allowed";
        }

        if (!/^[0-9]{10}$/.test(values.phone)) {
            errors.phone = "Enter valid 10 digit phone number";
        }

        if (!values.address_line.trim()) {
            errors.address_line = "Address is required";
        }

        if (!values.city.trim()) {
            errors.city = "City is required";
        } else if (!/^[a-zA-Z\s]+$/.test(values.city)) {
            errors.city = "Only letters allowed";
        }

        if (!values.state.trim()) {
            errors.state = "State is required";
        } else if (!/^[a-zA-Z\s]+$/.test(values.state)) {
            errors.state = "Only letters allowed";
        }

        if (!/^[0-9]{6}$/.test(values.pincode)) {
            errors.pincode = "Enter valid 6 digit pincode";
        }

        return errors;
    };

    


    /* ================= LOAD DATA ================= */
    useEffect(() => {
        loadBuyer();
        loadAddresses();
        loadCart();
    }, []);

    const loadBuyer = async () => {
        try {
            const res = await api.get("/auth/me");
            setBuyer(res.data.data);
        } catch {
            setBuyer(null);
        }
    };

    const loadAddresses = async () => {
        try {
            const res = await api.get("/checkout/addresses");
            setAddresses(Array.isArray(res.data.data) ? res.data.data : []);
        } catch {
            setAddresses([]);
        }
    };

    const loadCart = async () => {
        try {
            const res = await api.get("/cart");
            const raw = res.data.data;

            if (Array.isArray(raw)) setCartItems(raw);
            else if (Array.isArray(raw?.items)) setCartItems(raw.items);
            else setCartItems([]);
        } catch {
            setCartItems([]);
        }
    };

    /* ================= CART TYPE ================= */
    const hasSeller = cartItems.some(i => i.owner_type === "seller");
    const hasSupplier = cartItems.some(i => i.owner_type === "supplier");
    const supplierOnly = hasSupplier && !hasSeller;

    /* ================= TOTAL ================= */
    const totalAmount = useMemo(() => {
        return cartItems.reduce((sum, i) => {
            const itemTotal =
                Number(i.subtotal) ||
                Number(i.item_subtotal) ||
                Number(i.unit_price) * Number(i.quantity);
            return sum + itemTotal;
        }, 0);
    }, [cartItems]);

    // ================= Discount ====================//

    const finalAmount = totalAmount - discount;


    /* ================= ADDRESS ================= */
    const openAddAddress = () => {
        setEditAddress(null);
        setAddrForm({
            full_name: "",
            phone: "",
            address_line: "",
            city: "",
            state: "",
            pincode: "",
        });
        setShowAddressForm(true);
    };

    const openEditAddress = (addr) => {
        setEditAddress(addr);
        setAddrForm({
            full_name: addr.full_name,
            phone: addr.phone,
            address_line: addr.address_line,
            city: addr.city,
            state: addr.state,
            pincode: addr.pincode,
        });
        setShowAddressForm(true);
    };

    const handleDeleteAddress = async (addressId) => {
        if (!window.confirm("Delete this address?")) return;

        try {
            await api.delete(`/checkout/address/${addressId}`);

            // agar selected address delete ho gaya
            if (selectedAddress === addressId) {
                setSelectedAddress(null);
            }

            loadAddresses();
        } catch (err) {
            console.error("DELETE ADDRESS ERROR:", err);
            alert("Failed to delete address");
        }
    };


    const handleSaveAddress = async () => {

        const errors = validateAddress(addrForm);

        if (Object.keys(errors).length > 0) {
            setAddrErrors(errors);
            return;
        }
        // const { full_name, phone, address_line, city, state, pincode } = addrForm;

        // if (!full_name.trim()) return alert("Full name is required");
        // if (!/^[0-9]{10}$/.test(phone)) return alert("Enter valid 10 digit phone");
        // if (!address_line.trim()) return alert("Address is required");
        // if (!city.trim()) return alert("City is required");
        // if (!state.trim()) return alert("State is required");
        // if (!/^[0-9]{6}$/.test(pincode)) return alert("Enter valid 6 digit pincode");

        try {
            if (editAddress) {
                await api.put(`/checkout/address/${editAddress.address_id}`, addrForm);
            } else {
                await api.post("/checkout/address", addrForm);
            }
            setShowAddressForm(false);
            setEditAddress(null);
            loadAddresses();
        } catch {
            alert("Failed to save address");
        }
        setAddrErrors({});
    };

    const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
        return alert("Enter coupon code");
    }

    try {
        setCouponLoading(true);

        const res = await api.post("/coupon/apply", {
            code: couponCode,
            cartTotal: totalAmount
        });

        setDiscount(Number(res.data.discount) || 0);
        setCouponApplied(true);

    } catch (err) {
        alert(err?.response?.data?.message || "Invalid Coupon");
        setDiscount(0);
        setCouponApplied(false);
    } finally {
        setCouponLoading(false);
    }
};


    /* ================= PLACE ORDER ================= */
    // const handlePlaceOrder = async () => {
    //     if (!cartItems.length) return alert("Cart is empty");

    //     // 🔥 supplier-only me address skip
    //     if (!supplierOnly && !selectedAddress) {
    //         return alert("Select address first");
    //     }

    //     try {
    //         setLoading(true);

    //         const payload = {
    //             order_type: supplierOnly ? "pickup" : "delivery",
    //             payment_mode: supplierOnly ? "PICKUP" : "COD",
    //             address_id: supplierOnly ? null : selectedAddress,
    //         };

    //         const res = await api.post("/checkout/place-order", payload);

    //         navigate("/app/order-success", {
    //             state: res.data.data,
    //         });
    //     } catch {
    //         alert("Order failed");
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    // NAYA (yahi paste karo)
const handlePlaceOrder = async () => {
    if (!cartItems.length) return alert("Cart is empty");
    if (!supplierOnly && !selectedAddress) return alert("Select address first");
    try {
        setLoading(true);
        const payload = {
            order_type: supplierOnly ? "pickup" : "delivery",
            payment_mode: supplierOnly ? "PICKUP" : "COD",
            address_id: supplierOnly ? null : selectedAddress,
        };
        const res = await api.post("/checkout/place-order", payload);
        dispatch(clearCart()); // ✅ Badge turant 0
        navigate("/app/order-success", { state: res.data.data });
    } catch {
        alert("Order failed");
    } finally {
        setLoading(false);
    }
};
    return (
        <div className={styles.checkoutPage}>
            <div className={styles.checkoutContainer}>

                {/* LEFT */}
                <div className={styles.leftSection}>

                    {/* BACK BUTTON */}
                    <button
                        className={styles.backBtn}
                        onClick={() => navigate(-1)}
                    >
                        ← Back
                    </button>

                    {/* STEP 1 LOGIN */}
                    <div className={styles.stepBox}>
                        <div className={styles.stepHeaderActive}>
                            <div className={styles.stepNumber}>1</div>
                            <span>Logged in</span>
                            <span className={styles.status}>✔</span>
                        </div>

                        <div className={styles.userInfo}>
                            <strong>{buyerName}</strong><br />
                            {buyerPhone && <span>📞 {buyerPhone}</span>}
                        </div>
                    </div>

                    {/* STEP 2 ADDRESS (UI SAME, LOGIC SKIPPED FOR SUPPLIER) */}
                    {!supplierOnly && (
                        <div className={styles.stepBox}>
                            <div className={styles.headerRow}>
                                <h3>Delivery Address</h3>
                                <button className={styles.addAddressBtn} onClick={openAddAddress}>
                                    + Add Address
                                </button>
                            </div>

                            {addresses.map((addr) => (
                                <div
                                    key={addr.address_id}
                                    className={`${styles.addressCard} ${selectedAddress === addr.address_id ? styles.activeCard : ""
                                        }`}
                                    onClick={() => {
                                        setSelectedAddress(addr.address_id);
                                        setStep(3);
                                    }}
                                >
                                    <div className={styles.addrTop}>
                                        <strong>{addr.full_name}</strong>

                                        <div className={styles.addrActions}>
                                            <button
                                                className={styles.editBtn}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    openEditAddress(addr);
                                                }}
                                            >
                                                Edit
                                            </button>

                                            <button
                                                className={styles.deleteBtn}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteAddress(addr.address_id);
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>

                                    <p>{addr.address_line}</p>
                                    <p>{addr.city}, {addr.state} - {addr.pincode}</p>
                                    <p>📞 {addr.phone}</p>
                                </div>
                            ))}

                        </div>
                    )}

                    {/* STEP 3 PAYMENT / PICKUP */}
                    <div className={styles.stepBox}>
                        <div className={styles.stepHeaderActive}>
                            <div className={styles.stepNumber}>3</div>
                            <span>{supplierOnly ? "Pickup Order" : "Payment"}</span>
                        </div>

                        {supplierOnly ? (
                            <p style={{ color: "#0b5ed7" }}>
                                🏭 This is a <strong>self-pickup order</strong>.
                                Pickup location will be shared after order confirmation.
                            </p>
                        ) : (
                            <div className={styles.paymentOption}>
  <label className={styles.codOption}>
    <input type="radio" checked readOnly />
    <span>
      <strong>Cash on Delivery</strong>
      <small>Pay when product is delivered</small>
    </span>
  </label>
</div>

                        )}

                        <button
                            onClick={handlePlaceOrder}
                            className={styles.deliverBtn}
                            disabled={loading}
                        >
                            {loading ? "Placing Order..." : "PLACE ORDER"}
                        </button>
                    </div>
                </div>

                {/* RIGHT */}
                <div className={styles.rightSection}>
                    <div className={styles.summaryBox}>
                        <h3>Order Summary</h3>

                        {cartItems.map((item) => (
                            <div key={item.cart_id} className={styles.itemRow}>
                                <span>{item.product_name} × {item.quantity}</span>
                                <span>
                                    ₹{(
                                        Number(item.subtotal) ||
                                        Number(item.item_subtotal) ||
                                        Number(item.unit_price) * Number(item.quantity)
                                    ).toLocaleString("en-IN")}
                                </span>
                            </div>
                        ))}

                        
                        {/* COUPON SECTION */}
<div className={styles.couponBox}>

    {!couponApplied ? (
        <div className={styles.couponRow}>
            <input
                type="text"
                placeholder="Have a coupon code?"
                value={couponCode}
                onChange={(e) =>
                    setCouponCode(e.target.value.toUpperCase())
                }
            />

            <button
                onClick={handleApplyCoupon}
                disabled={couponLoading}
            >
                {couponLoading ? "Applying..." : "Apply"}
            </button>
        </div>
    ) : (
        <div className={styles.couponSuccess}>
            ✔ Coupon Applied - ₹{discount}
        </div>
    )}

</div>


                       {discount > 0 && (
                       <div className={styles.discountRow}>
                           <span>Discount</span>
                       <span>- ₹{discount}</span>
                       </div>
                       )}

                        <div className={styles.totalBox}>
                            <strong>Total Payable</strong>
                            <strong>₹{totalAmount.toLocaleString("en-IN")}</strong>
                        </div>
                    </div>
                </div>
            </div>

            {/* ADDRESS MODAL — SAME AS TERA */}
            {showAddressForm && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h3>{editAddress ? "Edit Address" : "Add Address"}</h3>

                        <input
                            placeholder="Full Name"
                            value={addrForm.full_name}
                            onChange={(e) => {
                                const v = e.target.value.replace(/[^a-zA-Z\s]/g, "");
                                setAddrForm({ ...addrForm, full_name: v });
                                setAddrErrors({ ...addrErrors, full_name: "" });
                            }}
                        />
                        {addrErrors.full_name && (
                            <p className={styles.errorText}>{addrErrors.full_name}</p>
                        )}

                        <input
                            placeholder="Phone"
                            maxLength={10}
                            value={addrForm.phone}
                            onChange={(e) => {
                                const v = e.target.value.replace(/\D/g, "").slice(0, 10);
                                setAddrForm({ ...addrForm, phone: v });
                                setAddrErrors({ ...addrErrors, phone: "" });
                            }}
                        />
                        {addrErrors.phone && (
                            <p className={styles.errorText}>{addrErrors.phone}</p>
                        )}


                        <input
                            placeholder="Address"
                            value={addrForm.address_line}
                            onChange={(e) => {
                                setAddrForm({ ...addrForm, address_line: e.target.value });
                                setAddrErrors({ ...addrErrors, address_line: "" });
                            }}
                        />
                        {addrErrors.address_line && (
                            <p className={styles.errorText}>{addrErrors.address_line}</p>
                        )}


                        <input
                            placeholder="City"
                            value={addrForm.city}
                            onChange={(e) => {
                                const v = e.target.value.replace(/[^a-zA-Z\s]/g, "");
                                setAddrForm({ ...addrForm, city: v });
                                setAddrErrors({ ...addrErrors, city: "" });
                            }}
                        />
                        {addrErrors.city && (
                            <p className={styles.errorText}>{addrErrors.city}</p>
                        )}


                        <input
                            placeholder="State"
                            value={addrForm.state}
                            onChange={(e) => {
                                const v = e.target.value.replace(/[^a-zA-Z\s]/g, "");
                                setAddrForm({ ...addrForm, state: v });
                                setAddrErrors({ ...addrErrors, state: "" });
                            }}
                        />
                        {addrErrors.state && (
                            <p className={styles.errorText}>{addrErrors.state}</p>
                        )}


                        <input
                            placeholder="Pincode"
                            maxLength={6}
                            value={addrForm.pincode}
                            onChange={(e) => {
                                const v = e.target.value.replace(/\D/g, "").slice(0, 6);
                                setAddrForm({ ...addrForm, pincode: v });
                                setAddrErrors({ ...addrErrors, pincode: "" });
                            }}
                        />
                        {addrErrors.pincode && (
                            <p className={styles.errorText}>{addrErrors.pincode}</p>
                        )}


                        <div className={styles.modalActions}>
                            <button
  onClick={() => {
    setShowAddressForm(false);
    setAddrErrors({});
  }}
>
  Cancel
</button>
                            <button onClick={handleSaveAddress} disabled={loading}>
  Save
</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default CheckoutPage;