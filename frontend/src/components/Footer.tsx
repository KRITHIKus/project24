import { NavLink } from "react-router-dom";

const FOOTER_LINKS = [
  { name: "Crop Recommendation", path: "/predict",      external: false },
  { name: "Market Trends",       path: "/market-price", external: false },
  { name: "Weather Forecast",    path: "https://weather-api-es7c.onrender.com/", external: true },
  { name: "About",               path: "/about",        external: false },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={{
      borderTop: "1px solid var(--border-default)",
      background: "var(--bg-surface)",
      paddingTop: 40,
      paddingBottom: 28,
    }}>
      <div style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "0 24px",
      }}>
        {/* Top row */}
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 32,
          justifyContent: "space-between",
          alignItems: "flex-start",
          paddingBottom: 28,
          borderBottom: "1px solid var(--border-default)",
          marginBottom: 20,
        }}>
          {/* Brand */}
          <div>
            <NavLink to="/" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}>
              <svg width="18" height="18" viewBox="0 0 22 22" fill="none">
                <path d="M11 2C6.5 2 3 6 3 10.5c0 3.2 1.8 5.9 4.5 7.2V20h7v-2.3C17.2 16.4 19 13.7 19 10.5 19 6 15.5 2 11 2z" fill="var(--accent-primary)" fillOpacity="0.15"/>
                <path d="M11 2C6.5 2 3 6 3 10.5c0 3.2 1.8 5.9 4.5 7.2M11 2c4.5 0 8 4 8 8.5-3.5 0-6.5-1.5-8-4.5m0-4V20" stroke="var(--accent-primary)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
              <span style={{
                fontFamily: "var(--font-display)",
                fontSize: 16,
                fontWeight: 600,
                color: "var(--color-soil)",
              }}>
                Farming<span style={{ color: "var(--accent-primary)" }}>AI</span>
              </span>
            </NavLink>
            <p style={{
              marginTop: 8,
              fontSize: 13,
              color: "var(--text-muted)",
              maxWidth: 240,
              lineHeight: 1.6,
            }}>
              Data-driven tools to help farmers grow smarter.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
              marginBottom: 12,
            }}>
              Tools
            </p>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
              {FOOTER_LINKS.map((link) => (
                <li key={link.name}>
                  {link.external ? (
                    <a
                      href={link.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={footerLinkStyle}
                    >
                      {link.name}
                    </a>
                  ) : (
                    <NavLink to={link.path} style={footerLinkStyle}>
                      {link.name}
                    </NavLink>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Data sources */}
          <div>
            <p style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
              marginBottom: 12,
            }}>
              Data Sources
            </p>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
              {["OpenWeatherMap API", "Kaggle Crop Dataset", "data.gov.in Market Prices"].map((src) => (
                <li key={src} style={{ fontSize: 13, color: "var(--text-muted)" }}>{src}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom row */}
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0 }}>
            {year} FarmingAI. Built with open data for better agriculture.
          </p>
          <p style={{ fontSize: 12, color: "var(--color-mist)", margin: 0 }}>
            Powered by Random Forest · Flask · React
          </p>
        </div>
      </div>
    </footer>
  );
}

const footerLinkStyle: React.CSSProperties = {
  fontSize: 13,
  color: "var(--text-secondary)",
  textDecoration: "none",
  transition: "color 0.18s ease",
};