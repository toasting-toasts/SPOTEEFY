import { useState } from "react";
import { useContext } from "react";
import { Context } from "../store/ContextProvider";
import { Link, useNavigate } from "react-router-dom";

import "../styles/auth.scss";
import alertify from "alertifyjs";

export default function LoginPage() {
    const navigate = useNavigate();
    const { login } = useContext(Context);
    const [localUsername, setLocalUsername] = useState("");
    const [localPassword, setLocalPassword] = useState("");;
    
    const handleSumbit = async (e) => {
        e.preventDefault();

        try {
            const result = await login(localUsername, localPassword);

            if (!result) {
                alertify.error("No response from server");
                return;
            }

            if (result.error) {
                alertify.error(result.error);
                return;
            }

            alertify.success(result.message);
            navigate("/");
        } catch (err) {
            alertify.error("Network error");
        }
    }

    return (<>
        <h2>Welcome back, user!</h2>
        <form onSubmit={handleSumbit}>

            <label htmlFor="username">Username:</label>
            <input 
                type="text" id="username" placeholder="Username" 
                value={localUsername} onChange={(e) => setLocalUsername(e.target.value)} 
            />
            
            <label htmlFor="password">Password:</label>
            <input 
                type="password" id="password" placeholder="Password" 
                value={localPassword} onChange={(e) => setLocalPassword(e.target.value)} 
            />

            <button type="submit">Log in</button>
        </form>

        <div className="auth-footer">
            <span>Don't have an account yet? </span>
            <Link to="/register">Register here</Link>
        </div>
    </>)
}