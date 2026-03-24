import { useLocation, useNavigate } from "react-router-dom";
import styles from "./OrderSuccess.module.css";

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const order = location.state;

  /* 🔒 SAFETY: PAGE REFRESH CASE */
  if (!order) {
    return (
      <div className={styles.successContainer}>
        <div className={styles.card}>
          <h2>Order Placed Successfully 🎉</h2>
          <p>Order details not found.</p>

          <button onClick={() => navigate("/app/orders")}>
            Go to My Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.successContainer}>
      <div className={styles.card}>
        <h2>Order Placed Successfully 🎉</h2>
        <p className={styles.orderId}>Order ID: #{order.order_id}</p>

        {/* 📦 ITEMS */}
        <div className={styles.items}>
          {order.items?.map((item, i) => (
            <div key={i} className={styles.itemRow}>
              <span>
                {item.quantity} × ₹
                {Number(item.unit_price).toLocaleString("en-IN")}
              </span>
              <strong>
                ₹{Number(item.subtotal).toLocaleString("en-IN")}
              </strong>
            </div>
          ))}
        </div>

        {/* 💰 TOTAL */}
        <div className={styles.totalBox}>
          <span>Total Amount</span>
          <h3>
            ₹{Number(order.total_amount).toLocaleString("en-IN")}
          </h3>
        </div>

        {/* CTA */}
        <div className={styles.actions}>
          <button onClick={() => navigate("/app/orders")}>
            View My Orders
          </button>
          <button
            className={styles.secondary}
            onClick={() => navigate("/app")}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
