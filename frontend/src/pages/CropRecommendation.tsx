import { useState } from "react";
import { predictCrop } from "../services/cropPrediction";
import { motion } from "framer-motion";

// ── Field configuration ──────────────────────────────────────────────────────

const FIELDS = [
  { key: "N",           label: "Nitrogen (N)",          unit: "kg/ha",  placeholder: "e.g. 90",   hint: "Available nitrogen in soil" },
  { key: "P",           label: "Phosphorus (P)",        unit: "kg/ha",  placeholder: "e.g. 42",   hint: "Available phosphorus in soil" },
  { key: "K",           label: "Potassium (K)",         unit: "kg/ha",  placeholder: "e.g. 43",   hint: "Available potassium in soil" },
  { key: "ph",          label: "Soil pH",               unit: "0–14",   placeholder: "e.g. 6.5",  hint: "Acidity / alkalinity of soil" },
  { key: "temperature", label: "Temperature",           unit: "°C",     placeholder: "e.g. 25",   hint: "Average ambient temperature" },
  { key: "humidity",    label: "Humidity",              unit: "%",      placeholder: "e.g. 80",   hint: "Relative humidity" },
  { key: "rainfall",    label: "Rainfall",              unit: "mm",     placeholder: "e.g. 200",  hint: "Average annual rainfall" },
] as const;

type FormKey = typeof FIELDS[number]["key"];
type FormState = Record<FormKey, string>;

// ── Icons ────────────────────────────────────────────────────────────────────

const IconLeaf = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M9 16V9M9 9C9 9 5 7 4 3c3 0 5 2 5 6zM9 9c0 0 4-2 5-6-3 0-5 2-5 6z"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconCheck = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M4 10l5 5 7-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// ── Component ────────────────────────────────────────────────────────────────

const CropRecommendation = () => {
  const initial = FIELDS.reduce((acc, f) => ({ ...acc, [f.key]: "" }), {} as FormState);

  const [formData,   setFormData]   = useState<FormState>(initial);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [imageSrc,   setImageSrc]   = useState<string | null>(null);
  const [error,      setError]      = useState<string | null>(null);
  const [loading,    setLoading]    = useState(false);
  const [warnings,   setWarnings]   = useState<Partial<Record<FormKey, boolean>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value === "" ? "" : parseFloat(value) as unknown as string });
    setWarnings({ ...warnings, [name]: false });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setPrediction(null);
    setError(null);
    setImageSrc(null);

    const newWarnings: Partial<Record<FormKey, boolean>> = {};
    let valid = true;
    FIELDS.forEach(({ key }) => {
      if (!formData[key]) { newWarnings[key] = true; valid = false; }
    });

    if (!valid) { setWarnings(newWarnings); setLoading(false); return; }

    try {
      const numericData = {
        N:           parseFloat(formData.N),
        P:           parseFloat(formData.P),
        K:           parseFloat(formData.K),
        ph:          parseFloat(formData.ph),
        temperature: parseFloat(formData.temperature),
        humidity:    parseFloat(formData.humidity),
        rainfall:    parseFloat(formData.rainfall),
      };
      const result = await predictCrop(numericData);
      if (result.predicted_crop) {
        setPrediction(result.predicted_crop);
        setImageSrc(`/assets/crop_images/${result.predicted_crop.toLowerCase().replace(/\s+/g, "")}.jpg`);
      } else {
        setError(result.error || "Unexpected error occurred.");
      }
    } catch {
      setError("Failed to fetch prediction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Split fields: left col (4) + right col (3)
  const leftFields  = FIELDS.slice(0, 4);
  const rightFields = FIELDS.slice(4);

  return (
    <div className="page-wrapper">
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 24px 72px" }}>

        {/* Page header */}
        <div style={{ marginBottom: 40 }}>
          <span className="section-label" style={{ display: "block", marginBottom: 8 }}>AI Model · Random Forest</span>
          <h1 className="display-heading" style={{ fontSize: "clamp(26px, 3.5vw, 38px)", fontWeight: 500, margin: 0 }}>
            Crop Recommendation
          </h1>
          <p style={{ fontSize: 15, color: "var(--text-secondary)", marginTop: 10, maxWidth: 520 }}>
            Enter your soil nutrient levels and local climate data. The model will return the most suitable crop for your conditions.
          </p>
        </div>

        {/* Two-column layout: form | result */}
        <div style={{
          display: "grid",
          gridTemplateColumns: prediction || error ? "1fr 1fr" : "1fr",
          gap: 28,
          alignItems: "start",
          transition: "grid-template-columns 0.4s ease",
        }} className="crop-layout">

          {/* ── Form card ─────────────────────────────────────────────── */}
          <div style={{
            background: "var(--bg-surface)",
            border: "1px solid var(--border-default)",
            borderRadius: "var(--radius-lg)",
            padding: "32px",
            boxShadow: "var(--shadow-card)",
          }}>
            <p style={{
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
              margin: "0 0 24px",
            }}>
              Soil &amp; Climate Inputs
            </p>

            <form onSubmit={handleSubmit} noValidate>
              {/* Two inner columns */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "18px 24px",
              }}>
                {[...leftFields, ...rightFields].map(({ key, label, unit, placeholder, hint }) => (
                  <div key={key}>
                    <label className="field-label" htmlFor={key}>
                      {label}
                      <span style={{
                        fontWeight: 400,
                        marginLeft: 6,
                        color: "var(--text-muted)",
                        fontSize: 11,
                        textTransform: "none",
                        letterSpacing: 0,
                      }}>
                        ({unit})
                      </span>
                    </label>
                    <input
                      id={key}
                      type="number"
                      name={key}
                      value={formData[key]}
                      onChange={handleChange}
                      placeholder={placeholder}
                      step="0.01"
                      required
                      className={`field-input${warnings[key] ? " error" : ""}`}
                      title={hint}
                    />
                    {warnings[key] && (
                      <p style={{ fontSize: 11, color: "#c0392b", margin: "4px 0 0" }}>Required</p>
                    )}
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div style={{ borderTop: "1px solid var(--border-default)", margin: "28px 0" }} />

              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
                style={{ width: "100%", justifyContent: "center", padding: "12px", fontSize: 14 }}
              >
                {loading ? (
                  <>
                    <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
                    Analyzing…
                  </>
                ) : (
                  <>
                    <IconLeaf /> Recommend a crop
                  </>
                )}
              </button>
            </form>
          </div>

          {/* ── Result panel ──────────────────────────────────────────── */}
          {(prediction || error) && !loading && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {prediction && (
                <div style={{
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border-default)",
                  borderRadius: "var(--radius-lg)",
                  overflow: "hidden",
                  boxShadow: "var(--shadow-card)",
                }}>
                  {/* Crop image */}
                  {imageSrc && (
                    <div style={{
                      width: "100%",
                      height: 200,
                      background: "var(--color-dew)",
                      overflow: "hidden",
                    }}>
                      <img
                        src={imageSrc}
                        alt={prediction}
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                    </div>
                  )}

                  <div style={{ padding: "28px 28px 32px" }}>
                    {/* Badge */}
                    <div style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      background: "var(--color-dew)",
                      border: "1px solid var(--color-mist)",
                      borderRadius: 99,
                      padding: "4px 12px",
                      marginBottom: 16,
                    }}>
                      <span style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "var(--accent-primary)",
                        display: "block",
                      }} />
                      <span style={{ fontSize: 11, fontWeight: 600, color: "var(--accent-primary)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                        Recommended
                      </span>
                    </div>

                    <h2 className="display-heading" style={{
                      fontSize: 32,
                      fontWeight: 500,
                      margin: "0 0 20px",
                      textTransform: "capitalize",
                    }}>
                      {prediction}
                    </h2>

                    {/* Confirmation row */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      {[
                        "Best match for your soil nutrient profile",
                        "Suitable for the climate conditions entered",
                        "Optimized for regional yield performance",
                      ].map((point) => (
                        <div key={point} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                          <span style={{
                            flexShrink: 0,
                            width: 20,
                            height: 20,
                            borderRadius: "50%",
                            background: "var(--color-dew)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "var(--accent-primary)",
                            marginTop: 1,
                          }}>
                            <IconCheck />
                          </span>
                          <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: 0, lineHeight: 1.5 }}>{point}</p>
                        </div>
                      ))}
                    </div>

                    {/* Try again */}
                    <button
                      onClick={() => { setPrediction(null); setImageSrc(null); setError(null); }}
                      style={{
                        marginTop: 28,
                        background: "none",
                        border: "1px solid var(--border-default)",
                        borderRadius: "var(--radius-sm)",
                        padding: "8px 16px",
                        fontSize: 13,
                        color: "var(--text-secondary)",
                        cursor: "pointer",
                        transition: "border-color 0.18s ease",
                        fontFamily: "var(--font-body)",
                      }}
                    >
                      Try different inputs
                    </button>
                  </div>
                </div>
              )}

              {error && (
                <div style={{
                  background: "#fff8f7",
                  border: "1px solid #f5c6c2",
                  borderRadius: "var(--radius-lg)",
                  padding: "28px",
                  color: "#a33",
                }}>
                  <p style={{ fontWeight: 600, fontSize: 14, margin: "0 0 6px" }}>Unable to generate recommendation</p>
                  <p style={{ fontSize: 13, margin: 0, color: "#b55" }}>{error}</p>
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Reference ranges */}
        <div style={{
          marginTop: 36,
          padding: "20px 24px",
          background: "var(--bg-subtle)",
          border: "1px solid var(--border-default)",
          borderRadius: "var(--radius-md)",
        }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 12px" }}>
            Input reference ranges
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 28px" }}>
            {[
              ["N, P, K", "0 – 200 kg/ha"],
              ["pH",      "0 – 14"],
              ["Temp",    "-50 – 60 °C"],
              ["Humidity","0 – 100 %"],
              ["Rainfall","0 + mm"],
            ].map(([k, v]) => (
              <span key={k} style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                <strong style={{ color: "var(--text-primary)", fontWeight: 600 }}>{k}</strong>
                {" · "}{v}
              </span>
            ))}
          </div>
        </div>

      </div>

      <style>{`
        @media (max-width: 700px) {
          .crop-layout { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default CropRecommendation;