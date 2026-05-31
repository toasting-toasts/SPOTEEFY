import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import SubmitAudioPage from "../pages/SubmitAudioPage";
import {AuthProvider} from "../store/AuthProvider";

export default function App() {
    return (
        <AuthProvider>
        <BrowserRouter>

        <p>temporary ↆ</p>
        <a href="/login">login</a>
        <a href="/register"> register</a>
        <a href="/submit-audio"> submit audio</a>
        
            <Routes>
                {<Route path="/login" element={<LoginPage />} /> }
                {<Route path="/register" element={<RegisterPage />} /> }
                {<Route path="/submit-audio" element={<SubmitAudioPage />} /> }
            </Routes>

        </BrowserRouter>
        </AuthProvider>
    );
}