import { BrowserRouter, Routes, Route} from "react-router-dom";
import { ContextProvider, Context } from "../store/ContextProvider";
import { useContext} from "react";
import { Navigate } from "react-router-dom";

import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import SubmitAudioPage from "../pages/SubmitAudioPage";
import HomePage from "../pages/HomePage";
import TracksPage from "../pages/TracksPage";
import Header from "../components/Header";
import PlayerBar from "../components/PlayerBar";
import TrackPage from "../pages/TrackPage"

import "../styles/app.scss";
import "../node_modules/@fortawesome/fontawesome-free/css/all.min.css";
import "alertifyjs/build/css/alertify.min.css";
import alertify from "alertifyjs";

alertify.set("notifier","position", "top-right");
alertify.set("notifier","delay", 2);

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
                <Route path="/" element={<HomePage />} />
                <Route path="/tracks" element={
                    <ProtectedRoute>
                        <TracksPage />
                    </ProtectedRoute>
                } />
                <Route path="/track/:id" element={
                    <ProtectedRoute>
                        <TrackPage />
                    </ProtectedRoute>
                } />
                <Route path="/submit-audio" element={
                    <ProtectedRoute>
                        <SubmitAudioPage />
                    </ProtectedRoute>
                } />
            </Routes>
        </main>

        <PlayerBar/>

        </BrowserRouter>
        </ContextProvider>
    );
}