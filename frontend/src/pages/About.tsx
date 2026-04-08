import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

// ─────────────────────────────────────────────────────────────────
// DATA
// -----------------------------------------------------------------

const FEATURES = [
  {
    title:    "Crop Recommendation",
    body:     "A Random Forest model trained on the Kaggle crop prediction dataset analyzes NPK levels, pH, humidity, temperature, and rainfall to return the most suitable crop for your field.",
    accent:   "#3a6b47",
    accentBg: "#e2ede0",
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M11 20V11M11 11C11 11 6 8 4 3c4 0 7 3 7 8zM11 11c0 0 5-3 7-8-4 0-7 3-7 8z"
          stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    title:    "Weather Forecast",
    body:     "Connects to the OpenWeatherMap API to display a real-time 7-day forecast including temperature, humidity, wind speed, and precipitation — filtered by the farmer's exact location.",
    accent:   "#2a5a8a",
    accentBg: "#e0eaf5",
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M16 10h-1.1A7 7 0 1 0 8 18h8a4.5 4.5 0 0 0 0-9z"
          stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    title:    "Market Price Trends",
    body:     "Uses a dataset sourced from data.gov.in to display historical mandi prices by state, district, and commodity. Interactive charts let farmers analyze price volatility over time.",
    accent:   "#8a5a1a",
    accentBg: "#f5ede0",
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <polyline points="3 16 8 11 12 14 19 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="3" y1="20" x2="19" y2="20" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
  },
];

const STACK = [
  { layer: "Frontend",  items: ["React + TypeScript", "Vite", "Tailwind CSS", "Framer Motion", "Chart.js"] },
  { layer: "Backend",   items: ["Flask (Python)", "REST API", "Axios"] },
  { layer: "AI / Data", items: ["Random Forest (scikit-learn)", "Kaggle crop dataset", "data.gov.in market data"] },
  { layer: "APIs",      items: ["OpenWeatherMap", "Render (hosting)"] },
];

const WORKFLOW_STEPS = [
  {
    step:  "Input",
    desc:  "Farmer enters soil parameters — N, P, K, pH, humidity, temperature, rainfall — or their location for weather data.",
    color: "#3a6b47",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M9 16V9M9 9C9 9 5 7 4 3c3 0 5 2 5 6zM9 9c0 0 4-2 5-6-3 0-5 2-5 6z"
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    step:  "Process",
    desc:  "Flask backend receives the request, runs input validation, then routes data to the appropriate model or external API.",
    color: "#2a5a8a",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="3" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M9 2v2M9 14v2M2 9h2M14 9h2M4.2 4.2l1.4 1.4M12.4 12.4l1.4 1.4M4.2 13.8l1.4-1.4M12.4 5.6l1.4-1.4"
          stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    step:  "Model",
    desc:  "The Random Forest model scores crop suitability against training data. Market queries are filtered from the data.gov.in dataset.",
    color: "#7a3a8a",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="2" y="2" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.4"/>
        <rect x="10" y="2" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.4"/>
        <rect x="2" y="10" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.4"/>
        <circle cx="13" cy="13" r="3" stroke="currentColor" strokeWidth="1.4"/>
      </svg>
    ),
  },
  {
    step:  "Output",
    desc:  "Recommendations, 7-day weather cards, and interactive price charts are returned and rendered in the React frontend.",
    color: "#8a5a1a",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M9 2v10M5 8l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M3 14h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
];

const FUTURE = [
  "Multi-language support — Hindi, Kannada, Tamil",
  "Offline-first mode for low-connectivity farm zones",
  "SMS weather alerts for critical climate events",
  "Satellite imagery integration for field health scoring",
  "Community price reporting from local mandis",
];

const TABS = ["About System", "Workflow & Vision"] as const;
type Tab = typeof TABS[number];

// ─────────────────────────────────────────────────────────────────
// ABOUT PAGE
// -----------------------------------------------------------------

export default function About() {
  const [activeTab, setActiveTab] = useState<Tab>("About System");

  const fadeSlide = {
    initial:    { opacity: 0, y: 16 },
    animate:    { opacity: 1, y: 0 },
    exit:       { opacity: 0, y: -12 },
    transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] as any },
  };

  return (
    <div className="page-wrapper" style={{ background: "var(--bg-page)" }}>

      {/* ── Page header ── */}
      <div style={{
        background: "var(--bg-surface)",
        borderBottom: "1px solid var(--border-default)",
        padding: "52px 20px 0",
      }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
          >
            <span className="section-label" style={{ display: "block", marginBottom: 10 }}>About</span>
            <h1 className="display-heading" style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 600, marginBottom: 12 }}>
              FarmingAI Platform
            </h1>
            <p style={{ fontSize: 16, color: "var(--text-secondary)", maxWidth: 520, marginBottom: 36, lineHeight: 1.75 }}>
              An AI-driven agricultural advisory system bridging the gap between
              traditional farming and data-informed decision-making.
            </p>
          </motion.div>

          {/* Tab bar */}
          <div style={{ display: "flex", gap: 0, marginBottom: -1, overflowX: "auto" }}>
            {TABS.map((tab) => {
              const active = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: "12px 20px",
                    fontFamily: "var(--font-body)",
                    fontSize: 14,
                    fontWeight: active ? 600 : 500,
                    color: active ? "var(--accent-primary)" : "var(--text-muted)",
                    background: "none",
                    border: "none",
                    borderBottom: active ? "2.5px solid var(--accent-primary)" : "2.5px solid transparent",
                    cursor: "pointer",
                    transition: "color 0.2s, border-color 0.2s",
                    outline: "none",
                    whiteSpace: "nowrap",
                    letterSpacing: "0.01em",
                  }}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Tab content ── */}
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "52px 20px 72px" }}>
        <AnimatePresence mode="wait">

          {/* ════════════════════════════════════
              TAB 1 — About System
          ════════════════════════════════════ */}
          {activeTab === "About System" && (
            <motion.div key="about" {...fadeSlide}>

              {/* What + Problem grid */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))",
                gap: 28, marginBottom: 56,
              }}>
                <div>
                  <span className="section-label" style={{ display: "block", marginBottom: 12 }}>What It Is</span>
                  <h2 className="display-heading" style={{ fontSize: "clamp(20px, 2.8vw, 28px)", fontWeight: 600, marginBottom: 14 }}>
                    A complete farming intelligence layer.
                  </h2>
                  <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.85 }}>
                    FarmingAI is a web-based advisory platform that unifies three
                    data sources — soil science, live weather, and market history — so
                    small and medium farmers across India can make better decisions
                    before, during, and after a growing season.
                  </p>
                </div>

                <div style={{
                  background: "var(--bg-subtle)",
                  border: "1px solid var(--border-default)",
                  borderRadius: "var(--radius-lg)",
                  padding: "26px",
                }}>
                  <span className="section-label" style={{ display: "block", marginBottom: 14 }}>The Problem It Solves</span>
                  {[
                    "Farmers lack access to soil-specific crop guidance",
                    "Weather data is scattered and hard to act on",
                    "Market prices are opaque until after planting decisions",
                  ].map((p, i) => (
                    <motion.div
                      key={p}
                      style={{ display: "flex", gap: 10, marginBottom: 14 }}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1, duration: 0.4 }}
                    >
                      <div style={{
                        width: 7, height: 7, borderRadius: "50%",
                        background: "var(--accent-primary)", flexShrink: 0, marginTop: 8,
                      }} />
                      <p style={{ fontSize: 14, color: "var(--text-primary)", margin: 0, lineHeight: 1.7 }}>{p}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Feature cards */}
              <span className="section-label" style={{ display: "block", marginBottom: 16 }}>Core Modules</span>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: 16, marginBottom: 52,
              }}>
                {FEATURES.map((f, i) => (
                  <motion.div
                    key={f.title}
                    className="card"
                    initial={{ opacity: 0, y: 22 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.11, duration: 0.5 }}
                  >
                    <div style={{
                      width: 42, height: 42, borderRadius: "var(--radius-sm)",
                      background: f.accentBg,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: f.accent, marginBottom: 16,
                    }}>
                      {f.icon}
                    </div>
                    <h3 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600, color: "var(--color-soil)", margin: "0 0 10px" }}>
                      {f.title}
                    </h3>
                    <p style={{ fontSize: 14, color: "var(--text-secondary)", margin: 0, lineHeight: 1.8 }}>{f.body}</p>
                  </motion.div>
                ))}
              </div>

              {/* Tech stack */}
              <span className="section-label" style={{ display: "block", marginBottom: 16 }}>Technology Stack</span>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
                gap: 12, marginBottom: 52,
              }}>
                {STACK.map((s, i) => (
                  <motion.div
                    key={s.layer}
                    style={{
                      background: "var(--bg-surface)",
                      border: "1px solid var(--border-default)",
                      borderRadius: "var(--radius-md)",
                      padding: "18px",
                    }}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
                  >
                    <p style={{
                      fontSize: 11, fontWeight: 700, textTransform: "uppercase",
                      letterSpacing: "0.1em", color: "var(--accent-primary)", margin: "0 0 12px",
                    }}>{s.layer}</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {s.items.map((item) => (
                        <span key={item} style={{
                          fontSize: 12, fontWeight: 500, color: "var(--text-secondary)",
                          background: "var(--bg-subtle)", border: "1px solid var(--border-default)",
                          borderRadius: 99, padding: "3px 10px",
                        }}>{item}</span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* ── Developer Card ── */}
              <span className="section-label" style={{ display: "block", marginBottom: 16 }}>Developer</span>
              <motion.div
                style={{
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border-default)",
                  borderRadius: "var(--radius-lg)",
                  padding: "32px",
                  boxShadow: "var(--shadow-card)",
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                  gap: 28,
                  alignItems: "center",
                  marginBottom: 40,
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.5 }}
              >
                {/* Left — identity */}
                <div style={{ display: "flex", alignItems: "flex-start", gap: 18 }}>
                  {/* Avatar */}
                  <div style={{
                    width: 60, height: 60, borderRadius: "50%",
                    background: "linear-gradient(135deg, var(--color-dew), var(--color-mist))",
                    border: "2px solid var(--color-mist)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                    fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700,
                    color: "var(--accent-primary)",
                  }}>
                    K
                  </div>
                  <div>
                    <h3 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, color: "var(--color-soil)", margin: "0 0 4px" }}>
                      Krithik U S
                    </h3>
                    <p style={{ fontSize: 13, color: "var(--text-muted)", margin: "0 0 12px", fontWeight: 500 }}>
                      Full-Stack Developer · AI Engineer
                    </p>
                    <p style={{ fontSize: 14, color: "var(--text-secondary)", margin: 0, lineHeight: 1.75 }}>
                      Designed, developed, and deployed this platform end-to-end — from training
                      the crop prediction model to building the React frontend and Flask API.
                      Passionate about using technology to solve real-world agricultural problems.
                    </p>
                  </div>
                </div>

                {/* Right — skills + CTA */}
                <div>
                  <p style={{
                    fontSize: 11, fontWeight: 700, textTransform: "uppercase",
                    letterSpacing: "0.1em", color: "var(--text-muted)", margin: "0 0 12px",
                  }}>Areas of Work</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 22 }}>
                    {["Machine Learning", "React / TypeScript", "Python / Flask", "Data Engineering", "AgriTech", "UI/UX"].map((sk) => (
                      <span key={sk} style={{
                        fontSize: 12, fontWeight: 500,
                        color: "var(--accent-primary)",
                        background: "var(--color-dew)",
                        border: "1px solid var(--color-mist)",
                        borderRadius: 99, padding: "4px 11px",
                      }}>{sk}</span>
                    ))}
                  </div>

                  <a
                    href="https://krithik01.onrender.com"   
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                    style={{ fontSize: 13, padding: "10px 20px", display: "inline-flex" }}
                  >
                    View Portfolio
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                      <path d="M2 11L11 2M6 2h5v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                </div>
              </motion.div>

              {/* GitHub */}
              <div style={{
                padding: "22px 24px",
                background: "var(--bg-subtle)",
                border: "1px solid var(--border-default)",
                borderRadius: "var(--radius-md)",
                display: "flex", flexWrap: "wrap",
                alignItems: "center", justifyContent: "space-between", gap: 16,
              }}>
                <div>
                  <p style={{ fontWeight: 600, fontSize: 15, color: "var(--color-soil)", margin: "0 0 3px" }}>Source Code</p>
                  <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0 }}>
                    Full stack on GitHub — Flask backend, React frontend, ML model and datasets.
                  </p>
                </div>
                <a
                  href="https://github.com/KRITHIKus/project24.git"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline"
                  style={{ fontSize: 13, flexShrink: 0 }}
                >
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                    <path d="M7.5 1C3.91 1 1 3.96 1 7.61c0 2.9 1.84 5.37 4.4 6.24.32.06.44-.14.44-.32v-1.12c-1.79.4-2.17-.88-2.17-.88-.29-.76-.72-.96-.72-.96-.59-.41.04-.4.04-.4.65.05 1 .68 1 .68.58 1.01 1.53.72 1.9.55.06-.43.23-.72.41-.89-1.43-.16-2.93-.73-2.93-3.26 0-.72.25-1.31.67-1.77-.07-.16-.29-.84.06-1.75 0 0 .55-.18 1.8.68a6.17 6.17 0 0 1 1.64-.22c.56 0 1.12.07 1.64.22 1.25-.86 1.8-.68 1.8-.68.35.91.13 1.59.06 1.75.42.46.67 1.05.67 1.77 0 2.54-1.5 3.1-2.94 3.26.23.2.44.6.44 1.21v1.8c0 .18.12.39.45.32A6.61 6.61 0 0 0 14 7.61C14 3.96 11.09 1 7.5 1z" fill="currentColor"/>
                  </svg>
                  View on GitHub
                </a>
              </div>

            </motion.div>
          )}

          {/* ════════════════════════════════════
              TAB 2 — Workflow & Vision
          ════════════════════════════════════ */}
          {activeTab === "Workflow & Vision" && (
            <motion.div key="workflow" {...fadeSlide}>

              {/* ── Workflow — fixed timeline ── */}
              <span className="section-label" style={{ display: "block", marginBottom: 20 }}>System Workflow</span>

              <div style={{ position: "relative", marginBottom: 56 }}>
                {/* Vertical connector line — sits behind nodes */}
                <div style={{
                  position: "absolute",
                  left: 20,
                  top: 42,
                  bottom: 42,
                  width: 2,
                  background: "linear-gradient(to bottom, #3a6b47, #b8d4b5)",
                  borderRadius: 2,
                  zIndex: 0,
                }} />

                <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                  {WORKFLOW_STEPS.map((s, i) => (
                    <motion.div
                      key={s.step}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 20,
                        padding: "6px 0",
                        position: "relative",
                        zIndex: 1,
                      }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.13, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    >
                      {/* Node circle */}
                      <div style={{
                        width: 42,
                        height: 42,
                        borderRadius: "50%",
                        background: "var(--bg-surface)",
                        border: `2px solid ${s.color}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        color: s.color,
                        boxShadow: `0 0 0 4px ${s.color}14`,
                        zIndex: 2,
                        position: "relative",
                      }}>
                        {s.icon}
                      </div>

                      {/* Content card */}
                      <div style={{
                        flex: 1,
                        background: "var(--bg-surface)",
                        border: "1px solid var(--border-default)",
                        borderRadius: "var(--radius-md)",
                        padding: "18px 20px",
                        marginTop: 2,
                        marginBottom: i < WORKFLOW_STEPS.length - 1 ? 12 : 0,
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                          <span style={{
                            fontSize: 10, fontWeight: 700, letterSpacing: "0.1em",
                            textTransform: "uppercase", color: s.color,
                            background: `${s.color}12`,
                            border: `1px solid ${s.color}30`,
                            borderRadius: 99, padding: "2px 9px",
                          }}>
                            Step {String(i + 1).padStart(2, "0")}
                          </span>
                          <p style={{ fontSize: 15, fontWeight: 700, color: "var(--color-soil)", margin: 0 }}>
                            {s.step}
                          </p>
                        </div>
                        <p style={{ fontSize: 14, color: "var(--text-secondary)", margin: 0, lineHeight: 1.75 }}>
                          {s.desc}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Challenges + Future */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: 24, marginBottom: 52,
              }}>
                <div>
                  <span className="section-label" style={{ display: "block", marginBottom: 14 }}>Challenges Faced</span>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {[
                      { title: "Data quality",      body: "Market datasets from data.gov.in had inconsistent formatting and gaps requiring significant preprocessing." },
                      { title: "Model calibration", body: "Avoiding regional overfitting in the Random Forest model required multiple rounds of cross-validation and feature tuning." },
                      { title: "API latency",       body: "Weather API response times required careful loading state design to keep the frontend feeling responsive." },
                    ].map((c, i) => (
                      <motion.div
                        key={c.title}
                        style={{
                          padding: "16px 18px",
                          background: "var(--bg-surface)",
                          border: "1px solid var(--border-default)",
                          borderRadius: "var(--radius-md)",
                        }}
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1, duration: 0.4 }}
                      >
                        <p style={{ fontWeight: 700, fontSize: 14, color: "var(--color-soil)", margin: "0 0 5px" }}>{c.title}</p>
                        <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: 0, lineHeight: 1.7 }}>{c.body}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="section-label" style={{ display: "block", marginBottom: 14 }}>Future Enhancements</span>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {FUTURE.map((f, i) => (
                      <motion.div
                        key={f}
                        style={{
                          display: "flex", alignItems: "flex-start", gap: 10,
                          padding: "12px 14px",
                          background: "var(--bg-surface)",
                          border: "1px solid var(--border-default)",
                          borderRadius: "var(--radius-sm)",
                        }}
                        initial={{ opacity: 0, x: 18 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.09, duration: 0.4 }}
                      >
                        <div style={{
                          width: 18, height: 18, borderRadius: "50%",
                          background: "var(--color-dew)", border: "1px solid var(--color-mist)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          flexShrink: 0, marginTop: 1,
                        }}>
                          <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                            <path d="M1.5 4.5L3.5 6.5L7.5 2.5" stroke="var(--accent-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <p style={{ fontSize: 13, color: "var(--text-primary)", margin: 0, fontWeight: 500, lineHeight: 1.6 }}>{f}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Vision editorial */}
              <div style={{
                padding: "32px",
                background: "var(--bg-subtle)",
                border: "1px solid var(--border-default)",
                borderRadius: "var(--radius-lg)",
                marginBottom: 32,
                position: "relative", overflow: "hidden",
              }}>
                <svg style={{ position: "absolute", right: -10, bottom: -10, opacity: 0.04, pointerEvents: "none" }}
                  width="150" height="150" viewBox="0 0 60 80" fill="none">
                  <path d="M30 75C30 75 5 55 5 32C5 12 18 4 30 4C42 4 55 12 55 32C55 55 30 75 30 75Z" fill="var(--color-moss)"/>
                </svg>
                <span className="section-label" style={{ display: "block", marginBottom: 12 }}>On AI in Agriculture</span>
                <h3 className="display-heading" style={{ fontSize: "clamp(17px, 2.4vw, 23px)", fontWeight: 600, marginBottom: 14 }}>
                  Technology should serve the farmer, not replace them.
                </h3>
                <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.85, marginBottom: 14, maxWidth: 680 }}>
                  Agriculture is deeply local, seasonal, and intuitive. AI tools like FarmingAI are most valuable when
                  they surface patterns a farmer might not have time to compute — not when they override lived experience.
                  The goal is to reduce uncertainty, not eliminate judgment.
                </p>
                <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.85, maxWidth: 680, margin: 0 }}>
                  As datasets grow richer — with satellite imagery, hyper-local weather stations, and community-reported
                  prices — platforms like this can meaningfully close the information gap between large agribusinesses
                  and smallholder farmers across India.
                </p>
              </div>

              {/* CTA */}
              <div style={{
                display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center",
                padding: "22px 24px",
                background: "var(--bg-surface)",
                border: "1px solid var(--border-default)",
                borderRadius: "var(--radius-md)",
                justifyContent: "space-between",
              }}>
                <div>
                  <p style={{ fontWeight: 600, fontSize: 15, color: "var(--color-soil)", margin: "0 0 3px" }}>Ready to try it?</p>
                  <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0 }}>The platform is live and free to use.</p>
                </div>
                <Link to="/predict" className="btn-primary" style={{ flexShrink: 0, fontSize: 14 }}>
                  Start with crop recommendation
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <path d="M2 6.5h9M7 2.5l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              </div>

            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}