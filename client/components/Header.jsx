import { useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/ContextProvider";
import "../styles/header.scss";

export default function Header() {
    const { user, token, logout } = useContext(Context);
    const isAuth = !!token;

    return (
        <header className="header">
            <div className="left">
                <Link to="/" className="logo">Spoteefy</Link>

                {isAuth && (
                    <>
                        <Link to="/">Home</Link>
                        <Link to="/tracks">Tracks</Link>
                        <Link to="/submit-audio">Upload</Link>
                    </>
                )}
            </div>

            <div className="right">
                {!isAuth ? (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                ) : (
                    <>
                        <span className="username">{user?.username}</span>
                        <button onClick={logout}>Logout</button>
                    </>
                )}
            </div>
        </header>
    );
}