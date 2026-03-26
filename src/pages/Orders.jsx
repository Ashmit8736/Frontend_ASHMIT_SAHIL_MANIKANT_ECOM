import React, { useState, useEffect } from "react";
import styles from "./Orders.module.css";
import api from "../store/APi/axiosInstance";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const ORDERS_PER_PAGE = 5; // Ek page pe kitne orders dikhane hain

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [cancelReason, setCancelReason] = useState("");
  const [showCancelInput, setShowCancelInput] = useState(false);

  // ✅ PAGINATION STATE
  const [currentPage, setCurrentPage] = useState(1);

  /* 🔒 BODY LOCK */
  useEffect(() => {
    document.body.classList.toggle("modalOpen", !!selectedOrder);
    return () => document.body.classList.remove("modalOpen");
  }, [selectedOrder]);

  /* 🔥 FETCH ORDERS */
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/checkout/orders");
        if (res.data.success) setOrders(res.data.data || []);
      } catch (err) {
        console.error("ORDERS FETCH ERROR:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  /* 🧠 GROUP BY ORDER */
  const groupedOrders = Object.values(
    orders.reduce((acc, row) => {
      if (!acc[row.order_id]) {
        acc[row.order_id] = {
          order_id: row.order_id,
          created_at: row.created_at,
          order_status: row.order_status,
          total_amount: row.total_amount,
          fulfillment_type: row.fulfillment_type,
          items: [],
        };
      }
      acc[row.order_id].items.push(row);
      return acc;
    }, {})
  ).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  // ✅ PAGINATION CALCULATIONS
  const totalPages = Math.ceil(groupedOrders.length / ORDERS_PER_PAGE);
  const startIndex = (currentPage - 1) * ORDERS_PER_PAGE;
  const endIndex = startIndex + ORDERS_PER_PAGE;
  const currentOrders = groupedOrders.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* 🔄 LOADING */
  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.center}>Loading orders...</div>
      </div>
    );
  }

  /* 📦 EMPTY STATE */
  if (!groupedOrders.length) {
    return (
      <div className={styles.page}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <button className={styles.backBtn} onClick={() => navigate("/app")}>
              ← Back to Home
            </button>
          </div>
          <div className={styles.headerCenter}>
            <h2>My Orders</h2>
          </div>
        </div>
        <div className={styles.center}>
          <h3>No orders found 📦</h3>
          <p>You haven't placed any orders yet</p>
        </div>
      </div>
    );
  }

  /* ❌ CANCEL ORDER */
  const handleCancelOrder = async (orderId, e) => {
    e.stopPropagation();

    if (!cancelReason.trim()) {
      toast.error("Please enter cancellation reason!");
      return;
    }

    try {
      await api.put(`/checkout/order/${orderId}/cancel`, {
        reason: cancelReason.trim(),
      });
      setOrders((prev) =>
        prev.map((o) =>
          o.order_id === orderId ? { ...o, order_status: "cancelled" } : o
        )
      );
      setSelectedOrder(null);
      setShowCancelInput(false);
      setCancelReason("");
      toast.success("Order cancelled successfully!");
    } catch (err) {
      toast.error("Cancel failed! Please try again.");
    }
  };

  return (
    <div className={styles.page}>
      <Toaster position="top-right" />

      {/* HEADER */}
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate("/app")}>
          ← Back to Home
        </button>
        <h2>My Orders</h2>
      </div>

      {/* ORDER LIST */}
      <div className={styles.container}>
        {currentOrders.map((order) => {
          const firstItem = order.items[0];

          return (
            <div
              key={order.order_id}
              className={styles.card}
              onClick={() => {
                setShowCancelInput(false);  // ✅ Yeh add karo
                setCancelReason("");         // ✅ Yeh add karo
                setSelectedOrder(order);
              }}
            >
              <img
                src={firstItem?.product_image || "/no-image.png"}
                alt="product"
              />

              <div className={styles.details}>
                <h4>{firstItem?.product_name}</h4>
                <p>
                  {order.items.length} item(s) • Order #{order.order_id}
                </p>
                <span>
                  {new Date(order.created_at).toLocaleDateString("en-IN")}
                </span>
              </div>

              <div className={styles.metaRight}>
                <strong>
                  ₹{Number(order.total_amount).toLocaleString("en-IN")}
                </strong>

                <span
                  className={
                    order.fulfillment_type === "pickup"
                      ? styles.pickupBadge
                      : styles.codBadge
                  }
                >
                  {order.fulfillment_type === "pickup" ? "Self Pickup" : "COD"}
                </span>

                <span
                  className={`${styles.status} ${styles[order.order_status]}`}
                >
                  {order.order_status}
                </span>

                {/* ✅ CANCEL BUTTON ON CARD */}
                {!["cancelled", "delivered", "shipped"].includes(
                  order.order_status
                ) && (
                    <button
                      className={styles.cancelCardBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowCancelInput(false);  // ✅ Yeh add karo
                        setCancelReason("");         // ✅ Yeh add karo
                        setSelectedOrder(order);
                      }}
                    >
                      ❌ Cancel
                    </button>
                  )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ✅ PAGINATION */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          {/* PREV BUTTON */}
          <button
            className={styles.pageBtn}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            ← Prev
          </button>

          {/* PAGE COUNT */}
          <span className={styles.pageCount}>
            Page {currentPage} of {totalPages}
          </span>

          {/* NEXT BUTTON */}
          <button
            className={styles.pageBtn}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next →
          </button>
        </div>
      )}

      {/* ORDERS COUNT INFO */}
      <p className={styles.pageInfo}>
        Showing {startIndex + 1}–{Math.min(endIndex, groupedOrders.length)} of{" "}
        {groupedOrders.length} orders
      </p>

      {/* MODAL */}
      {selectedOrder && (
        <div className={styles.overlay} onClick={() => setSelectedOrder(null)}>
          <div
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <div>
                <h3>Order #{selectedOrder.order_id}</h3>
                <span className={styles.modalSub}>
                  {selectedOrder.fulfillment_type === "pickup"
                    ? "Self Pickup Order"
                    : "Delivery Order"}
                </span>
              </div>
              <button
                className={styles.close}
                onClick={() => {
                  setSelectedOrder(null);
                  setShowCancelInput(false);
                  setCancelReason("");
                }}
              >
                ×
              </button>
            </div>

            <p className={styles.subText}>
              Placed on{" "}
              {new Date(selectedOrder.created_at).toLocaleDateString("en-IN")}
            </p>

            {selectedOrder.items.map((item, idx) => (
              <div key={idx} className={styles.modalRow}>
                <img src={item.product_image || "/no-image.png"} alt="" />
                <div>
                  <h4>{item.product_name}</h4>
                  <p>
                    Qty: {item.quantity} • ₹
                    {Number(item.subtotal).toLocaleString("en-IN")}
                  </p>
                  <span
                    className={`${styles.status} ${styles[item.item_status || "placed"]
                      }`}
                  >
                    {item.item_status || "Placed"}
                  </span>
                  <span
                    className={
                      item.owner_type === "supplier"
                        ? styles.supplierBadge
                        : styles.sellerBadge
                    }
                  >
                    {item.owner_type === "supplier"
                      ? "Supplier Item"
                      : "Seller Item"}
                  </span>
                </div>
              </div>
            ))}

            <div className={styles.totalBox}>
              <strong>Total Amount</strong>
              <strong>
                ₹{Number(selectedOrder.total_amount).toLocaleString("en-IN")}
              </strong>
            </div>

            {/* ✅ CANCEL SECTION IN MODAL */}
            {!["cancelled", "delivered", "shipped"].includes(
              selectedOrder.order_status
            ) && (
                <div className={styles.cancelSection}>
                  {!showCancelInput ? (
                    <button
                      className={styles.cancelOrderBtn}
                      onClick={() => setShowCancelInput(true)}
                    >
                      ❌ Cancel Order
                    </button>
                  ) : (
                    <div className={styles.cancelBox}>
                      <p className={styles.cancelLabel}>Reason for cancellation</p>
                      <textarea
                        className={styles.cancelTextarea}
                        rows={3}
                        placeholder="Please enter reason..."
                        value={cancelReason}
                        onChange={(e) => setCancelReason(e.target.value)}
                      />
                      <div className={styles.cancelActions}>
                        <button
                          className={styles.confirmCancelBtn}
                          onClick={(e) =>
                            handleCancelOrder(selectedOrder.order_id, e)
                          }
                        >
                          Confirm Cancel
                        </button>
                        <button
                          className={styles.goBackBtn}
                          onClick={() => {
                            setShowCancelInput(false);
                            setCancelReason("");
                          }}
                        >
                          Go Back
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;