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
            const { token } = response.data;
            setToken(token);
            navigate("/voting");

        } catch (err) {
            setError(err.response?.data?.error || "Failed to login.");
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h1 className="login-title">Acesso restrito</h1>
                <form onSubmit={handleLogin}>
                    <input
                        type="password"
                        className="login-input"
                        placeholder="Digite a senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {error && <p className="login-error">{error}</p>}
                    <button type="submit" className="login-button">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginScreen;