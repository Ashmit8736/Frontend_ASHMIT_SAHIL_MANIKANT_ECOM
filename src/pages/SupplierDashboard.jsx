import React, { useState } from "react";
import styles from "../PagesStyles/SupplierDashboard.module.css";
import Sidebar from "../components/SupplierDashboardComponents/Sidebar";
import Header from "../components/SupplierDashboardComponents/Header";

// Pages
import DashboardOverview from "../components/SupplierDashboardComponents/DashboardOverview";
import ProductManagement from "../components/SupplierDashboardComponents/ProductManagement";
import OrderManagement from "../components/SupplierDashboardComponents/OrderManagement";
import MarketplaceInsights from "../components/SupplierDashboardComponents/MarketplaceInsights";
import FinancePayouts from "../components/SupplierDashboardComponents/FinancePayouts";
import TradeAssurance from "../components/SupplierDashboardComponents/TradeAssurance";
import SupplierProfile from "../components/SupplierDashboardComponents/SupplierProfile";
import MessagingCenter from "../components/SupplierDashboardComponents/MessagingCenter";
import Settings from "../components/SupplierDashboardComponents/Settings";

const SupplierDashboard = () => {
  const [activePage, setActivePage] = useState("dashboard");

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <DashboardOverview />;
      case "product":
        return <ProductManagement />;
      case "order":
        return <OrderManagement />;
      case "insights":
        return <MarketplaceInsights />;
      case "finance":
        return <FinancePayouts />;
      case "assurance":
        return <TradeAssurance />;
      case "profile":
        return <SupplierProfile />;
      case "messaging":
        return <MessagingCenter />;
      case "settings":
        return <Settings />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className={styles.dashboard}>
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <div className={styles.main}>
        <Header />
        <div className={styles.contentArea}>{renderPage()}</div>
      </div>
    </div>
  );
};

export default SupplierDashboard;
