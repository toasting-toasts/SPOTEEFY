import { useContext } from "react";
import { Context } from "../store/ContextProvider";

import LoginForm from "../components/LoginForm";

import "../styles/auth.scss";

export default function LoginPage() {
    const { token, user, loading } = useContext(Context);
    if (loading) {
        return (
            <div className="auth-page">
                <div className="auth-card auth-loading">
                    <div className="spinner"></div>
                    <p>Loading session...</p>
                </div>
            </div>
        );
    }
    return (
        <div className="auth-page">
            <div className="auth-card">

                {token && user ? (
                    <p className="logged-in-notif">Already logged in as {user.username}!</p>
                ) : (
                    <LoginForm />
                )}

            </div>
        </div>
    );
}