import { BrowserRouter, Routes, Route, Link} from "react-router-dom";
import {AuthProvider} from "../store/AuthProvider";
import { useContext, useState} from "react";
import { AuthContext } from "../store/AuthProvider";
import { Navigate } from "react-router-dom";

import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import SubmitAudioPage from "../pages/SubmitAudioPage";
import HomePage from "../pages/HomePage";

function ProtectedRoute({ children }) {
    const { token, loading } = useContext(AuthContext);
    if (loading) return <p>Loading...</p>;
    if (!token) return <Navigate to="/login" />;
    return children;
}

export default function App() {
    const [loading, setLoading] = useState(true);

    return (
        <AuthProvider>
        <BrowserRouter>

        <p>temporary ↆ</p>
        <Link to="/login">login</Link>--
        <Link to="/register">register</Link>--
        <Link to="/submit-audio">submit audio</Link>

            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/" element={
                    <ProtectedRoute>
                        <HomePage />
                    </ProtectedRoute>
                } />
                <Route path="/submit-audio" element={
                    <ProtectedRoute>
                        <SubmitAudioPage />
                    </ProtectedRoute>
                } />
            </Routes>

        </BrowserRouter>
        </AuthProvider>
    );
}