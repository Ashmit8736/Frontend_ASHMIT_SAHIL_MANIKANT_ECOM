import React, { useState, useEffect } from "react";
import styles from "./MarketplaceInsights.module.css";
import { X, TrendingUp, BarChart3, Globe, Tag } from "lucide-react";

const API_BASE = "http://localhost:3000/api/supplier";

const FALLBACK_DATA = {
  risingCategory: { name: "N/A", growth: 0 },
  topRegion: { name: "N/A", percentage: 0 },
  priceTrend: { category: "N/A", growth: 0 },
  modalStats: {
    topCategoryGrowth: 0,
    activeRegionPercent: 0,
    overallDemand: 0,
  },
};

const MarketplaceInsights = () => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(FALLBACK_DATA);

  const [count, setCount] = useState({
    category: 0,
    region: 0,
    demand: 0,
  });

  /* =========================
     FETCH MARKETPLACE DATA
  ========================== */
  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const token = localStorage.getItem("supplierToken");

        const res = await fetch(`${API_BASE}/marketplace/insights`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error(`API Error: ${res.status}`);
        }

        const json = await res.json();

        setData({
          risingCategory: json?.risingCategory ?? FALLBACK_DATA.risingCategory,
          topRegion: json?.topRegion ?? FALLBACK_DATA.topRegion,
          priceTrend: json?.priceTrend ?? FALLBACK_DATA.priceTrend,
          modalStats: json?.modalStats ?? FALLBACK_DATA.modalStats,
        });
      } catch (err) {
        console.error("Marketplace Insights Error:", err);
        setData(FALLBACK_DATA); // 🔒 never crash
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, []);

  /* =========================
     NUMBER ANIMATION (MODAL)
  ========================== */
  useEffect(() => {
    if (showModal) {
      let progress = 0;

      const interval = setInterval(() => {
        progress += 1;

        setCount({
          category: Math.min(
            progress * ((data?.modalStats?.topCategoryGrowth ?? 0) / 100),
            data?.modalStats?.topCategoryGrowth ?? 0
          ),
          region: Math.min(
            progress * ((data?.modalStats?.activeRegionPercent ?? 0) / 100),
            data?.modalStats?.activeRegionPercent ?? 0
          ),
          demand: Math.min(
            progress * ((data?.modalStats?.overallDemand ?? 0) / 100),
            data?.modalStats?.overallDemand ?? 0
          ),
        });

        if (progress >= 100) clearInterval(interval);
      }, 15);

      return () => clearInterval(interval);
    }
  }, [showModal, data]);

  /* =========================
     LOADING STATE
  ========================== */
  if (loading) {
    return (
      <div className={styles.contentArea}>
        <p className={styles.subtitle}>Loading marketplace insights...</p>
      </div>
    );
  }

  return (
    <div className={styles.contentArea}>
      {/* 🔹 Header */}
      <h2 className={styles.title}>Marketplace Insights</h2>
      <p className={styles.subtitle}>
        Live market trends based on your sales data.
      </p>

      {/* 🔹 Insight Cards */}
      <div className={styles.insightGrid}>
        <div className={styles.insightCard}>
          <TrendingUp className={styles.icon} />
          <h3>Rising Category</h3>
          <p>
            {data?.risingCategory?.name || "N/A"} demand increased by{" "}
            <strong>+{data?.risingCategory?.growth ?? 0}%</strong>
          </p>
        </div>

        <div className={styles.insightCard}>
          <Globe className={styles.icon} />
          <h3>Top Buying Region</h3>
          <p>
            {data?.topRegion?.name || "N/A"} leads purchases with{" "}
            <strong>{data?.topRegion?.percentage ?? 0}%</strong>
          </p>
        </div>

        <div className={styles.insightCard}>
          <Tag className={styles.icon} />
          <h3>Price Trends</h3>
          <p>
            Average selling price rose by{" "}
            <strong>+{data?.priceTrend?.growth ?? 0}%</strong> in{" "}
            {data?.priceTrend?.category || "N/A"}
          </p>
        </div>
      </div>

      {/* 🔹 Button */}
      <button className={styles.btn} onClick={() => setShowModal(true)}>
        View Detailed Insights
      </button>

      {/* 🔹 Modal */}
      {showModal && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>Market Analytics Overview</h3>
              <X
                className={styles.closeIcon}
                onClick={() => setShowModal(false)}
              />
            </div>

            <div className={styles.modalBody}>
              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <BarChart3 className={styles.icon} />
                  <h4>Top Category</h4>
                  <p>
                    {data?.risingCategory?.name || "N/A"} (↑{" "}
                    {count.category.toFixed(0)}%)
                  </p>
                </div>

                <div className={styles.statCard}>
                  <Globe className={styles.icon} />
                  <h4>Most Active Region</h4>
                  <p>
                    {data?.topRegion?.name || "N/A"} (
                    {count.region.toFixed(0)}%)
                  </p>
                </div>

                <div className={styles.statCard}>
                  <TrendingUp className={styles.icon} />
                  <h4>Overall Demand</h4>
                  <p>+{count.demand.toFixed(0)}% this month</p>
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                className={styles.closeBtn}
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketplaceInsights;
