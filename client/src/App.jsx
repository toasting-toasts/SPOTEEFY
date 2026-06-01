import { BrowserRouter, Routes, Route } from "react-router-dom";
import {AuthProvider} from "../store/AuthProvider";
import {useContext} from "react";
import { AuthContext } from "../store/AuthProvider";
import { Navigate } from "react-router-dom";

import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import SubmitAudioPage from "../pages/SubmitAudioPage";
import HomePage from "../pages/HomePage";

function ProtectedRoute({ children }) {
    const { token } = useContext(AuthContext);
    if (!token) return (<Navigate to="/login" />);
    return children;
}

export default function App() {
    return (
        <AuthProvider>
        <BrowserRouter>

        <p>temporary ↆ</p>
        <a href="/login">login</a>
        <a href="/register"> register</a>
        <a href="/submit-audio"> submit audio</a>
        
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