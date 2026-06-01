import { useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../store/AuthProvider";

export default function LoginPage() {
    const { login } = useContext(AuthContext);
    const [localUsername, setLocalUsername] = useState("");
    const [localPassword, setLocalPassword] = useState("");
    
    const handleSumbit = async (e) => {
        e.preventDefault();
        const result = await login(localUsername, localPassword);

        if (result.error) alert (result.error);
        else alert(result.message);
    }

    

    return (
        <>
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
        <a href="/register">Register here</a>
        </>
    )
}
import { useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../store/AuthProvider";

export default function LoginPage() {
    const { login } = useContext(AuthContext);
    const [localUsername, setLocalUsername] = useState("");
    const [localPassword, setLocalPassword] = useState("");
    
    const handleSumbit = async (e) => {
        e.preventDefault();
        const result = await login(localUsername, localPassword);

        if (result.error) alert (result.error);
        else alert(result.message);
    }

    

    return (
        <>
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
        <a href="/register">Register here</a>
        </>
    )
}