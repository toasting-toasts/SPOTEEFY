import {useState, useEffect} from "react";
import { AuthContext } from "../store/AuthProvider";
import { useContext } from "react";

export default function RegisterPage() {
    const {register} = useContext(AuthContext);
    const [localEmail, setLocalEmail] = useState("");
    const [localUsername, setLocalUsername] = useState("");
    const [localPassword, setLocalPassword] = useState("");

    const handleSumbit = async (e) => {
        e.preventDefault();
        const result = await register(localEmail, localUsername, localPassword);

        if (result.error) alert(result.error);
        else alert(result.message);
    }

    return (
        <>
        <h2>Create an account</h2>
        <form onSubmit={handleSumbit} method="POST">

            <label htmlFor="username">Username:</label>
            <input 
                type="text" id="username" placeholder="Username" 
                onChange={(e) => setLocalUsername(e.target.value)}
                value={localUsername}
            />

            <label htmlFor="email">Email:</label>
            <input 
                type="email" id="email" placeholder="Email" 
                onChange={(e) => setLocalEmail(e.target.value)}
                value={localEmail}
            />

            <label htmlFor="password">Password:</label>
            <input 
                type="password" id="password" placeholder="Password" 
                onChange={(e) => setLocalPassword(e.target.value)}
                value={localPassword}
            />
            
            <button type="submit">Register</button>
        </form>
        <p>Already have an account? </p>
        <a href="/login">Login here</a>
        </>
    )
}