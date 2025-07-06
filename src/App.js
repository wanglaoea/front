import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

function App() {
  const [Topic, setTopic] = useState("");
  const [article, setArticle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");
  const articleRef = useRef(null);

  // Generate Artikel
  const generateArticle = async () => {
    if (!Topic.trim()) {
      setError("Topic tidak boleh kosong!");
      return;
    }
    if (Topic.length > 512) {
      setError("Topic Maksimal 512 karakter.");
      return;
    }
    setLoading(true);
    setError(null);
    setCopied(false);
    try {
      const { data } = await axios.post("https://back-7gkt.onrender.com", { Topic });
      setArticle(data.text);
    } catch (error) {
      console.error("Error saat mengambil data:", error.response ? error.response.data : error.message);
      setArticle("Retry");
      setError("Gagal menghasilkan artikel.");
    }
    setLoading(false);
  };

  // Copy ke Clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(article);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Auto-scroll ke hasil artikel
  useEffect(() => {
    if (articleRef.current && article) {
      articleRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [article]);

  // Toggle Dark Mode
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Monospace', sans-serif",
        backgroundColor: darkMode ? "#1a1a1a" : "#f8f9fa",
        color: darkMode ? "#ffffff" : "#000000",
        transition: "background-color 0.3s ease, color 0.3s ease",
        padding: "20px",
      }}
    >
      <div style={{ width: "100%", maxWidth: "500px", textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h1 style={{ fontSize: "30px", fontWeight: "bold" }}> ARTICLE </h1>
          <button
            onClick={toggleDarkMode}
            style={{
              padding: "10px 14px",
              borderRadius: "15px",
              border: "3px",
              cursor: "pointer",
              backgroundColor: darkMode ? "#f0f0f0" : "#333",
              color: darkMode ? "#000" : "#fff",
              fontSize: "14px",
              transition: "background-color 0.3s ease, color 0.3s ease",
            }}
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
        <input
          type="text"
          placeholder="Masukkan Topic artikel..."
          value={Topic}
          onChange={(e) => setTopic(e.target.value)}
          maxLength={100}
          style={{
            width: "90%",
            padding: "12px",
            fontSize: "16px",
            marginBottom: "12px",
            borderRadius: "15px",
            border: "1px solid #ccc",
            backgroundColor: darkMode ? "#333" : "#fff",
            color: darkMode ? "#fff" : "#000",
            transition: "background-color 0.3s ease, color 0.3s ease",
            textAlign: "center",
          }}
        />
        {error && <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>}
        <button
          onClick={generateArticle}
          style={{
            width: "50%",
            padding: "12px",
            fontSize: "14px",
            borderRadius: "15px",
            border: "2 px",
            cursor: loading ? "not-allowed" : "pointer",
            backgroundColor: loading ? "#6c757d" : "#007bff",
            color: "#ffffff",
            transition: "opacity 0.3s ease",
          }}
          disabled={loading}
        >
          {loading ? "⏳Generating.." : "GENERATE"}
        </button>
      </div>
      {article && (
        <button
          onClick={copyToClipboard}
          style={{
            marginTop: "10px",
            padding: "10px 14px",
            borderRadius: "10px",
            border: "none",
            cursor: "pointer",
            backgroundColor: "#28a745",
            color: "#fff",
            fontSize: "14px",
            transition: "background-color 0.3s ease",
          }}
        >
          {copied ? "Copied!" : "Copy Article"}
        </button>
      )}
      {article && (
        <div
          ref={articleRef}
          style={{
            marginTop: "20px",
            padding: "15px",
            borderRadius: "15px",
            backgroundColor: darkMode ? "#222" : "#fff",
            color: darkMode ? "#fff" : "#000",
            border: "1px solid #ccc",
            maxWidth: "500px",
            lineHeight: "1.6",
            whiteSpace: "normal",
          }}
        >
          <style>
            {`
              h1 {
                text-align: center;
              }
              h2,h3,h4 {
                text-align: left;
              }
              p {
                text-align: justify;
              }
            `}
          </style>
          <div
            dangerouslySetInnerHTML={{
              __html: article.trim() !== "" ? article : "<p>Artikel belum tersedia.</p>"
            }}
          />
        </div>
      )}
    </div>
  );
}

export default App;
