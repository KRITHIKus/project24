import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

// ─────────────────────────────────────────────────────────────────
// DATA & CONTENT
// -----------------------------------------------------------------

const TIMELINE = [
  {
    era:   "Before 1960",
    label: "Traditional Farming",
    color: "#8a5a1a",
    desc:  "Farming was entirely manual — oxen-pulled ploughs, seed selection by intuition, irrigation by rainfall or hand-dug channels. Knowledge passed orally across generations. India's average wheat yield was under 800 kg/hectare.",
    stat:  "< 800 kg/ha",
    statLabel: "Avg. wheat yield",
  },
  {
    era:   "1960 — 1980",
    label: "Green Revolution",
    color: "#3a6b47",
    desc:  "High-Yielding Variety (HYV) seeds, chemical fertilizers, and systematic irrigation transformed Indian agriculture. Led by M. S. Swaminathan and backed by government policy, wheat production tripled. India moved from food import to surplus.",
    stat:  "3×",
    statLabel: "Wheat production increase",
  },
  {
    era:   "1980 — 2005",
    label: "Mechanisation Era",
    color: "#2a5a8a",
    desc:  "Tractors, combine harvesters, and motorised pumps replaced animal labour at scale. Cold chain logistics emerged. Agricultural universities built extension services. But smallholder farmers remained largely excluded from mechanisation benefits.",
    stat:  "40%",
    statLabel: "Labour replaced by machines",
  },
  {
    era:   "2005 — 2015",
    label: "Digital & Mobile Access",
    color: "#6a3a8a",
    desc:  "Mobile penetration brought SMS-based crop advisory services to rural India. e-Choupal by ITC, IKSL by IFFCO — farmers began accessing market prices and weather on basic phones. Remote sensing via satellite became viable for crop monitoring.",
    stat:  "400M+",
    statLabel: "Farmers reached via mobile",
  },
  {
    era:   "2015 — Present",
    label: "AI & Precision Agriculture",
    color: "#1e6a6a",
    desc:  "Machine learning models now predict crop disease, optimal sowing windows, and yield outcomes with measurable accuracy. Drone-based spraying, computer vision for pest detection, and market prediction algorithms are moving from research to deployment.",
    stat:  "30%",
    statLabel: "Potential yield gain with precision farming",
  },
];

const AI_USECASES = [
  {
    title: "Crop recommendation",
    body:  "Models like Random Forest and XGBoost trained on soil and climate data can recommend the optimal crop for a given field with 90–98% accuracy, outperforming generic extension service advice.",
    ref:   "Pudumalar et al., 2017 — Crop Recommendation System for Precision Agriculture",
    color: "#3a6b47",
  },
  {
    title: "Disease & pest detection",
    body:  "Convolutional Neural Networks (CNNs) trained on PlantVillage and similar datasets can identify 26+ crop diseases from a smartphone photo. Early detection can reduce losses by up to 40%.",
    ref:   "Mohanty et al., 2016 — Using Deep Learning for Image-Based Plant Disease Detection",
    color: "#2a5a8a",
  },
  {
    title: "Weather & yield prediction",
    body:  "Long Short-Term Memory (LSTM) networks process time-series weather data to forecast yield months in advance, enabling better storage and logistics planning across supply chains.",
    ref:   "Khaki & Wang, 2019 — Crop Yield Prediction Using Deep Neural Networks",
    color: "#6a3a8a",
  },
  {
    title: "Market price forecasting",
    body:  "Price prediction models using ARIMA and gradient boosting on historical mandi data have shown 15–22% improvement over naive baselines, giving farmers better selling timing guidance.",
    ref:   "Choudhury et al., 2019 — Agricultural Price Prediction Using Machine Learning",
    color: "#8a5a1a",
  },
  {
    title: "Drone & satellite monitoring",
    body:  "NDVI (Normalized Difference Vegetation Index) derived from satellite imagery, combined with ML classifiers, can map crop health across thousands of hectares in near-real-time, identifying stressed zones before visible wilting.",
    ref:   "Sishodia et al., 2020 — Applications of Remote Sensing in Precision Agriculture",
    color: "#1e6a6a",
  },
  {
    title: "Irrigation optimisation",
    body:  "Reinforcement learning models trained on soil moisture sensors and evapotranspiration data can reduce irrigation water use by 20–35% while maintaining yield, critical in water-scarce regions of India.",
    ref:   "Goldstein et al., 2018 — Applying Machine Learning on Sensor Data for Irrigation",
    color: "#5a2a8a",
  },
];

const PROS = [
  {
    title: "Scalable precision",
    body:  "AI recommendations can be personalised to each field's soil profile at virtually zero marginal cost — something no human advisory system can match at scale.",
  },
  {
    title: "Early warning systems",
    body:  "ML models can detect the statistical signatures of disease outbreaks, drought stress, or pest migration weeks before physical symptoms appear.",
  },
  {
    title: "Market transparency",
    body:  "Price prediction models and real-time mandi data platforms give smallholder farmers the same market visibility that large agribusinesses have always had.",
  },
  {
    title: "Resource efficiency",
    body:  "Precision dosing of fertilizers, pesticides, and water — guided by AI — reduces input costs and environmental load simultaneously.",
  },
  {
    title: "Knowledge preservation",
    body:  "ML systems trained on traditional crop varieties and local agronomic practices can encode generational knowledge that would otherwise be lost.",
  },
];

const CONS = [
  {
    title: "Data bias",
    body:  "Most training datasets over-represent well-documented crops (wheat, rice, maize) and high-income regions. Minority crops and marginal geographies are poorly served by current models.",
  },
  {
    title: "Connectivity dependency",
    body:  "AI-powered tools require internet access — unreliable in the very rural zones that need them most. Offline capabilities remain an afterthought in most platforms.",
  },
  {
    title: "Deskilling risk",
    body:  "Over-reliance on algorithmic recommendations may erode farmers' own observational skills and reduce long-term agricultural resilience when systems fail.",
  },
  {
    title: "Affordability gap",
    body:  "Advanced precision agriculture tools — drones, soil sensor networks, satellite subscriptions — remain inaccessible to the 86% of Indian farmers who hold less than 2 hectares.",
  },
  {
    title: "Accountability vacuum",
    body:  "When an AI crop recommendation leads to crop failure, there is no clear accountability mechanism. Regulatory frameworks for agricultural AI barely exist.",
  },
];

const REFERENCES = [
  {
    authors: "Pudumalar, S., et al.",
    year:    "2017",
    title:   "Crop Recommendation System for Precision Agriculture",
    journal: "8th International Conference on Advanced Computing",
    url:     "https://ieeexplore.ieee.org/document/8076763",
  },
  {
    authors: "Mohanty, S. P., et al.",
    year:    "2016",
    title:   "Using Deep Learning for Image-Based Plant Disease Detection",
    journal: "Frontiers in Plant Science, 7, 1419",
    url:     "https://www.frontiersin.org/articles/10.3389/fpls.2016.01419",
  },
  {
    authors: "Khaki, S., & Wang, L.",
    year:    "2019",
    title:   "Crop Yield Prediction Using Deep Neural Networks",
    journal: "Frontiers in Plant Science, 10, 621",
    url:     "https://www.frontiersin.org/articles/10.3389/fpls.2019.00621",
  },
  {
    authors: "Sishodia, R. P., et al.",
    year:    "2020",
    title:   "Applications of Remote Sensing in Precision Agriculture: A Review",
    journal: "Remote Sensing, 12(19), 3136",
    url:     "https://www.mdpi.com/2072-4292/12/19/3136",
  },
  {
    authors: "Goldstein, A., et al.",
    year:    "2018",
    title:   "Applying Machine Learning on Sensor Data for Irrigation Recommendations",
    journal: "Precision Agriculture, 19, 826–853",
    url:     "https://link.springer.com/article/10.1007/s11119-018-9571-7",
  },
  {
    authors: "FAO",
    year:    "2022",
    title:   "The State of Food and Agriculture: Leveraging Automation in Agriculture",
    journal: "Food and Agriculture Organization of the United Nations",
    url:     "https://www.fao.org/3/cb9479en/cb9479en.pdf",
  },
];

// ─────────────────────────────────────────────────────────────────
// SECTION REVEAL WRAPPER
// -----------------------------------------------------------------
function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────
// PAGE
// -----------------------------------------------------------------
export default function AgriRevolution() {
  const [openRef, setOpenRef] = useState(false);

  return (
    <div className="page-wrapper" style={{ background: "var(--bg-page)" }}>

      {/* ══════════════════════════════════════════
          HERO
      ══════════════════════════════════════════ */}
      <div style={{
        background: "var(--bg-surface)",
        borderBottom: "1px solid var(--border-default)",
        padding: "60px 20px 52px",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Decorative bg */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: `
            radial-gradient(ellipse 60% 50% at 80% 50%, rgba(58,107,71,0.06) 0%, transparent 70%),
            radial-gradient(ellipse 40% 60% at 10% 80%, rgba(196,154,74,0.05) 0%, transparent 60%)
          `,
        }} />
        <div style={{ maxWidth: 820, margin: "0 auto", position: "relative" }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <span className="section-label" style={{ display: "block", marginBottom: 12 }}>Agriculture × Technology × AI</span>
            <h1 className="display-heading" style={{ fontSize: "clamp(30px, 5vw, 54px)", fontWeight: 600, marginBottom: 18, letterSpacing: "-0.02em", lineHeight: 1.12 }}>
              The Agricultural<br />
              <span style={{ color: "var(--accent-primary)" }}>Revolution</span> — Past, Present & AI
            </h1>
            <p style={{ fontSize: "clamp(15px, 2vw, 17px)", color: "var(--text-secondary)", lineHeight: 1.85, maxWidth: 620, marginBottom: 0 }}>
              From oxen-pulled ploughs to machine learning models — how technology reshaped farming,
              what AI promises next, and why it must be adopted carefully.
              This page draws on peer-reviewed research and global agricultural data.
            </p>
          </motion.div>
        </div>
      </div>

      <div style={{ maxWidth: 920, margin: "0 auto", padding: "64px 20px 80px" }}>

        {/* ══════════════════════════════════════════
            TIMELINE
        ══════════════════════════════════════════ */}
        <Reveal>
          <span className="section-label" style={{ display: "block", marginBottom: 12 }}>Historical Context</span>
          <h2 className="display-heading" style={{ fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 600, marginBottom: 8 }}>
            Five decades of agricultural transformation.
          </h2>
          <p style={{ fontSize: 15, color: "var(--text-secondary)", marginBottom: 40, lineHeight: 1.8 }}>
            Understanding where AI fits requires understanding the revolutions that came before it.
          </p>
        </Reveal>

        <div style={{ position: "relative", marginBottom: 72 }}>
          {/* Timeline spine */}
          <div style={{
            position: "absolute", left: 18, top: 0, bottom: 0,
            width: 2,
            background: "linear-gradient(to bottom, #3a6b47, #c49a4a, #b8d4b5)",
            borderRadius: 2,
          }} />

          {TIMELINE.map((t, i) => (
            <Reveal key={t.era} delay={i * 0.08}>
              <div style={{ display: "flex", gap: 24, marginBottom: 4, position: "relative" }}>
                {/* Node */}
                <div style={{
                  width: 38, height: 38, borderRadius: "50%",
                  background: "var(--bg-surface)",
                  border: `2.5px solid ${t.color}`,
                  boxShadow: `0 0 0 5px ${t.color}14`,
                  flexShrink: 0, zIndex: 2, position: "relative",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginTop: 12,
                }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: t.color }} />
                </div>

                {/* Card */}
                <motion.div
                  style={{
                    flex: 1,
                    background: "var(--bg-surface)",
                    border: "1px solid var(--border-default)",
                    borderRadius: "var(--radius-md)",
                    padding: "20px 22px",
                    marginBottom: 14,
                  }}
                  whileHover={{ borderColor: t.color, boxShadow: `0 4px 20px ${t.color}14` }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Era badge */}
                  <span style={{
                    fontSize: 10, fontWeight: 700, letterSpacing: "0.1em",
                    textTransform: "uppercase", color: t.color,
                    background: `${t.color}12`, border: `1px solid ${t.color}28`,
                    borderRadius: 99, padding: "2px 9px", marginBottom: 8, display: "inline-block",
                  }}>{t.era}</span>

                  {/* Title row with stat pill */}
                  <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: "6px 12px", marginBottom: 10 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--color-soil)", margin: 0 }}>{t.label}</h3>
                    <span style={{
                      display: "inline-flex", flexDirection: "column", alignItems: "flex-start",
                      background: `${t.color}0e`, border: `1px solid ${t.color}24`,
                      borderRadius: "var(--radius-sm)", padding: "3px 10px",
                      whiteSpace: "nowrap",
                    }}>
                      <span style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, color: t.color, lineHeight: 1.2 }}>{t.stat}</span>
                      <span style={{ fontSize: 9, color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", lineHeight: 1.4 }}>{t.statLabel}</span>
                    </span>
                  </div>

                  <p style={{ fontSize: 14, color: "var(--text-secondary)", margin: 0, lineHeight: 1.8 }}>{t.desc}</p>
                </motion.div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* ══════════════════════════════════════════
            AI USE CASES
        ══════════════════════════════════════════ */}
        <Reveal>
          <span className="section-label" style={{ display: "block", marginBottom: 12 }}>Where AI Fits Today</span>
          <h2 className="display-heading" style={{ fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 600, marginBottom: 8 }}>
            Six problems AI is already solving in agriculture.
          </h2>
          <p style={{ fontSize: 15, color: "var(--text-secondary)", marginBottom: 36, lineHeight: 1.8, maxWidth: 680 }}>
            Each use case below is grounded in published research. This is not speculative — these models
            exist, have been tested in the field, and are being deployed by governments and startups globally.
          </p>
        </Reveal>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))",
          gap: 16, marginBottom: 72,
        }}>
          {AI_USECASES.map((uc, i) => (
            <Reveal key={uc.title} delay={i * 0.06}>
              <motion.div
                style={{
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border-default)",
                  borderRadius: "var(--radius-md)",
                  padding: "22px",
                  height: "100%",
                  display: "flex", flexDirection: "column",
                }}
                whileHover={{ y: -3, boxShadow: `0 8px 28px rgba(30,26,20,0.1)` }}
                transition={{ duration: 0.22 }}
              >
                <div style={{
                  width: 10, height: 10, borderRadius: "50%",
                  background: uc.color, marginBottom: 14, flexShrink: 0,
                }} />
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--color-soil)", margin: "0 0 8px", textTransform: "capitalize" }}>
                  {uc.title}
                </h3>
                <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: "0 0 auto", lineHeight: 1.8, paddingBottom: 16 }}>
                  {uc.body}
                </p>
                <p style={{
                  fontSize: 11, color: "var(--text-muted)", margin: 0,
                  paddingTop: 12, borderTop: "1px solid var(--border-default)",
                  fontStyle: "italic", lineHeight: 1.55,
                }}>
                  {uc.ref}
                </p>
              </motion.div>
            </Reveal>
          ))}
        </div>

        {/* ══════════════════════════════════════════
            PROS & CONS — side by side
        ══════════════════════════════════════════ */}
        <Reveal>
          <span className="section-label" style={{ display: "block", marginBottom: 12 }}>Balanced Perspective</span>
          <h2 className="display-heading" style={{ fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 600, marginBottom: 8 }}>
            AI in agriculture — opportunities and real risks.
          </h2>
          <p style={{ fontSize: 15, color: "var(--text-secondary)", marginBottom: 36, lineHeight: 1.8 }}>
            Adoption of any technology carries tradeoffs. AI is no different — and in agriculture,
            where the stakes are food security and farmer livelihoods, those tradeoffs matter enormously.
          </p>
        </Reveal>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 24, marginBottom: 72,
        }}>
          {/* Pros */}
          <div>
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "10px 14px", marginBottom: 14,
              background: "#e2ede0", border: "1px solid #b8d4b5",
              borderRadius: "var(--radius-sm)",
            }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="6" stroke="#3a6b47" strokeWidth="1.4"/>
                <path d="M4 7l2 2 4-4" stroke="#3a6b47" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#3a6b47", textTransform: "uppercase", letterSpacing: "0.1em" }}>Opportunities</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {PROS.map((p, i) => (
                <Reveal key={p.title} delay={i * 0.07}>
                  <div style={{
                    padding: "16px 18px",
                    background: "var(--bg-surface)",
                    border: "1px solid var(--border-default)",
                    borderLeft: "3px solid #3a6b47",
                    borderRadius: "var(--radius-sm)",
                  }}>
                    <p style={{ fontSize: 14, fontWeight: 700, color: "var(--color-soil)", margin: "0 0 5px" }}>{p.title}</p>
                    <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: 0, lineHeight: 1.75 }}>{p.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Cons */}
          <div>
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "10px 14px", marginBottom: 14,
              background: "#fff0ee", border: "1px solid #f5c6c2",
              borderRadius: "var(--radius-sm)",
            }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="6" stroke="#b33" strokeWidth="1.4"/>
                <path d="M7 4v4M7 9.5v.5" stroke="#b33" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#a33", textTransform: "uppercase", letterSpacing: "0.1em" }}>Risks & Drawbacks</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {CONS.map((c, i) => (
                <Reveal key={c.title} delay={i * 0.07}>
                  <div style={{
                    padding: "16px 18px",
                    background: "var(--bg-surface)",
                    border: "1px solid var(--border-default)",
                    borderLeft: "3px solid #c0392b",
                    borderRadius: "var(--radius-sm)",
                  }}>
                    <p style={{ fontSize: 14, fontWeight: 700, color: "var(--color-soil)", margin: "0 0 5px" }}>{c.title}</p>
                    <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: 0, lineHeight: 1.75 }}>{c.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════
            EDITORIAL — Wise adoption
        ══════════════════════════════════════════ */}
        <Reveal>
          <div style={{
            padding: "36px",
            background: "var(--bg-subtle)",
            border: "1px solid var(--border-default)",
            borderRadius: "var(--radius-lg)",
            marginBottom: 60,
            position: "relative", overflow: "hidden",
          }}>
            <svg style={{ position: "absolute", right: -16, top: -16, opacity: 0.04, pointerEvents: "none" }}
              width="200" height="200" viewBox="0 0 60 80" fill="none">
              <path d="M30 75C30 75 5 55 5 32C5 12 18 4 30 4C42 4 55 12 55 32C55 55 30 75 30 75Z" fill="var(--color-moss)"/>
            </svg>
            <span className="section-label" style={{ display: "block", marginBottom: 12 }}>Editorial</span>
            <h2 className="display-heading" style={{ fontSize: "clamp(20px, 2.8vw, 28px)", fontWeight: 600, marginBottom: 18 }}>
              AI must be adopted wisely — not just rapidly.
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 720 }}>
              <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.9, margin: 0 }}>
                The history of agricultural revolutions teaches a consistent lesson: technology that benefits large,
                well-resourced producers first tends to increase inequality before it decreases it.
                The Green Revolution produced national food surplus while displacing millions of marginal farmers.
                The mechanisation era rewarded those who could afford machinery.
              </p>
              <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.9, margin: 0 }}>
                AI has the potential to break this pattern — if it is deliberately designed for accessibility.
                A crop recommendation that runs on a basic smartphone with intermittent internet, delivered in
                Kannada or Hindi, costs nothing to the farmer, and is transparent about its confidence levels —
                that is transformative technology. A subscription-based yield optimization platform requiring
                paid consultants and soil lab reports is not.
              </p>
              <p style={{ fontSize: 15, color: "var(--text-primary)", lineHeight: 1.9, margin: 0, fontWeight: 500 }}>
                The measure of success is not the sophistication of the model. It is whether the farmer who
                grows 2 hectares of jowar in Vidarbha makes a better decision this season than last.
              </p>
            </div>
          </div>
        </Reveal>

        {/* ══════════════════════════════════════════
            BLOG TEASER
        ══════════════════════════════════════════ */}
        <Reveal>
          <div style={{
            padding: "32px",
            background: "var(--bg-surface)",
            border: "1.5px solid var(--color-mist)",
            borderRadius: "var(--radius-lg)",
            boxShadow: "var(--shadow-card)",
            marginBottom: 56,
            display: "flex",
            flexWrap: "wrap",
            gap: 24,
            alignItems: "center",
            justifyContent: "space-between",
          }}>
            <div style={{ flex: 1, minWidth: 240 }}>
              <span className="section-label" style={{ display: "block", marginBottom: 12 }}>
                From the Blog
              </span>
              <h3 className="display-heading" style={{ fontSize: "clamp(18px, 2.5vw, 24px)", fontWeight: 600, margin: "0 0 10px" }}>
                AI + Agriculture: The Promise, the Peril, and What Farmers Actually Need
              </h3>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", margin: 0, lineHeight: 1.85, maxWidth: 520 }}>
                A deep dive into how artificial intelligence is reshaping Indian agriculture — from soil 
                sensors to satellite imagery, what the research actually shows, where hype outpaces reality, 
                and what meaningful adoption looks like for the smallholder farmer who holds less than 2 hectares.
              </p>
            </div>
            <div style={{ flexShrink: 0 }}>
              <a
                href=""   /* ← blog post URL goes here */
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{ fontSize: 14 }}
              >
                Read the post
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path d="M2 11L11 2M6 2h5v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>
          </div>
        </Reveal>

        {/* ══════════════════════════════════════════
            REFERENCES
        ══════════════════════════════════════════ */}
        <Reveal>
          <div style={{
            borderTop: "1px solid var(--border-default)",
            paddingTop: 40,
          }}>
            <button
              onClick={() => setOpenRef(!openRef)}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                background: "none", border: "none", cursor: "pointer",
                fontFamily: "var(--font-body)", padding: 0, marginBottom: openRef ? 24 : 0,
              }}
            >
              <span className="section-label">Research References</span>
              <motion.svg
                width="14" height="14" viewBox="0 0 14 14" fill="none"
                animate={{ rotate: openRef ? 180 : 0 }}
                transition={{ duration: 0.25 }}
              >
                <path d="M2 5l5 5 5-5" stroke="var(--accent-primary)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </motion.svg>
            </button>

            <AnimatePresence>
              {openRef && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  style={{ overflow: "hidden" }}
                >
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {REFERENCES.map((r, i) => (
                      <div
                        key={i}
                        style={{
                          padding: "14px 16px",
                          background: "var(--bg-surface)",
                          border: "1px solid var(--border-default)",
                          borderRadius: "var(--radius-sm)",
                          display: "flex", flexWrap: "wrap", justifyContent: "space-between",
                          alignItems: "flex-start", gap: 10,
                        }}
                      >
                        <div style={{ flex: 1, minWidth: 200 }}>
                          <p style={{ fontSize: 13, fontWeight: 700, color: "var(--color-soil)", margin: "0 0 3px" }}>
                            {r.authors} ({r.year})
                          </p>
                          <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: "0 0 3px", fontStyle: "italic" }}>{r.title}</p>
                          <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0 }}>{r.journal}</p>
                        </div>
                        <a
                          href={r.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            fontSize: 12, fontWeight: 600, color: "var(--accent-primary)",
                            textDecoration: "none", flexShrink: 0, marginTop: 2,
                            display: "flex", alignItems: "center", gap: 4,
                          }}
                        >
                          View source
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <path d="M1 9L9 1M5 1h4v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </a>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Reveal>

        {/* Bottom CTA */}
        <Reveal>
          <div style={{
            marginTop: 56,
            display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center",
            padding: "24px",
            background: "var(--bg-surface)",
            border: "1px solid var(--border-default)",
            borderRadius: "var(--radius-md)",
            justifyContent: "space-between",
          }}>
            <div>
              <p style={{ fontWeight: 700, fontSize: 15, color: "var(--color-soil)", margin: "0 0 3px" }}>
                See AI in action on your farm data.
              </p>
              <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0 }}>
                The crop recommendation engine is built on the same research described above.
              </p>
            </div>
            <Link to="/predict" className="btn-primary" style={{ flexShrink: 0, fontSize: 14 }}>
              Try crop recommendation
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M2 6.5h9M7 2.5l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </Reveal>

      </div>
    </div>
  );
}