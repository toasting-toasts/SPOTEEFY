import { useState } from "react";
import { useContext } from "react";
import { Context } from "../store/ContextProvider";
import { Link, useNavigate } from "react-router-dom";

export default function LoginPage() {
    const navigate = useNavigate();
    const { login } = useContext(Context);
    const [localUsername, setLocalUsername] = useState("");
    const [localPassword, setLocalPassword] = useState("");
    
    const handleSumbit = async (e) => {
        e.preventDefault();
        const result = await login(localUsername, localPassword);

        if (result.error) {
            alert(result.error); 
            return;
        } else {
            alert(result.message);
            navigate("/");
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

            <button type="submit">Login</button>
        </form>
        <p>Don't have an account yet? </p>
        <Link to="/register">Register here</Link>
   </>)
}