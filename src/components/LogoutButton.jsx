import React from "react";
import { useNavigate } from "react-router-dom";
import { removeToken } from "../utils/auth";

const LogoutButton = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        removeToken();
        navigate("/");
    };

    return (
        <button onClick={handleLogout} className="logout-button">
            Logout
        </button>
    );
};

export default LogoutButton;