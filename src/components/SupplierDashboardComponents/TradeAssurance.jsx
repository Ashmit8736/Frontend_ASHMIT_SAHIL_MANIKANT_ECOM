import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  memo,
} from "react";
import axios from "axios";
import styles from "./TradeAssurance.module.css";
import {
  ShieldCheck,
  FileText,
  CheckCircle,
  AlertTriangle,
  PlusCircle,
  Lightbulb,
  RefreshCcw,
  Mail,
  Download,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const COLORS = ["#00C49F", "#FFBB28", "#FF4444"];

/* =======================
   MEMOIZED CHARTS
======================= */

const PieChartMemo = memo(({ data }) => {
  if (!data.length) return <p className={styles.noData}>No data available</p>;

  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          outerRadius={70}
          isAnimationActive={false}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
});

const LineChartMemo = memo(({ data }) => {
  if (!data.length) return <p className={styles.noData}>No trend data</p>;

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Line
          dataKey="claims"
          stroke="#007bff"
          strokeWidth={2}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
});

/* =======================
   MAIN COMPONENT
======================= */

const TradeAssurance = () => {
  const hasFetched = useRef(false);
  const intervalRef = useRef(null);

  const [showDetails, setShowDetails] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    ongoing: 0,
    resolved: 0,
    pending: 0,
    rejected: 0,
  });

  const [pieData, setPieData] = useState([]);
  const [lineData, setLineData] = useState([]);

  /* =======================
     FETCH STATS
  ======================= */

  const fetchStats = useCallback(async () => {
    const { data } = await axios.get(
      "http://localhost:3000/api/supplier/trade-assurance/stats",
      { withCredentials: true }
    );

    setStats(data);

    setPieData(
      [
        { name: "Resolved", value: data.resolved },
        { name: "Pending", value: data.pending },
        { name: "Rejected", value: data.rejected || 0 },
      ].filter((d) => d.value > 0)
    );
  }, []);

  /* =======================
     FETCH TREND
  ======================= */

  const fetchTrend = useCallback(async () => {
    const { data } = await axios.get(
      "http://localhost:3000/api/supplier/trade-assurance/trend",
      { withCredentials: true }
    );

    setLineData(data.trend || []);
  }, []);

  /* =======================
     INITIAL LOAD (STRICT MODE SAFE)
  ======================= */

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    Promise.all([fetchStats(), fetchTrend()]).finally(() =>
      setLoading(false)
    );
  }, [fetchStats, fetchTrend]);

  /* =======================
     AUTO REFRESH (MODAL ONLY)
  ======================= */

  useEffect(() => {
    if (!autoRefresh || !showDetails) return;

    intervalRef.current = setInterval(() => {
      fetchStats();
      fetchTrend();
    }, 5000);

    return () => clearInterval(intervalRef.current);
  }, [autoRefresh, showDetails, fetchStats, fetchTrend]);

  /* =======================
     EXPORT CSV
  ======================= */

  const exportToCSV = () => {
    if (!lineData.length) return;

    const csv = [
      "Month,Claims",
      ...lineData.map((d) => `${d.month},${d.claims}`),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "TradeAssurance_Report.csv";
    a.click();
  };

  if (loading) {
    return (
      <div className={styles.contentArea}>
        Loading Trade Assurance…
      </div>
    );
  }

  return (
    <div className={styles.contentArea}>
      <div className={styles.card}>
        {/* HEADER */}
        <div className={styles.header}>
          <ShieldCheck className={styles.iconMain} />
          <div>
            <h2>Trade Assurance</h2>
            <p>Secure your transactions with smart dispute resolution.</p>
          </div>
        </div>

        {/* STATS */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <AlertTriangle className={styles.icon} />
            <h4>Ongoing Claims</h4>
            <p>{stats.ongoing}</p>
          </div>

          <div className={styles.statCard}>
            <CheckCircle className={styles.icon} />
            <h4>Resolved</h4>
            <p>{stats.resolved}</p>
          </div>

          <div className={styles.statCard}>
            <FileText className={styles.icon} />
            <h4>Pending</h4>
            <p>{stats.pending}</p>
          </div>
        </div>

        {/* TIP */}
        <div className={styles.tipBox}>
          <Lightbulb className={styles.tipIcon} />
          <p>Faster resolution increases buyer trust & conversion.</p>
        </div>

        <button className={styles.btn} onClick={() => setShowDetails(true)}>
          <PlusCircle size={18} /> View Insights
        </button>

        {/* MODAL */}
        {showDetails && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <div className={styles.modalHeader}>
                <h3>Trade Assurance Analytics</h3>

                <div className={styles.toggleWrap}>
                  <label className={styles.switch}>
                    <input
                      type="checkbox"
                      checked={autoRefresh}
                      onChange={() => setAutoRefresh(!autoRefresh)}
                    />
                    <span className={styles.slider}></span>
                  </label>

                  {autoRefresh && (
                    <RefreshCcw
                      className={`${styles.refreshIcon} ${styles.spin}`}
                    />
                  )}
                </div>

                <button
                  className={styles.closeBtn}
                  onClick={() => {
                    setAutoRefresh(false);
                    setShowDetails(false);
                  }}
                >
                  ×
                </button>
              </div>

              <div className={styles.chartGrid}>
                <div className={styles.chartBox}>
                  <h4>Claim Resolution Ratio</h4>
                  <PieChartMemo data={pieData} />
                </div>

                <div className={styles.chartBox}>
                  <h4>Claims Growth Trend</h4>
                  <LineChartMemo data={lineData} />
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button onClick={exportToCSV} className={styles.exportBtn}>
                  <Download size={16} /> Export CSV
                </button>
                {/* <button className={styles.emailBtn}>
                  <Mail size={16} /> Email Report
                </button> */}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TradeAssurance;
