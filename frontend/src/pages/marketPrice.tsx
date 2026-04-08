import { useState } from "react";
import { getMarketPrice } from "../services/marketPrice";
import { Bar } from "react-chartjs-2";
import { motion } from "framer-motion";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title);

// ── Icons ────────────────────────────────────────────────────────

const IconSearch = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M10 10l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// ── Component ────────────────────────────────────────────────────

const MarketPriceComponent = () => {
  const [state,       setState]       = useState("");
  const [district,    setDistrict]    = useState("");
  const [cropName,    setCropName]    = useState("");
  const [priceData,   setPriceData]   = useState<any>(null);
  const [priceTrends, setPriceTrends] = useState<any>(null);
  const [error,       setError]       = useState<string | null>(null);
  const [warning,     setWarning]     = useState<string | null>(null);
  const [loading,     setLoading]     = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPriceData(null);
    setPriceTrends(null);
    setError(null);
    setWarning(null);
    setLoading(true);

    const formattedState    = state.trim();
    const formattedDistrict = district.trim();
    const formattedCropName = cropName.trim().toUpperCase();

    if (cropName !== formattedCropName) {
      setWarning("Crop name converted to uppercase automatically.");
    }

    const data = { state: formattedState, district: formattedDistrict, crop_name: formattedCropName };

    try {
      const result = await getMarketPrice(data);
      if (result.crop_prices) {
        setPriceData(result.crop_prices);
      } else {
        setError(result.error || "Unexpected error occurred.");
      }
      if (result.price_trends) {
        setPriceTrends(result.price_trends);
      }
    } catch {
      setError("Failed to fetch market prices. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const hasResults = (priceData || priceTrends) && !loading;

  // Build chart data — show max 14 entries, side-by-side bars
  const chartData = priceTrends
    ? (() => {
        const slice = priceTrends.slice(-14);
        return {
          labels: slice.map((e: any) => {
            const d = e.Date;
            try {
              const parts = d.split("/");
              if (parts.length === 3) {
                const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
                return `${months[parseInt(parts[1]) - 1]} ${parts[0]}`;
              }
            } catch {}
            return d;
          }),
          datasets: [
            {
              label: "Max Price (₹)",
              data: slice.map((e: any) => e.MaxPrice),
              backgroundColor: "rgba(58,107,71,0.82)",
              borderColor: "rgba(58,107,71,1)",
              borderWidth: 1.5,
              borderRadius: 5,
              borderSkipped: false,
            },
            {
              label: "Min Price (₹)",
              data: slice.map((e: any) => e.MinPrice),
              backgroundColor: "rgba(196,154,74,0.78)",
              borderColor: "rgba(196,154,74,1)",
              borderWidth: 1.5,
              borderRadius: 5,
              borderSkipped: false,
            },
          ],
        };
      })()
    : null;

  const chartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index" as const, intersect: false },
    plugins: {
      legend: {
        position: "top" as const,
        align: "start" as const,
        labels: {
          font: { family: "DM Sans, sans-serif", size: 12, weight: "600" },
          color: "#2c2820",
          boxWidth: 10,
          boxHeight: 10,
          borderRadius: 3,
          padding: 18,
          usePointStyle: true,
          pointStyle: "rectRounded",
        },
      },
      tooltip: {
        backgroundColor: "#ffffff",
        titleColor: "#1e1a14",
        bodyColor: "#3d3730",
        borderColor: "#d4cec4",
        borderWidth: 1,
        titleFont: { family: "DM Sans, sans-serif", weight: "700", size: 13 },
        bodyFont: { family: "DM Sans, sans-serif", size: 12 },
        padding: 14,
        cornerRadius: 10,
        callbacks: {
          label: (ctx: any) => ` ₹${ctx.parsed.y.toLocaleString("en-IN")}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: {
          font: { family: "DM Sans, sans-serif", size: 10 },
          color: "#6b6258",
          // No rotation needed — landscape gives plenty of horizontal room
          maxRotation: 0,
        },
      },
      y: {
        grid: { color: "rgba(0,0,0,0.05)", drawBorder: false },
        border: { display: false, dash: [4, 4] },
        ticks: {
          font: { family: "DM Sans, sans-serif", size: 11 },
          color: "#6b6258",
          callback: (v: any) => `₹${Number(v).toLocaleString("en-IN")}`,
        },
      },
    },
  };

  return (
    <div className="page-wrapper">
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 20px 72px" }}>

        {/* Page header */}
        <div style={{ marginBottom: 40 }}>
          <span className="section-label" style={{ display: "block", marginBottom: 8 }}>Market Intelligence · data.gov.in</span>
          <h1 className="display-heading" style={{ fontSize: "clamp(26px, 3.5vw, 38px)", fontWeight: 600, margin: 0 }}>
            Market Price Trends
          </h1>
          <p style={{ fontSize: 15, color: "var(--text-secondary)", marginTop: 10, maxWidth: 520, lineHeight: 1.75 }}>
            Query historical mandi prices by state, district, and commodity.
            Compare max vs. min prices to understand market spread and time your selling decisions.
          </p>
        </div>

        {/* Layout: stacked on mobile, sidebar on desktop */}
        <div className="market-grid">

          {/* ── Filter form ── */}
          <div style={{
            background: "var(--bg-surface)",
            border: "1px solid var(--border-default)",
            borderRadius: "var(--radius-lg)",
            padding: "28px",
            boxShadow: "var(--shadow-card)",
            height: "fit-content",
          }}>
            <p style={{
              fontSize: 11, fontWeight: 700, letterSpacing: "0.1em",
              textTransform: "uppercase", color: "var(--text-muted)", margin: "0 0 20px",
            }}>
              Search Filters
            </p>

            <form onSubmit={handleSubmit} noValidate>
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

                <div>
                  <label className="field-label" htmlFor="mkt-state">State</label>
                  <input
                    id="mkt-state" type="text" value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="field-input" placeholder="e.g. Karnataka" required
                  />
                </div>

                <div>
                  <label className="field-label" htmlFor="mkt-district">
                    District
                    <span style={{ fontWeight: 400, marginLeft: 6, fontSize: 11, color: "var(--text-muted)", textTransform: "none", letterSpacing: 0 }}>
                      (optional)
                    </span>
                  </label>
                  <input
                    id="mkt-district" type="text" value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="field-input" placeholder="e.g. Mysuru"
                  />
                </div>

                <div>
                  <label className="field-label" htmlFor="mkt-crop">Commodity</label>
                  <input
                    id="mkt-crop" type="text" value={cropName}
                    onChange={(e) => setCropName(e.target.value)}
                    className="field-input" placeholder="e.g. WHEAT" required
                  />
                  <p style={{ fontSize: 11, color: "var(--text-muted)", margin: "5px 0 0" }}>
                    Enter in uppercase — auto-converted
                  </p>
                </div>

                {warning && (
                  <div style={{
                    padding: "10px 14px",
                    background: "#fffbec", border: "1px solid #e8d588",
                    borderRadius: "var(--radius-sm)", fontSize: 12, color: "#7a6010",
                  }}>
                    {warning}
                  </div>
                )}

                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                  style={{ justifyContent: "center", padding: "11px", fontSize: 14 }}
                >
                  {loading ? (
                    <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Fetching…</>
                  ) : (
                    <><IconSearch /> Search prices</>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* ── Results ── */}
          {hasResults && (
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              style={{ display: "flex", flexDirection: "column", gap: 20 }}
            >
              {/* Price cards */}
              {priceData && (
                <div>
                  <p style={{
                    fontSize: 11, fontWeight: 700, letterSpacing: "0.1em",
                    textTransform: "uppercase", color: "var(--text-muted)", margin: "0 0 14px",
                  }}>
                    Price Records — {priceData.length} result{priceData.length !== 1 ? "s" : ""}
                  </p>
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                    gap: 12, maxHeight: 320, overflowY: "auto", paddingRight: 2,
                  }}>
                    {priceData.map((price: any, i: number) => {
                      const spread = price.MaxPrice - price.MinPrice;
                      const volatility = spread > 200 ? "high" : spread > 80 ? "moderate" : "stable";
                      const vColor = volatility === "high" ? "#b33" : volatility === "moderate" ? "#8a6a00" : "#3a6b47";
                      const vBg    = volatility === "high" ? "#fff0ee" : volatility === "moderate" ? "#fffbec" : "#e2ede0";
                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05, duration: 0.35 }}
                          style={{
                            background: "var(--bg-surface)",
                            border: "1px solid var(--border-default)",
                            borderRadius: "var(--radius-md)",
                            padding: "16px",
                            boxShadow: "var(--shadow-card)",
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                            <div>
                              <p style={{ fontSize: 14, fontWeight: 700, color: "var(--color-soil)", margin: 0 }}>{price.Commodity}</p>
                              <p style={{ fontSize: 11, color: "var(--text-muted)", margin: "2px 0 0" }}>
                                {price.State}{price.District ? ` · ${price.District}` : ""}
                              </p>
                            </div>
                            <span style={{
                              fontSize: 9, fontWeight: 700, textTransform: "uppercase",
                              letterSpacing: "0.07em", padding: "3px 8px",
                              borderRadius: 99, background: vBg, color: vColor,
                              border: `1px solid ${vColor}33`,
                            }}>{volatility}</span>
                          </div>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                            {[
                              { label: "Max", value: price.MaxPrice, color: "#3a6b47", bg: "#e2ede0" },
                              { label: "Min", value: price.MinPrice, color: "#b33",    bg: "#fff0ee" },
                            ].map((p) => (
                              <div key={p.label} style={{
                                background: p.bg, borderRadius: "var(--radius-sm)",
                                padding: "10px", textAlign: "center",
                              }}>
                                <p style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: p.color, margin: "0 0 3px" }}>{p.label}</p>
                                <p style={{ fontSize: 17, fontWeight: 800, color: "var(--color-soil)", margin: 0, fontFamily: "var(--font-display)" }}>
                                  ₹{Number(p.value).toLocaleString("en-IN")}
                                </p>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ── Bar Chart ── */}
              {chartData && (
                <div style={{
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border-default)",
                  borderRadius: "var(--radius-lg)",
                  padding: "24px",
                  boxShadow: "var(--shadow-card)",
                }}>
                  <div style={{ marginBottom: 16 }}>
                    <p style={{
                      fontSize: 11, fontWeight: 700, letterSpacing: "0.1em",
                      textTransform: "uppercase", color: "var(--text-muted)", margin: "0 0 3px",
                    }}>Price Trend</p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                      <p style={{ fontSize: 15, fontWeight: 700, color: "var(--color-soil)", margin: 0 }}>
                        Max vs. Min — Last {priceTrends.slice(-14).length} Entries
                      </p>
                      <div style={{ display: "flex", gap: 10 }}>
                        {[
                          { label: "Max", color: "#3a6b47" },
                          { label: "Min", color: "#c49a4a" },
                        ].map((l) => (
                          <span key={l.label} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "var(--text-secondary)", fontWeight: 600 }}>
                            <span style={{ width: 10, height: 10, borderRadius: 3, background: l.color, display: "block" }} />
                            {l.label}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/*
                    ── Mobile landscape chart ──
                    On mobile (≤600px), the inner div is sized as a tall portrait box
                    (56vw × 88vw) then rotated 90°. After rotation its perceived dimensions
                    swap to 88vw wide × 56vw tall — a landscape canvas with no scrolling.
                    The wrapper is set to 56vw tall to match the rotated element's height.
                    On desktop (>600px) no rotation is applied; the class falls back to
                    normal full-width layout via the media query below.
                  */}
                  <div className="chart-rotate-wrapper">
                    <div className="chart-rotate-inner">
                      <Bar data={chartData} options={chartOptions} />
                    </div>
                  </div>

                  {/* Summary stats */}
                  {priceTrends && priceTrends.length > 0 && (() => {
                    const maxPrices = priceTrends.map((e: any) => e.MaxPrice);
                    const minPrices = priceTrends.map((e: any) => e.MinPrice);
                    const avg = (arr: number[]) => Math.round(arr.reduce((a: number, b: number) => a + b, 0) / arr.length);
                    return (
                      <div style={{
                        marginTop: 18,
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
                        gap: 10,
                        paddingTop: 18,
                        borderTop: "1px solid var(--border-default)",
                      }}>
                        {[
                          { label: "Avg Max",  value: `₹${avg(maxPrices).toLocaleString("en-IN")}` },
                          { label: "Avg Min",  value: `₹${avg(minPrices).toLocaleString("en-IN")}` },
                          { label: "Peak",     value: `₹${Math.max(...maxPrices).toLocaleString("en-IN")}` },
                          { label: "Floor",    value: `₹${Math.min(...minPrices).toLocaleString("en-IN")}` },
                        ].map((s) => (
                          <div key={s.label} style={{ textAlign: "center" }}>
                            <p style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 3px" }}>{s.label}</p>
                            <p style={{ fontSize: 16, fontWeight: 700, color: "var(--color-soil)", margin: 0, fontFamily: "var(--font-display)" }}>{s.value}</p>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              )}
            </motion.div>
          )}

          {/* Error */}
          {error && !loading && (
            <div style={{
              background: "#fff8f7", border: "1px solid #f5c6c2",
              borderRadius: "var(--radius-lg)", padding: "28px",
            }}>
              <p style={{ fontWeight: 700, fontSize: 14, color: "#a33", margin: "0 0 6px" }}>No results found</p>
              <p style={{ fontSize: 13, color: "#b55", margin: 0 }}>{error}</p>
            </div>
          )}

        </div>

        {/* Data note */}
        <div style={{
          marginTop: 36, padding: "16px 20px",
          background: "var(--bg-subtle)", border: "1px solid var(--border-default)",
          borderRadius: "var(--radius-md)", fontSize: 12, color: "var(--text-muted)", lineHeight: 1.65,
        }}>
          <strong style={{ color: "var(--text-secondary)" }}>Data source:</strong> Historical mandi prices from data.gov.in.
          These are not live prices. Verify with your local mandi before making selling decisions.
          Chart shows the most recent 14 entries for readability.
        </div>

      </div>

      <style>{`
        .market-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
        }
        @media (min-width: 820px) {
          .market-grid {
            grid-template-columns: 280px 1fr;
            align-items: start;
          }
        }

        /* ─────────────────────────────────────────
           MOBILE  ≤ 600px  →  landscape rotation
           How it works:
             - .chart-rotate-inner is sized portrait: W=56vw, H=88vw
             - rotate(90deg) swaps its perceived dimensions
             - apparent result: 88vw wide × 56vw tall  ← landscape!
             - .chart-rotate-wrapper height = 56vw to match
        ───────────────────────────────────────── */
        .chart-rotate-wrapper {
          overflow: visible;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        @media (max-width: 600px) {
          .chart-rotate-wrapper {
            height: 56vw;
            margin: 8px 0;
          }
          .chart-rotate-inner {
            width: 56vw;
            height: 88vw;
            transform: rotate(90deg);
            transform-origin: center center;
            flex-shrink: 0;
          }
        }

        /* DESKTOP  > 600px  →  normal layout, no rotation */
        @media (min-width: 601px) {
          .chart-rotate-inner {
            width: 100%;
            height: clamp(220px, 45vw, 320px);
          }
        }

        /* Thin scrollbar */
        ::-webkit-scrollbar { width: 5px; height: 4px; }
        ::-webkit-scrollbar-thumb { background: var(--border-strong); border-radius: 2px; }
      `}</style>
    </div>
  );
};

export default MarketPriceComponent;