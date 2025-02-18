import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginScreen from "./components/LoginScreen";
import ProtectedRoute from "./components/ProtectedRoute";
import VotingScreen from "./components/VotingScreen";
import NotFound from "./pages/NotFound";

import "./styles/main.css";

const App = () => {
    return (
        <Router>
            <Routes>
                {/* Public Route */}
                <Route path="/" element={<LoginScreen />} />

                {/* Protected Route */}
                <Route
                    path="/voting"
                    element={
                        <ProtectedRoute>
                            <VotingScreen />
                        </ProtectedRoute>
                    }
                />

                {/* 404 Page */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
};

export default App;