export default function Congrats({ formData }) {
  return (
    <div className="congrats-container">
      <h1 className="success-title">
        Congratulations <span>{formData?.name || ""}!</span> Your basic seller registration is complete.
      </h1>
      <p className="success-subtitle">
        Your free catalog will be listed shortly.<br />
        Meanwhile, you can consider our Paid Listing to grow your business.
      </p>

      <div className="features-grid">
        <div className="feature-box">
          <h4>Visibility</h4>
          <p>More views for your products than your competitors.</p>
        </div>

        <div className="feature-box">
          <h4>Buy Leads</h4>
          <p>Get buyers looking for your products/services.</p>
        </div>

        <div className="feature-box">
          <h4>Buyer Enquiries</h4>
          <p>Receive many more business enquiries via email and call.</p>
        </div>

        <div className="feature-box">
          <h4>Lead Manager</h4>
          <p>Manage all your business enquiries at one place.</p>
        </div>

        <div className="feature-box">
          <h4>Dedicated Account Manager</h4>
          <p>24×7 support specialist to help manage your account.</p>
        </div>

        <div className="feature-box">
          <h4>Preferred Number Service</h4>
          <p>When buyers call, all registered numbers ring simultaneously.</p>
        </div>
      </div>

      <h3 className="offer">
        Avail our Limited Time Offer <span>₹3000 off*</span> on Paid Listing<br />
        + Choose one FREE 6-month subscription from Live Keeping / Vyapar
      </h3>

      <div className="btn-group">
        <button className="primary-btn">I am interested</button>
        <button className="secondary-btn">Skip, I'll check later</button>
      </div>
    </div>
  );
}
