import React, { useEffect, useState } from "react";
import { BioniqQuizWidget } from "./survey-widget";

const STORAGE_KEY = "bq_playground_config";

const DEFAULTS = {
  questionnaire_key: "hlf_questionnaire_test",
  questionnaire_theme: "blue_orange",
  distributor_id: "1234",
  email_to_prefill: "igor@bioniq.com",
  name_to_prefill: "TEST01",
  country_code: "US",
  locale: "en",
  host_context: "react-demo",
  callback_url: "https://bioniq.com/products/go",
  selector: "#app",
  additional_data: JSON.stringify({ source: "direct-mail" }, null, 2),
};

export const BioniqPlayground = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Aktualizacja stanu przy zmianie rozmiaru okna
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // --- UI State ---
  const [showAdvanced, setShowAdvanced] = useState(false);

  // --- Logic State ---
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

  // const handleReset = () => {
  //   localStorage.removeItem(STORAGE_KEY);
  //   window.location.reload();
  // };
  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: isMobile ? "column" : "row",
    minHeight: "100vh",
    background: "#0a0a0a",
    fontFamily: "sans-serif",
  };

  const sidebarStyle: React.CSSProperties = {
    flex: isMobile ? "none" : "0 0 280px",
    width: isMobile ? "100%" : "280px",
    background: "#141414",
    padding: isMobile ? "15px" : "25px",
    borderRight: isMobile ? "none" : "1px solid #222",
    borderBottom: isMobile ? "1px solid #222" : "none",
    overflowY: "auto",
    boxSizing: "border-box",
  };

  const mainStyle: React.CSSProperties = {
    flex: 1,
    padding: isMobile ? "10px" : "20px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    background: "#0a0a0a",
    height: isMobile ? "auto" : "100vh",
  };

  const widgetCanvasStyle: React.CSSProperties = {
    flex: 1,
    background: "#fff",
    borderRadius: "12px",
    overflow: "hidden",
    minHeight: isMobile ? "600px" : "auto", // Ważne dla mobile
    display: "flex",
    flexDirection: "column",
  };

  const toggleButtonStyle: React.CSSProperties = {
    fontSize: "11px",
    color: "#888",
    cursor: "pointer",
    padding: "10px 0",
    userSelect: "none",
    fontWeight: "bold",
    textAlign: "center",
    border: "1px dashed #333",
    borderRadius: "6px",
    margin: "10px 0",
  };

  const advancedContainerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    padding: "15px",
    background: "#1a1a1a",
    borderRadius: "8px",
    border: "1px solid #333",
    marginBottom: "15px",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "10px",
    fontWeight: "bold",
    textTransform: "uppercase",
    marginBottom: "6px",
    display: "block",
    color: "#666",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px",
    background: "#1f1f1f",
    border: "1px solid #333",
    borderRadius: "6px",
    fontSize: "13px",

    boxSizing: "border-box",
  };

  const applyButtonStyle: React.CSSProperties = {
    width: "100%",
    padding: "16px",
    background: "#266431",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
    color: "#fff",
    fontSize: "14px",
  };

  const sectionStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
  };

  return (
    <div style={containerStyle}>
      <div style={sidebarStyle}>
        <h2 style={{ marginBottom: "20px", color: "#fff" }}>Control Panel</h2>

        <form
          onSubmit={handleApply}
          style={{ display: "flex", flexDirection: "column", gap: "20px" }}
        >
          <section
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
            }}
          >
            <div>
              <label style={labelStyle}>Country</label>

              <select
                name="country_code"
                value={config.country_code}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="US">United States</option>
                <option value="ES">Spain</option>
                <option value="PL">Poland</option>
                <option value="RO">Romania</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Locale</label>
              <select
                name="locale"
                value={config.locale}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="es-ES">es-ES</option>
                <option value="en-US">en-US</option>
                <option value="en-GB">en-GB</option>
                <option value="pl-PL">pl-PL</option>
                <option value="ro-RO">ro-RO</option>
              </select>
            </div>
          </section>

          {/* --- ADVANCED SETTINGS TOGGLE --- */}
          <div
            onClick={() => setShowAdvanced(!showAdvanced)}
            style={toggleButtonStyle}
          >
            {showAdvanced
              ? "▼ Hide Advanced Settings"
              : "▶ Show Advanced Settings"}
          </div>

          {/* --- HIDDEN ADVANCED SECTION --- */}
          {showAdvanced && (
            <div style={advancedContainerStyle}>
              {/* --- ALWAYS VISIBLE SECTION --- */}
              <section style={sectionStyle}>
                <label style={labelStyle}>Choose Survey</label>
                <select
                  name="questionnaire_key"
                  value={config.questionnaire_key}
                  onChange={handleChange}
                  style={inputStyle}
                >
                  <option value="hlf_questionnaire">HLF QUIZ Legacy</option>
                  <option value="hlf_questionnaire_test">
                    HLF QUIZ - In Progress
                  </option>
                </select>
              </section>
              <section style={sectionStyle}>
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
              </section>

              <section style={sectionStyle}>
                <label style={labelStyle}>Redirection URL</label>
                <input
                  name="callback_url"
                  value={config.callback_url}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </section>

              <section style={sectionStyle}>
                <label style={labelStyle}>Lead Prefill (Email)</label>
                <input
                  name="email_to_prefill"
                  value={config.email_to_prefill}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </section>

              <section style={sectionStyle}>
                <label style={labelStyle}>Additional Data (JSON)</label>
                <textarea
                  name="additional_data"
                  value={config.additional_data}
                  onChange={handleChange}
                  style={{
                    ...inputStyle,
                    minHeight: "80px",
                    fontFamily: "monospace",
                    fontSize: "10px",
                  }}
                />
              </section>
            </div>
          )}

          <div
            style={{
              marginTop: "10px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <button type="submit" style={applyButtonStyle}>
              Apply new settings
            </button>
            {/* <button
              type="button"
              onClick={handleReset}
              style={resetButtonStyle}
            >
              Reset Defaults
            </button> */}
          </div>
        </form>
      </div>

      <div style={mainStyle}>
        {/* <div style={statusBarStyle}>
          <span>
            Status: <strong style={{ color: "#4CAF50" }}>Active</strong>
          </span>
          <span>
            Config: <code>{config.questionnaire_key}</code>
          </span>
        </div> */}

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
