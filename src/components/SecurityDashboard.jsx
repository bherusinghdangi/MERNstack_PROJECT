import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:4000",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

const styles = {
  page: {
    minHeight: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
  },
  container: {
    background: "rgba(255, 255, 255, 0.05)",
    padding: "40px",
    borderRadius: "24px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    width: "100%",
    maxWidth: "400px",
    backdropFilter: "blur(10px)",
  },
  heading: {
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "24px",
    color: "#bef264",
    textAlign: "center",
  },
  text: {
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
    marginBottom: "20px",
  },
  link: {
    color: "#bef264",
    textDecoration: "none",
    fontWeight: "600",
  },
  button: {
    width: "100%",
    padding: "14px",
    background: "#bef264",
    color: "#000",
    border: "none",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    marginBottom: "12px",
    transition: "transform 0.2s, background 0.2s",
  },
};

export const SecurityDashboard = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    window.location.reload();
  };

  const enable2FA = async () => {
    try {
      await API.post('/auth/enable-2fa');
      navigate('/verify-2fa');
    } catch (err) {
      alert(err.response?.data?.error || "Failed to enable 2FA");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h2 style={styles.heading}>Account Security</h2>

        <p style={styles.text}>Manage your two-factor authentication and password settings.</p>

        <p style={styles.text}>
          <Link style={styles.link} to="/change-password">
            Change Password
          </Link>
        </p>

        <button
          style={styles.button}
          onClick={enable2FA}
        >
          Enable 2FA
        </button>

        <button
          style={{ ...styles.button, background: "rgba(255,0,0,0.1)", color: "#ff4444", border: "1px solid rgba(255,0,0,0.2)" }}
          onClick={logout}
        >
          Logout Session
        </button>
      </div>
    </div>
  );
};
