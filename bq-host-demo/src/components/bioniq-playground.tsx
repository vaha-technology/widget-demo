import React, { useState } from "react";
import { BioniqQuizWidget } from "./survey-widget";

const STORAGE_KEY = "bq_playground_config";

const DEFAULTS = {
  questionnaire_key: "bioniq-questionnaire-shopify",
  questionnaire_theme: "blue_orange",
  distributor_id: "1234",
  email_to_prefill: "igor@bioniq.com",
  name_to_prefill: "Igor Bioniq",
  country_code: "GB",
  host_context: "react-demo",
  callback_url: "https://bioniq.com/products/go", // Default redirection
  selector: "#app",
  additional_data: JSON.stringify({ source: "direct-mail" }, null, 2),
};

export const BioniqPlayground = () => {
  const [config, setConfig] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : DEFAULTS;
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setConfig((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    window.location.reload();
  };

  const handleReset = () => {
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
  };

  return (
    <div style={containerStyle}>
      {/* --- SIDEBAR: ADVANCED CONTROLS --- */}
      <div style={sidebarStyle}>
        <h2 style={{ marginBottom: "5px" }}>Bioniq SDK Console</h2>

        <form
          onSubmit={handleApply}
          style={{ display: "flex", flexDirection: "column", gap: "15px" }}
        >
          <section>
            <label style={labelStyle}>Core Identity</label>
            <select
              name="questionnaire_key"
              value={config.questionnaire_key}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="bioniq-questionnaire-shopify">
                Shopify Default
              </option>
              <option value="go_female_preset_quiz">Female Preset</option>
              <option value="go_memory_preset_quiz">Memory Preset</option>
            </select>
          </section>

          {/* --- NEW: REDIRECTION LOGIC --- */}
          <section>
            <label style={labelStyle}>Redirection & Handshake</label>
            <input
              name="callback_url"
              placeholder="Callback URL (After finish)"
              value={config.callback_url}
              onChange={handleChange}
              style={inputStyle}
            />
            <div style={{ fontSize: "10px", color: "#555", marginTop: "4px" }}>
              Redirects here after <code>quizFinished</code>.
            </div>
          </section>

          <section
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
            }}
          >
            <div>
              <label style={labelStyle}>UI Theme</label>
              <select
                name="questionnaire_theme"
                value={config.questionnaire_theme}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="blue_orange">Blue Orange</option>
                <option value="dark_mode">Dark Mode</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Locale</label>
              <input
                name="country_code"
                value={config.country_code}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>
          </section>

          <section>
            <label style={labelStyle}>Lead Prefill</label>
            <input
              name="email_to_prefill"
              placeholder="Email"
              value={config.email_to_prefill}
              onChange={handleChange}
              style={inputStyle}
            />
          </section>

          <section>
            <label style={labelStyle}>Additional Data (JSON)</label>
            <textarea
              name="additional_data"
              value={config.additional_data}
              onChange={handleChange}
              style={{
                ...inputStyle,
                minHeight: "60px",
                fontFamily: "monospace",
                fontSize: "10px",
              }}
            />
          </section>

          <div style={{ marginTop: "10px" }}>
            <button type="submit" style={applyButtonStyle}>
              Apply & Re-mount
            </button>
            <button
              type="button"
              onClick={handleReset}
              style={resetButtonStyle}
            >
              Reset to Defaults
            </button>
          </div>
        </form>
      </div>

      {/* --- MAIN PREVIEW AREA --- */}
      <div style={mainStyle}>
        <div style={statusBarStyle}>
          <span>
            Status: <strong style={{ color: "#4CAF50" }}>Active</strong>
          </span>
          <span>
            Redirect:{" "}
            <code style={{ fontSize: "11px" }}>{config.callback_url}</code>
          </span>
        </div>

        <div style={widgetCanvasStyle}>
          <BioniqQuizWidget
            {...config}
            additional_data={JSON.parse(config.additional_data || "{}")}
          />
        </div>
      </div>
    </div>
  );
};

// --- STYLES (Keep as before, just added minor tweaks) ---
const containerStyle: React.CSSProperties = {
  display: "flex",
  minHeight: "100vh",
  background: "#0a0a0a",

  fontFamily: "sans-serif",
};
const sidebarStyle: React.CSSProperties = {
  flex: "0 0 340px",
  background: "#141414",
  padding: "25px",
  borderRight: "1px solid #222",
  overflowY: "auto",
};
const mainStyle: React.CSSProperties = {
  flex: 1,
  padding: "30px",
  display: "flex",
  flexDirection: "column",
  gap: "20px",
};
const statusBarStyle: React.CSSProperties = {
  display: "flex",
  gap: "25px",
  fontSize: "12px",
  background: "#1a1a1a",
  padding: "12px 20px",
  borderRadius: "8px",
  border: "1px solid #333",
};
const widgetCanvasStyle: React.CSSProperties = {
  flex: 1,
  background: "#fff",
  borderRadius: "12px",
  overflow: "hidden",
};
const labelStyle: React.CSSProperties = {
  fontSize: "10px",
  fontWeight: "bold",

  textTransform: "uppercase",
  marginBottom: "6px",
  display: "block",
};
const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px",
  background: "#1f1f1f",
  border: "1px solid #333",

  borderRadius: "6px",
  fontSize: "13px",
};
const applyButtonStyle: React.CSSProperties = {
  width: "100%",
  padding: "14px",
  background: "#266431",

  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold",
};
const resetButtonStyle: React.CSSProperties = {
  width: "100%",
  marginTop: "12px",
  background: "transparent",
  border: "1px solid #333",

  cursor: "pointer",
  borderRadius: "6px",
  padding: "8px",
};
