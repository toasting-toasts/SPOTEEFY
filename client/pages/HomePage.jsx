import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/ContextProvider";

import "../styles/home.scss";

export default function HomePage() {
    const { token } = useContext(Context);
    const navigate = useNavigate();

    return (
        <div className="home-page">

            <div className="hero">

                <h1 className="title">Spoteefy</h1>

                <p className="subtitle">
                    This is not just Spotify, this is SPOTEEFY {/* GENERIC AI TYPE SHIT */}
                </p> {/*це доречі жарт*/}

                <div className="stats">
                    <div className="stat">
                        <h2>10,000+</h2>
                        <p>Songs uploaded</p>
                    </div>

                    <div className="stat">
                        <h2>1M+</h2>
                        <p>Happy users</p>
                    </div>

                    <div className="stat">
                        <h2>24/7</h2>
                        <p>Music streaming</p>
                    </div>
                </div>

                {!token && (
                    <div className="auth-buttons">

                        <button
                            className="primary"
                            onClick={() => navigate("/login")}
                        >
                            Log in
                        </button>

                        <button
                            className="secondary"
                            onClick={() => navigate("/register")}
                        >
                            Register
                        </button>

                    </div>
                )}

                {token && (
                    <button
                        className="primary"
                        onClick={() => navigate("/tracks")}
                    >
                        Go to your music
                    </button>
                )}

            </div>

        </div>
    );
}