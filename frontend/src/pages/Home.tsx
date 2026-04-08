import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useInView, useMotionValue, useSpring, animate } from "framer-motion";

// ─────────────────────────────────────────────────────────────────
// ANIMATED CANVAS — floating particles + growing roots + AI nodes
// -----------------------------------------------------------------

function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let raf: number;

    const resize = () => {
      canvas.width  = canvas.offsetWidth  * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    const W = () => canvas.offsetWidth;
    const H = () => canvas.offsetHeight;

    // ── Particles (pollen / seeds) ──
    const particles = Array.from({ length: 48 }, () => makeParticle(W(), H()));

    function makeParticle(w: number, h: number) {
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 2.5 + 0.5,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -(Math.random() * 0.5 + 0.1),
        alpha: Math.random() * 0.45 + 0.1,
        hue: 110 + Math.floor(Math.random() * 30), // greens
        life: Math.random(),
        decay: Math.random() * 0.002 + 0.001,
      };
    }

    // ── Root / vein lines branching from bottom ──
    interface Branch {
      x: number; y: number; angle: number; len: number; maxLen: number;
      children: Branch[]; grown: boolean; width: number; alpha: number;
    }

    function makeBranch(x: number, y: number, angle: number, maxLen: number, w: number): Branch {
      return { x, y, angle, len: 0, maxLen, children: [], grown: false, width: w, alpha: 0.22 };
    }

    const roots: Branch[] = [];
    const numRoots = 5;
    for (let i = 0; i < numRoots; i++) {
      const bx = (W() / (numRoots + 1)) * (i + 1) + (Math.random() - 0.5) * 80;
      roots.push(makeBranch(bx, H(), -Math.PI / 2 + (Math.random() - 0.5) * 0.6, 90 + Math.random() * 60, 1.4));
    }

    function growBranch(b: Branch, depth: number) {
      if (b.grown) return;
      b.len += 0.9;
      if (b.len >= b.maxLen) {
        b.grown = true;
        if (depth < 3) {
          const n = depth < 2 ? 2 : 1;
          for (let i = 0; i < n; i++) {
            const endX = b.x + Math.cos(b.angle) * b.len;
            const endY = b.y + Math.sin(b.angle) * b.len;
            const spread = (Math.random() - 0.5) * 1.1;
            b.children.push(makeBranch(endX, endY, b.angle + spread, b.maxLen * 0.65, b.width * 0.6));
          }
        }
      }
    }

    function drawBranch(b: Branch) {
      if (b.len === 0) return;
      const ex = b.x + Math.cos(b.angle) * b.len;
      const ey = b.y + Math.sin(b.angle) * b.len;
      ctx.beginPath();
      ctx.moveTo(b.x, b.y);
      ctx.lineTo(ex, ey);
      ctx.strokeStyle = `rgba(58,107,71,${b.alpha})`;
      ctx.lineWidth = b.width;
      ctx.lineCap = "round";
      ctx.stroke();
      b.children.forEach(drawBranch);
    }

    // ── AI network nodes ──
    interface Node { x: number; y: number; r: number; pulse: number; speed: number; connections: number[]; }
    const nodes: Node[] = Array.from({ length: 9 }, (_, i) => ({
      x: (W() * 0.55) + (Math.random() - 0.5) * W() * 0.4,
      y: (H() * 0.3) + (Math.random() - 0.5) * H() * 0.5,
      r: Math.random() * 3 + 2,
      pulse: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.02 + 0.01,
      connections: [],
    }));

    // Link nearby nodes
    nodes.forEach((n, i) => {
      nodes.forEach((m, j) => {
        if (i !== j) {
          const d = Math.hypot(n.x - m.x, n.y - m.y);
          if (d < 130) n.connections.push(j);
        }
      });
    });

    // ── Data flow dash ──
    interface Flow { from: number; to: number; t: number; }
    const flows: Flow[] = [];
    nodes.forEach((n, i) => {
      if (n.connections.length) {
        flows.push({ from: i, to: n.connections[0], t: Math.random() });
      }
    });

    let frame = 0;
    function loop() {
      ctx.clearRect(0, 0, W(), H());
      frame++;

      // ── Draw roots ──
      roots.forEach((r, depth) => {
        growBranch(r, 0);
        drawBranch(r);
        r.children.forEach(c => { growBranch(c, 1); drawBranch(c); c.children.forEach(cc => { growBranch(cc, 2); drawBranch(cc); }); });
      });

      // ── Draw AI network ──
      // connections
      nodes.forEach((n) => {
        n.connections.forEach((j) => {
          const m = nodes[j];
          const pulse = (Math.sin(n.pulse + frame * n.speed) + 1) / 2;
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(m.x, m.y);
          ctx.strokeStyle = `rgba(196,154,74,${0.08 + pulse * 0.12})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        });
      });

      // flowing data dots
      flows.forEach((f) => {
        f.t += 0.006;
        if (f.t > 1) f.t = 0;
        const a = nodes[f.from];
        const b = nodes[f.to];
        const fx = a.x + (b.x - a.x) * f.t;
        const fy = a.y + (b.y - a.y) * f.t;
        ctx.beginPath();
        ctx.arc(fx, fy, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(196,154,74,0.7)`;
        ctx.fill();
      });

      // nodes
      nodes.forEach((n) => {
        n.pulse += n.speed;
        const alpha = 0.5 + 0.4 * Math.sin(n.pulse);

        // outer ring ping
        if (Math.sin(n.pulse) > 0.98) {
          const ringR = n.r + (1 - Math.sin(n.pulse)) * 18;
          ctx.beginPath();
          ctx.arc(n.x, n.y, ringR, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(196,154,74,${alpha * 0.3})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(196,154,74,${alpha})`;
        ctx.fill();
      });

      // ── Particles ──
      particles.forEach((p, i) => {
        p.x += p.vx + Math.sin(frame * 0.01 + i) * 0.2;
        p.y += p.vy;
        p.life -= p.decay;

        if (p.life <= 0 || p.y < -10) {
          particles[i] = makeParticle(W(), H());
          particles[i].y = H() + 10;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue},55%,38%,${p.alpha * p.life})`;
        ctx.fill();
      });

      // ── Bridge line from root tops to AI nodes ──
      roots.forEach((root) => {
        const endX = root.x + Math.cos(root.angle) * root.len;
        const endY = root.y + Math.sin(root.angle) * root.len;
        const nearest = nodes.reduce((best, n, i) => {
          const d = Math.hypot(n.x - endX, n.y - endY);
          return d < best.d ? { d, i } : best;
        }, { d: Infinity, i: 0 });
        if (nearest.d < 240) {
          const n = nodes[nearest.i];
          const g = ctx.createLinearGradient(endX, endY, n.x, n.y);
          g.addColorStop(0, "rgba(58,107,71,0.2)");
          g.addColorStop(1, "rgba(196,154,74,0.15)");
          ctx.beginPath();
          ctx.moveTo(endX, endY);
          ctx.quadraticCurveTo((endX + n.x) / 2, (endY + n.y) / 2 - 30, n.x, n.y);
          ctx.strokeStyle = g;
          ctx.lineWidth = 0.7;
          ctx.setLineDash([4, 6]);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      });

      raf = requestAnimationFrame(loop);
    }

    loop();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute", inset: 0,
        width: "100%", height: "100%",
        pointerEvents: "none",
      }}
    />
  );
}

// ─────────────────────────────────────────────────────────────────
// ANIMATED COUNTER
// -----------------------------------------------------------------
function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const count = useMotionValue(0);
  const spring = useSpring(count, { stiffness: 80, damping: 22 });

  useEffect(() => {
    if (inView) animate(count, to, { duration: 1.4, ease: "easeOut" });
  }, [inView, count, to]);

  useEffect(() => {
    return spring.on("change", (v) => {
      if (ref.current) ref.current.textContent = Math.floor(v) + suffix;
    });
  }, [spring, suffix]);

  return <span ref={ref}>0{suffix}</span>;
}

// ─────────────────────────────────────────────────────────────────
// ANIMATED SVG LEAF (decorative)
// -----------------------------------------------------------------
function AnimatedLeaf({ style }: { style?: React.CSSProperties }) {
  return (
    <motion.svg
      width="60" height="80" viewBox="0 0 60 80" fill="none"
      style={style}
      animate={{ rotate: [-6, 5, -6], y: [0, -10, 0] }}
      transition={{ duration: 5 + Math.random() * 3, repeat: Infinity, ease: "easeInOut" }}
    >
      <path d="M30 75 C30 75 5 55 5 32 C5 12 18 4 30 4 C42 4 55 12 55 32 C55 55 30 75 30 75Z"
        fill="rgba(58,107,71,0.12)" stroke="rgba(58,107,71,0.4)" strokeWidth="1.2"/>
      <path d="M30 75 L30 20" stroke="rgba(58,107,71,0.3)" strokeWidth="1" strokeLinecap="round"/>
      <path d="M30 50 Q20 44 18 34" stroke="rgba(58,107,71,0.2)" strokeWidth="0.8" strokeLinecap="round"/>
      <path d="M30 50 Q40 44 42 34" stroke="rgba(58,107,71,0.2)" strokeWidth="0.8" strokeLinecap="round"/>
    </motion.svg>
  );
}

// ─────────────────────────────────────────────────────────────────
// MODULE CARDS
// -----------------------------------------------------------------
const MODULES = [
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
        <path d="M13 23V13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M13 13C13 13 7 10 5 4c4.5 0 8 3 8 9z" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M13 13c0 0 6-3 8-9-4.5 0-8 3-8 9z" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    tag:         "Soil & Climate AI",
    title:       "Crop Recommendation",
    description: "Enter your soil's NPK profile, pH, humidity, temperature, and rainfall. The Random Forest model returns your optimal crop with estimated yield.",
    href:        "/predict",
    external:    false,
    accent:      "#3a6b47",
    accentBg:    "#e2ede0",
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
        <path d="M13 4v4M5.6 7.6l2.8 2.8M2 15h4M5.6 22.4l2.8-2.8M13 22v-4M20.4 22.4l-2.8-2.8M24 15h-4M20.4 7.6l-2.8 2.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
        <circle cx="13" cy="15" r="4" stroke="currentColor" strokeWidth="1.6"/>
      </svg>
    ),
    tag:         "OpenWeatherMap API",
    title:       "Weather Forecast",
    description: "Get a live 7-day forecast with temperature, humidity, wind speed, and precipitation for your exact farm location — powered by OpenWeatherMap.",
    href:        "https://weather-api-es7c.onrender.com/",
    external:    true,
    accent:      "#2a5a8a",
    accentBg:    "#e0eaf5",
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
        <polyline points="3 18 9 12 13 16 23 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="3" y1="22" x2="23" y2="22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    tag:         "data.gov.in",
    title:       "Market Price Trends",
    description: "Query historical mandi prices by state, district, and commodity. Visualise price spread with interactive charts to time your market moves.",
    href:        "/market-price",
    external:    false,
    accent:      "#8a5a1a",
    accentBg:    "#f5ede0",
  },
];

// ─────────────────────────────────────────────────────────────────
// HOME COMPONENT
// -----------------------------------------------------------------
export default function Home() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const stagger = {
    container: { hidden: {}, show: { transition: { staggerChildren: 0.12 } } },
    item: {
      hidden: { opacity: 0, y: 36 },
      show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
    },
  };

  return (
    <div className="page-wrapper" style={{ background: "var(--bg-page)", overflow: "hidden" }}>

      {/* ══════════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════════ */}
      <section style={{
        position: "relative",
        minHeight: "calc(100vh - var(--nav-height))",
        display: "flex", flexDirection: "column", justifyContent: "center",
        padding: "60px 20px 80px",
        overflow: "hidden",
        borderBottom: "1px solid var(--border-default)",
      }}>
        {/* Canvas background */}
        <HeroCanvas />

        {/* Gradient overlays */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: `
            radial-gradient(ellipse 70% 60% at 15% 50%, rgba(242,237,228,0.85) 0%, transparent 65%),
            radial-gradient(ellipse 50% 80% at 80% 80%, rgba(58,107,71,0.05) 0%, transparent 60%)
          `,
        }} />

        {/* Decorative leaves */}
        <AnimatedLeaf style={{ position: "absolute", top: "12%", right: "6%", opacity: 0.6 }} />
        <AnimatedLeaf style={{ position: "absolute", bottom: "15%", right: "18%", opacity: 0.35, transform: "scale(0.7)" }} />

        {/* Content */}
        <div style={{ maxWidth: 820, margin: "0 auto", position: "relative", zIndex: 2, width: "100%" }}>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(58,107,71,0.1)", border: "1px solid rgba(58,107,71,0.25)",
              borderRadius: 99, padding: "5px 14px",
              fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
              color: "var(--accent-primary)", marginBottom: 24,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent-primary)", display: "block",
                animation: "dataPulse 2s ease-in-out infinite" }} />
              Agricultural Intelligence Platform
            </span>
          </motion.div>

          <motion.h1
            className="display-heading"
            style={{ fontSize: "clamp(38px, 6vw, 68px)", fontWeight: 600, marginBottom: 20, letterSpacing: "-0.025em", lineHeight: 1.1 }}
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            Where soil data<br />
            <span style={{
              color: "var(--accent-primary)",
              backgroundImage: "linear-gradient(135deg, #3a6b47, #6a9e77, #3a6b47)",
              backgroundSize: "200% auto",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              animation: "shimmer 4s linear infinite",
            }}>
              meets intelligence.
            </span>
          </motion.h1>

          <motion.p
            style={{
              fontSize: "clamp(16px, 2.2vw, 19px)",
              color: "var(--text-secondary)",
              lineHeight: 1.75,
              maxWidth: 560,
              marginBottom: 40,
              fontWeight: 400,
            }}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.4, ease: "easeOut" }}
          >
            FarmingAI bridges traditional farming knowledge with modern AI — giving
            Indian farmers real-time, data-backed guidance on what to grow, when to
            plant, and when to sell.
          </motion.p>

          <motion.div
            style={{ display: "flex", flexWrap: "wrap", gap: 12 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55, ease: "easeOut" }}
          >
            <Link to="/predict" className="btn-primary">
              Get crop recommendation
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <Link to="/about" className="btn-outline">
              How it works
            </Link>
          </motion.div>

          {/* Scroll hint */}
          <motion.div
            style={{ marginTop: 56, display: "flex", alignItems: "center", gap: 10 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            <div style={{
              display: "flex", flexDirection: "column", gap: 3,
              animation: "scrollBounce 2s ease-in-out infinite",
            }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: 2, height: 6, borderRadius: 2,
                  background: "var(--accent-primary)",
                  opacity: 1 - i * 0.3,
                }} />
              ))}
            </div>
            <span style={{ fontSize: 12, color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600 }}>
              Scroll to explore
            </span>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          STATS STRIP
      ══════════════════════════════════════════ */}
      <section style={{ background: "var(--bg-surface)", borderBottom: "1px solid var(--border-default)" }}>
        <div style={{
          maxWidth: 1100, margin: "0 auto", padding: "0 20px",
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
        }}>
          {[
            { value: 22,   suffix: "+",    label: "Crops Modeled",        icon: "🌾" },
            { value: 7,    suffix: "-day", label: "Forecast Window",      icon: "☁️" },
            { value: 100,  suffix: "+",    label: "Districts Covered",    icon: "📍" },
            { value: 98,   suffix: "%",    label: "Model Accuracy",       icon: "🎯" },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              style={{
                padding: "28px 16px", textAlign: "center",
                borderRight: "1px solid var(--border-default)",
                borderBottom: "1px solid transparent",
              }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <p style={{
                fontFamily: "var(--font-display)",
                fontSize: 34, fontWeight: 700, color: "var(--color-soil)",
                margin: 0, lineHeight: 1.1,
              }}>
                <Counter to={s.value} suffix={s.suffix} />
              </p>
              <p style={{ fontSize: 11, color: "var(--text-muted)", margin: "6px 0 0", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>
                {s.label}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          MODULE CARDS
      ══════════════════════════════════════════ */}
      <section style={{ padding: "80px 20px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>

          <motion.div
            style={{ marginBottom: 48 }}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55 }}
          >
            <span className="section-label" style={{ display: "block", marginBottom: 10 }}>Platform Modules</span>
            <h2 className="display-heading" style={{ fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 600, margin: 0 }}>
              Three tools. One platform.
            </h2>
            <p style={{ fontSize: 16, color: "var(--text-secondary)", marginTop: 12, maxWidth: 480 }}>
              Each module is designed around a real problem farmers face daily — from what to plant to when to sell.
            </p>
          </motion.div>

          <motion.div
            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 22 }}
            variants={stagger.container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
          >
            {MODULES.map((mod, i) => {
              const El = mod.external ? "a" : Link;
              const props = mod.external
                ? { href: mod.href, target: "_blank", rel: "noopener noreferrer" }
                : { to: mod.href };

              return (
                <motion.div key={i} variants={stagger.item}>
                  {/* @ts-ignore */}
                  <El {...props} style={{ textDecoration: "none", display: "block" }}>
                    <motion.div
                      style={{
                        background: "var(--bg-surface)",
                        border: "1px solid var(--border-default)",
                        borderRadius: "var(--radius-lg)",
                        padding: "28px",
                        height: "100%",
                        display: "flex", flexDirection: "column",
                        cursor: "pointer",
                        transition: "border-color 0.25s",
                        borderColor: hoveredCard === i ? mod.accent : "var(--border-default)",
                      }}
                      animate={{
                        y: hoveredCard === i ? -6 : 0,
                        boxShadow: hoveredCard === i
                          ? `0 8px 32px rgba(30,26,20,0.13), 0 0 0 2px ${mod.accent}22`
                          : "var(--shadow-card)",
                      }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      onHoverStart={() => setHoveredCard(i)}
                      onHoverEnd={() => setHoveredCard(null)}
                    >
                      {/* Icon + tag */}
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
                        <motion.div
                          style={{
                            width: 48, height: 48,
                            borderRadius: "var(--radius-md)",
                            background: mod.accentBg,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            color: mod.accent,
                          }}
                          animate={{ scale: hoveredCard === i ? 1.08 : 1, rotate: hoveredCard === i ? 3 : 0 }}
                          transition={{ duration: 0.25 }}
                        >
                          {mod.icon}
                        </motion.div>
                        <span style={{
                          fontSize: 10, fontWeight: 700, letterSpacing: "0.1em",
                          textTransform: "uppercase", color: mod.accent,
                          background: `${mod.accentBg}`,
                          border: `1px solid ${mod.accent}33`,
                          borderRadius: 99, padding: "3px 10px",
                        }}>
                          {mod.tag}
                        </span>
                      </div>

                      <h3 style={{
                        fontFamily: "var(--font-display)",
                        fontSize: 22, fontWeight: 600, color: "var(--color-soil)",
                        margin: "0 0 10px",
                      }}>
                        {mod.title}
                      </h3>

                      <p style={{
                        fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.75,
                        margin: "0 0 28px", flex: 1,
                      }}>
                        {mod.description}
                      </p>

                      <motion.div
                        style={{
                          display: "inline-flex", alignItems: "center", gap: 6,
                          fontSize: 13, fontWeight: 700, color: mod.accent,
                        }}
                        animate={{ x: hoveredCard === i ? 4 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        Open tool
                        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                          <path d="M2 6.5h9M7 2.5l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </motion.div>
                    </motion.div>
                  </El>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          HOW IT WORKS — visual flow
      ══════════════════════════════════════════ */}
      <section style={{
        padding: "80px 20px",
        background: "var(--bg-subtle)",
        borderTop: "1px solid var(--border-default)",
        borderBottom: "1px solid var(--border-default)",
      }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>

          <motion.div
            style={{ textAlign: "center", marginBottom: 56 }}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <span className="section-label" style={{ display: "block", marginBottom: 10 }}>How It Works</span>
            <h2 className="display-heading" style={{ fontSize: "clamp(24px, 3.5vw, 38px)", fontWeight: 600, margin: 0 }}>
              From field to forecast in seconds.
            </h2>
          </motion.div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 2, position: "relative" }}>
            {[
              {
                step: "01", color: "#3a6b47",
                icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 22V12M12 12C12 12 7 9 5 4c4 0 7 2 7 8zM12 12c0 0 5-3 7-8-4 0-7 2-7 8z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>,
                title: "You provide field data",
                body:  "Enter soil NPK, pH, temperature, humidity, and location.",
              },
              {
                step: "02", color: "#2a5a8a",
                icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.6"/><rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.6"/><rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.6"/><path d="M17.5 17.5m-2.5 0a2.5 2.5 0 1 0 5 0 2.5 2.5 0 1 0-5 0" stroke="currentColor" strokeWidth="1.6"/></svg>,
                title: "AI model processes",
                body:  "Random Forest evaluates against thousands of crop records.",
              },
              {
                step: "03", color: "#8a5a1a",
                icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M9 11l3 3L22 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>,
                title: "You receive insight",
                body:  "Best-fit crop recommendation, weather outlook, and market prices.",
              },
            ].map((s, i) => (
              <motion.div
                key={s.step}
                style={{
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border-default)",
                  borderRadius: "var(--radius-md)",
                  padding: "30px 24px",
                  position: "relative",
                }}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.55, delay: i * 0.14 }}
              >
                {/* Step number */}
                <div style={{
                  fontFamily: "var(--font-display)", fontSize: 44, fontWeight: 700,
                  color: `${s.color}18`, lineHeight: 1, margin: "0 0 16px",
                  letterSpacing: "-0.03em",
                }}>{s.step}</div>

                {/* Icon */}
                <div style={{
                  width: 42, height: 42, borderRadius: "var(--radius-sm)",
                  background: `${s.color}15`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: s.color, marginBottom: 16,
                }}>
                  {s.icon}
                </div>

                <p style={{ fontSize: 15, fontWeight: 700, color: "var(--color-soil)", margin: "0 0 8px" }}>{s.title}</p>
                <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: 0, lineHeight: 1.7 }}>{s.body}</p>

                {/* Connector arrow */}
                {i < 2 && (
                  <div style={{
                    display: "none",
                    position: "absolute", right: -14, top: "50%",
                    transform: "translateY(-50%)", zIndex: 3,
                    background: "var(--bg-surface)", border: "1px solid var(--border-default)",
                    borderRadius: "50%", width: 26, height: 26,
                    alignItems: "center", justifyContent: "center",
                    color: "var(--text-muted)", fontSize: 10,
                  }} className="step-arrow">→</div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FEATURE HIGHLIGHT — AI + Nature bridge
      ══════════════════════════════════════════ */}
      <section style={{ padding: "80px 20px" }}>
        <div style={{
          maxWidth: 1100, margin: "0 auto",
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 48, alignItems: "center",
        }}>
          {/* Left text */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
          >
            <span className="section-label" style={{ display: "block", marginBottom: 12 }}>The Bridge</span>
            <h2 className="display-heading" style={{ fontSize: "clamp(24px, 3.5vw, 38px)", fontWeight: 600, marginBottom: 18 }}>
              Nature's patterns,<br />decoded by data.
            </h2>
            <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: 28 }}>
              Centuries of agricultural wisdom encoded into machine learning.
              FarmingAI doesn't replace farmer intuition — it amplifies it with
              soil science, climate modeling, and real-time market intelligence.
            </p>
            {[
              "Trained on real Indian crop & soil datasets",
              "Weather-aware recommendations",
              "Market-driven selling guidance",
            ].map((pt) => (
              <div key={pt} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 12 }}>
                <div style={{
                  width: 20, height: 20, borderRadius: "50%",
                  background: "var(--color-dew)", border: "1.5px solid var(--color-mist)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0, marginTop: 2,
                }}>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5l2.5 2.5L8 2.5" stroke="var(--accent-primary)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <p style={{ fontSize: 14, color: "var(--text-primary)", fontWeight: 500, margin: 0 }}>{pt}</p>
              </div>
            ))}
          </motion.div>

          {/* Right — visual diagram */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border-default)",
              borderRadius: "var(--radius-lg)",
              padding: "36px",
              boxShadow: "var(--shadow-card)",
              position: "relative", overflow: "hidden",
            }}
          >
            {/* Background grid dots */}
            <div style={{
              position: "absolute", inset: 0, opacity: 0.04,
              backgroundImage: "radial-gradient(circle, var(--color-moss) 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }} />

            {/* Center flow diagram */}
            <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { label: "Soil Data",      value: "N:90 P:42 K:43 pH:6.5", color: "#3a6b47", icon: "🌱" },
                { label: "Climate Data",   value: "Temp: 25°C  Rain: 200mm",  color: "#2a5a8a", icon: "☁️" },
                { label: "AI Model",       value: "Random Forest · 98% acc.",  color: "#7a3a8a", icon: "🧠" },
                { label: "Recommendation", value: "Rice — High yield zone",    color: "#8a5a1a", icon: "✅" },
              ].map((row, i) => (
                <motion.div
                  key={row.label}
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "12px 14px",
                    background: `${row.color}0a`,
                    border: `1px solid ${row.color}20`,
                    borderRadius: "var(--radius-sm)",
                  }}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.12, duration: 0.45 }}
                >
                  <span style={{ fontSize: 18 }}>{row.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: row.color, margin: 0 }}>{row.label}</p>
                    <p style={{ fontSize: 13, color: "var(--text-primary)", margin: "2px 0 0", fontFamily: "monospace", fontWeight: 500 }}>{row.value}</p>
                  </div>
                  {i < 3 && (
                    <motion.div
                      animate={{ y: [0, 3, 0] }}
                      transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.3 }}
                      style={{ color: "var(--text-muted)" }}
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M8 3v10M4 9l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CTA BANNER
      ══════════════════════════════════════════ */}
      <section style={{
        padding: "80px 20px",
        background: "var(--bg-subtle)",
        borderTop: "1px solid var(--border-default)",
      }}>
        <motion.div
          style={{
            maxWidth: 680, margin: "0 auto", textAlign: "center",
            background: "var(--bg-surface)",
            border: "1px solid var(--border-default)",
            borderRadius: "var(--radius-lg)",
            padding: "clamp(36px, 6vw, 56px) clamp(24px, 5vw, 48px)",
            boxShadow: "var(--shadow-card)",
            position: "relative", overflow: "hidden",
          }}
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Subtle bg leaf */}
          <svg style={{ position: "absolute", right: -20, top: -20, opacity: 0.04 }}
            width="180" height="180" viewBox="0 0 60 80" fill="none">
            <path d="M30 75C30 75 5 55 5 32C5 12 18 4 30 4C42 4 55 12 55 32C55 55 30 75 30 75Z" fill="var(--color-moss)"/>
          </svg>

          <span className="section-label" style={{ display: "block", marginBottom: 14 }}>Start Now — Free</span>
          <h2 className="display-heading" style={{ fontSize: "clamp(24px, 3.5vw, 36px)", fontWeight: 600, marginBottom: 16 }}>
            Ready to grow smarter?
          </h2>
          <p style={{ fontSize: 15, color: "var(--text-secondary)", marginBottom: 36, lineHeight: 1.75, maxWidth: 440, margin: "0 auto 36px" }}>
            No account needed. Enter your soil data and get a personalized crop recommendation in under 10 seconds.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
            <Link to="/predict" className="btn-primary" style={{ fontSize: 15, padding: "13px 30px" }}>
              Recommend a crop
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <a
              href="https://weather-api-es7c.onrender.com/"
              target="_blank" rel="noopener noreferrer"
              className="btn-outline"
              style={{ fontSize: 15 }}
            >
              Check weather
            </a>
          </div>
        </motion.div>
      </section>

    </div>
  );
}