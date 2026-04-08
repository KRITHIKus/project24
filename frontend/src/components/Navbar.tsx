import { useState, useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";

const NAV_LINKS = [
  { name: "Home",                path: "/",                external: false },
  { name: "Crop Recommendation", path: "/predict",         external: false },
  { name: "Market Trends",       path: "/market-price",    external: false },
  { name: "Weather Forecast",    path: "https://weather-api-es7c.onrender.com/", external: true },
  { name: "Agri Revolution",     path: "/agri-revolution", external: false },
  { name: "About",               path: "/about",           external: false },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [visible,  setVisible]  = useState(true);
  const lastY = useRef(0);
  const location = useLocation();

  useEffect(() => { setMenuOpen(false); }, [location]);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setVisible(y < lastY.current || y < 80);
      setScrolled(y > 20);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
        height: "var(--nav-height)",
        background: scrolled ? "rgba(248,245,239,0.97)" : "rgba(248,245,239,0.6)",
        backdropFilter: scrolled ? "blur(14px) saturate(1.4)" : "blur(8px)",
        borderBottom: scrolled ? "1px solid var(--border-default)" : "1px solid transparent",
        boxShadow: scrolled ? "var(--shadow-nav)" : "none",
        transform: visible ? "translateY(0)" : "translateY(-100%)",
        transition: "transform 0.32s cubic-bezier(.4,0,.2,1), background 0.3s, box-shadow 0.3s, border-color 0.3s",
      }}>
        <div style={{
          maxWidth: 1280, margin: "0 auto", padding: "0 20px",
          height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>

          {/* Wordmark */}
          <NavLink to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 9, flexShrink: 0 }}>
            <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
              <path d="M13 23V13" stroke="var(--accent-primary)" strokeWidth="1.8" strokeLinecap="round"/>
              <path d="M13 13C13 13 7 10 5 4c4.5 0 8 3 8 9z" fill="rgba(58,107,71,0.15)" stroke="var(--accent-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M13 13c0 0 6-3 8-9-4.5 0-8 3-8 9z" fill="rgba(58,107,71,0.15)" stroke="var(--accent-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span style={{
              fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600,
              color: "var(--color-soil)", letterSpacing: "-0.01em",
            }}>
              Farming<span style={{ color: "var(--accent-primary)" }}>AI</span>
            </span>
          </NavLink>

          {/* Desktop links */}
          <ul style={{
            display: "flex", alignItems: "center", gap: 2,
            margin: 0, padding: 0, listStyle: "none",
          }} className="nav-desktop">
            {NAV_LINKS.map((link) => (
              <li key={link.name}>
                {link.external ? (
                  <a href={link.path} target="_blank" rel="noopener noreferrer" className="nav-link-item">
                    {link.name}
                  </a>
                ) : (
                  <NavLink
                    to={link.path}
                    end={link.path === "/"}
                    className={({ isActive }) => `nav-link-item${isActive ? " nav-link-active" : ""}`}
                  >
                    {link.name}
                  </NavLink>
                )}
              </li>
            ))}
          </ul>

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="nav-hamburger"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span className={`ham-line ${menuOpen ? "ham-open-1" : ""}`} />
            <span className={`ham-line ${menuOpen ? "ham-open-2" : ""}`} />
            <span className={`ham-line ${menuOpen ? "ham-open-3" : ""}`} />
          </button>
        </div>
      </nav>

      {/* Backdrop */}
      <div
        onClick={() => setMenuOpen(false)}
        style={{
          position: "fixed", inset: 0, zIndex: 190,
          background: "rgba(30,26,20,0.4)", backdropFilter: "blur(4px)",
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? "auto" : "none",
          transition: "opacity 0.3s ease",
        }}
        className="nav-backdrop"
      />

      {/* Mobile drawer */}
      <div style={{
        position: "fixed",
        top: 0, right: 0, bottom: 0, zIndex: 195,
        width: "min(300px, 85vw)",
        background: "rgba(248,245,239,0.98)",
        backdropFilter: "blur(20px)",
        borderLeft: "1px solid var(--border-default)",
        boxShadow: "-8px 0 40px rgba(30,26,20,0.15)",
        transform: menuOpen ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.35s cubic-bezier(.4,0,.2,1)",
        display: "flex", flexDirection: "column",
        paddingTop: "var(--nav-height)",
        overflowY: "auto",
      }} className="nav-drawer">

        <div style={{ padding: "24px 24px 32px" }}>
          <p style={{
            fontSize: 11, fontWeight: 700, letterSpacing: "0.12em",
            textTransform: "uppercase", color: "var(--text-muted)", margin: "0 0 16px",
          }}>Navigation</p>

          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 4 }}>
            {NAV_LINKS.map((link) => (
              <li key={link.name}>
                {link.external ? (
                  <a
                    href={link.path}
                    target="_blank" rel="noopener noreferrer"
                    className="mobile-nav-link"
                    onClick={() => setMenuOpen(false)}
                  >
                    <span>{link.name}</span>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 10L10 2M5 2h5v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                ) : (
                  <NavLink
                    to={link.path}
                    end={link.path === "/"}
                    className={({ isActive }) => `mobile-nav-link${isActive ? " mobile-nav-active" : ""}`}
                    onClick={() => setMenuOpen(false)}
                  >
                    <span>{link.name}</span>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Brand strip */}
        <div style={{ marginTop: "auto", padding: "20px 24px", borderTop: "1px solid var(--border-default)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <svg width="18" height="18" viewBox="0 0 26 26" fill="none">
              <path d="M13 23V13" stroke="var(--accent-primary)" strokeWidth="1.8" strokeLinecap="round"/>
              <path d="M13 13C13 13 7 10 5 4c4.5 0 8 3 8 9z" fill="rgba(58,107,71,0.2)" stroke="var(--accent-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M13 13c0 0 6-3 8-9-4.5 0-8 3-8 9z" fill="rgba(58,107,71,0.2)" stroke="var(--accent-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 600, color: "var(--color-soil)" }}>
              Farming<span style={{ color: "var(--accent-primary)" }}>AI</span>
            </span>
          </div>
          <p style={{ fontSize: 12, color: "var(--text-muted)", margin: "6px 0 0" }}>
            Agricultural Intelligence Platform
          </p>
        </div>
      </div>

      <style>{`
        @media (min-width: 769px) {
          .nav-desktop   { display: flex !important; }
          .nav-hamburger { display: none !important; }
          .nav-drawer    { display: none !important; }
          .nav-backdrop  { display: none !important; }
        }
        @media (max-width: 768px) {
          .nav-desktop   { display: none !important; }
          .nav-hamburger { display: flex !important; }
        }

        .nav-link-item {
          display: block; padding: 6px 11px;
          font-family: var(--font-body); font-size: 13.5px; font-weight: 500;
          color: var(--text-secondary); text-decoration: none;
          border-radius: var(--radius-sm);
          transition: color 0.18s, background 0.18s;
          position: relative; white-space: nowrap;
        }
        .nav-link-item:hover { color: var(--accent-primary); background: rgba(58,107,71,0.06); }
        .nav-link-active { color: var(--accent-primary) !important; font-weight: 600; }
        .nav-link-active::after {
          content: ''; position: absolute;
          bottom: 2px; left: 11px; right: 11px;
          height: 2px; background: var(--accent-primary); border-radius: 2px;
        }

        .nav-hamburger {
          flex-direction: column; justify-content: center; align-items: center;
          gap: 5px; width: 38px; height: 38px;
          background: none; border: none; cursor: pointer;
          border-radius: var(--radius-sm);
          transition: background 0.18s; padding: 0;
        }
        .nav-hamburger:hover { background: rgba(58,107,71,0.08); }

        .ham-line {
          display: block; width: 20px; height: 2px;
          background: var(--color-soil); border-radius: 2px;
          transition: transform 0.3s cubic-bezier(.4,0,.2,1), opacity 0.3s;
          transform-origin: center;
        }
        .ham-open-1 { transform: translateY(7px) rotate(45deg); }
        .ham-open-2 { opacity: 0; transform: scaleX(0); }
        .ham-open-3 { transform: translateY(-7px) rotate(-45deg); }

        .mobile-nav-link {
          display: flex; align-items: center; justify-content: space-between;
          padding: 12px 14px;
          font-family: var(--font-body); font-size: 15px; font-weight: 500;
          color: var(--text-primary); text-decoration: none;
          border-radius: var(--radius-sm);
          transition: background 0.18s, color 0.18s;
          border: 1px solid transparent;
        }
        .mobile-nav-link:hover {
          background: rgba(58,107,71,0.07);
          color: var(--accent-primary);
          border-color: rgba(58,107,71,0.12);
        }
        .mobile-nav-active {
          background: rgba(58,107,71,0.1) !important;
          color: var(--accent-primary) !important;
          font-weight: 600;
          border-color: rgba(58,107,71,0.2) !important;
        }
      `}</style>
    </>
  );
}