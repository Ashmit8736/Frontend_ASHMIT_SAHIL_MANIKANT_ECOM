import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Cart.module.css";
import { useDispatch } from "react-redux";
import {
  setCart as setReduxCart,
  removeItem as removeReduxItem,
} from "../../store/slices/cartSlice";
import { useNavigate } from "react-router-dom";

/* ===============================
   SAFE IMAGE PARSER
================================ */
const getImageUrl = (img) => {
  if (!img) return null;
  try {
    const parsed = JSON.parse(img);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed[0];
    return parsed;
  } catch {
    return img;
  }
};

const Cart = () => {
  const dispatch = useDispatch();

  const [cart, setCart] = useState([]);
  const [billing, setBilling] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  /* ===============================
     FETCH CART
  =============================== */

  const fetchCart = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/cart", {
        withCredentials: true,
      });

      const items = res.data?.data || [];

      setCart(items);
      dispatch(setReduxCart(items));

      // 🔥 CALCULATE BILLING HERE
      let sellerSubtotal = 0;
      let supplierSubtotal = 0;
      let supplierGST = 0;

      items.forEach((item) => {
        if (item.owner_type === "seller") {
          sellerSubtotal += Number(item.item_subtotal);
        } else if (item.owner_type === "supplier") {
          supplierSubtotal += Number(item.item_subtotal);
          supplierGST += Number(item.item_gst);
        }
      });

      const grandTotal = sellerSubtotal + supplierSubtotal + supplierGST;

      setBilling({
        seller_subtotal: sellerSubtotal,
        supplier_subtotal: supplierSubtotal,
        supplier_gst: supplierGST,
        grand_total: grandTotal,
      });
    } catch {
      setCart([]);
      setBilling(null);
      dispatch(setReduxCart([]));
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCart();
  }, []);

  /* ===============================
     UPDATE QUANTITY (MOQ SAFE)
  =============================== */
  const updateQuantity = async (item, newQty) => {
    if (item.owner_type === "supplier" && newQty < item.moq) return;
    if (item.owner_type === "seller" && newQty < 1) return;

    // 🔥 Optimistic UI (cart item)
    setCart((prev) =>
      prev.map((c) =>
        c.cart_id === item.cart_id
          ? {
              ...c,
              quantity: newQty,
              item_subtotal: newQty * c.unit_price,
            }
          : c,
      ),
    );

    try {
      await axios.put(
        `http://localhost:3000/api/cart/update/${item.cart_id}`,
        { quantity: newQty },
        { withCredentials: true },
      );

      // 🔥 THIS IS MISSING (IMPORTANT)
      fetchCart(); // ✅ billing + totals refresh
    } catch {
      fetchCart();
    }
  };

  /* ===============================
     REMOVE ITEM
  =============================== */
  const removeItem = async (item) => {
    // 🔥 1. OPTIMISTIC UI (local cart)
    setCart((prev) => prev.filter((i) => i.cart_id !== item.cart_id));

    // 🔥 2. OPTIMISTIC REDUX UPDATE (Navbar turant update)
    dispatch(
      removeReduxItem({
        product_id: item.product_id,
        owner_type: item.owner_type,
      }),
    );

    try {
      // 🔥 3. BACKEND CALL
      await axios.delete(`http://localhost:3000/api/cart/${item.cart_id}`, {
        withCredentials: true,
      });
    } catch {
      // 🔄 fallback sync
      fetchCart();
    }
  };

  /* ===============================
     UI STATES
  =============================== */
  if (loading) return <h2 className={styles.center}>Loading cart...</h2>;
  if (!cart.length)
    return <h2 className={styles.center}>Your cart is empty 🛒</h2>;

  const hasSupplier = cart.some((i) => i.owner_type === "supplier");

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* LEFT */}
        <div className={styles.left}>
          <button className={styles.backBtn} onClick={() => navigate("/app")}>
            ← Back to Home
          </button>

          {cart.map((item) => {
            const imageUrl = getImageUrl(item.product_image);

            return (
              <div className={styles.card} key={item.cart_id}>
                <div className={styles.imageBox}>
                  {imageUrl ? (
                    <img src={imageUrl} />
                  ) : (
                    <div className={styles.noImage}>No Image</div>
                  )}
                </div>

                <div className={styles.details}>
                  <h3 className={styles.title}>{item.product_name}</h3>
                  <p className={styles.brand}>{item.brand}</p>

                  <span className={styles.ownerBadge}>
                    {item.owner_type === "supplier"
                      ? "Supplier (B2B)"
                      : "Seller (B2C)"}
                  </span>

                  <p className={styles.price}>
                    ₹ {Number(item.unit_price).toLocaleString("en-IN")}
                  </p>

                  {item.owner_type === "supplier" && (
                    <p className={styles.moq}>MOQ: {item.moq}</p>
                  )}

                  <div className={styles.qtyRow}>
                    <button
                      disabled={
                        item.owner_type === "supplier"
                          ? item.quantity <= item.moq
                          : item.quantity <= 1
                      }
                      onClick={() => updateQuantity(item, item.quantity - 1)}
                    >
                      −
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() => updateQuantity(item, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>

                  <p className={styles.subtotal}>
                    Subtotal: ₹{" "}
                    {Number(item.item_subtotal).toLocaleString("en-IN")}
                  </p>

                  <button
                    className={styles.remove}
                    onClick={() => removeItem(item)}
                  >
                    REMOVE
                  </button>
                </div>
              </div>
            );
          })}

          <div className={styles.placeOrderWrap}>
            {hasSupplier && (
              <p
                style={{
                  marginTop: "10px",
                  padding: "10px",
                  background: "#f1f8ff",
                  border: "1px dashed #2874f0",
                  borderRadius: "6px",
                  color: "#0b5ed7",
                  fontSize: "13px",
                }}
              >
                🏭 Supplier items are <strong>self-pickup only</strong>. No
                delivery address is required for these items.
              </p>
            )}
            <button
              className={styles.placeOrderBtn}
              onClick={() => navigate("/app/checkout")}
            >
              Place Order
            </button>
          </div>
        </div>

        {/* RIGHT */}
        <div className={styles.right}>
          <h3>Price Details</h3>

          <div className={styles.priceRow}>
            <span>Seller Items (GST incl.)</span>
            <span>₹ {billing?.seller_subtotal.toLocaleString("en-IN")}</span>
          </div>

          {billing?.supplier_subtotal > 0 && (
            <>
              <div className={styles.priceRow}>
                <span>Supplier Items (GST excl.)</span>
                <span>
                  ₹ {billing?.supplier_subtotal.toLocaleString("en-IN")}
                </span>
              </div>

              <div className={styles.priceRow}>
                <span>GST (Supplier)</span>
                <span>₹ {billing?.supplier_gst.toLocaleString("en-IN")}</span>
              </div>
            </>
          )}

          <div className={styles.totalRow}>
            <span>Total Payable</span>
            <span>₹ {billing?.grand_total.toLocaleString("en-IN")}</span>
          </div>

          {hasSupplier && (
            <p className={styles.gstNote}>
              * Supplier items are billed with GST extra (B2B)
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
