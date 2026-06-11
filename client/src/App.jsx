import { BrowserRouter, Routes, Route, Link} from "react-router-dom";
import { ContextProvider, Context } from "../store/ContextProvider";
import { useContext, useEffect} from "react";
import { Navigate } from "react-router-dom";

import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import SubmitAudioPage from "../pages/SubmitAudioPage";
import HomePage from "../pages/HomePage";
import TracksPage from "../pages/TracksPage";
import Header from "../components/Header";

import "../styles/app.scss";

function ProtectedRoute({ children }) {
    const { token, loading } = useContext(Context);
    if (loading) return <p>Loading...</p>;
    if (!token) return <Navigate to="/login" />;
    return children;
}

export default function App() {
    return (
        <ContextProvider>
        <BrowserRouter>

        <Header/>
        <main>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/" element={
                    <ProtectedRoute>
                        <HomePage />
                    </ProtectedRoute>
                } />
                <Route path="tracks" element={
                    <ProtectedRoute>
                        <TracksPage />
                    </ProtectedRoute>
                } />
                <Route path="/submit-audio" element={
                    <ProtectedRoute>
                        <SubmitAudioPage />
                    </ProtectedRoute>
                } />
            </Routes>
        </main>
        </BrowserRouter>
        </ContextProvider>
    );
}