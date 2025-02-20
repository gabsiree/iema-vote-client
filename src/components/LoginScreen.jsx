import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setToken } from "../utils/auth";
import apiClient from "../api/apiClient";

import "../styles/login.css";

const LoginScreen = () => {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const response = await apiClient.post("/auth/login", { password });
            setToken(response.data.token);
            navigate("/voting");

        } catch (err) {
            setError(err.response?.data?.error || "Failed to login...");
        }
    };

    const generateReport = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await apiClient.post("/auth/login", { password });
            await fetchReport();

        } catch (err) {
            setError(err.response?.data?.error || "Failed to generate report...");
        }
    };

    // Fetch and Download Report
    const fetchReport = async () => {
        try {
            const response = await apiClient.get("/report/generate", { responseType: "blob" });

            // Create and trigger download
            const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
            const a = document.createElement("a");
            a.href = url;
            a.download = "Resultado.pdf";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

        } catch (err) {
            alert("Error generating PDF report...");
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h1 className="login-title">Voto confirmado...</h1>
                <form onSubmit={handleLogin}>
                    <input
                        type="password"
                        className="login-input"
                        placeholder="Digite sua senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {error && <p className="login-error">{error}</p>}
                    <button type="submit" className="login-button">
                        Entrar na urna
                    </button>
                </form>

                <button className="report-button" onClick={generateReport}>
                    Gerar relatório
                </button>
            </div>
        </div>
    );
};

export default LoginScreen;