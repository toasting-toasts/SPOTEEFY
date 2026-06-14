import { useState, useContext } from "react";
import { Context } from "../store/ContextProvider";
import {Link, useNavigate} from "react-router-dom";
import alertify from "alertifyjs";

export default function RegisterForm(){
    const {register} = useContext(Context);
    const navigate = useNavigate();
    const [localEmail, setLocalEmail] = useState("");
    const [localUsername, setLocalUsername] = useState("");
    const [localPassword, setLocalPassword] = useState("");

    const handleSumbit = async (e) => {
        e.preventDefault();
        const result = await register(localEmail, localUsername, localPassword);

        if(!result) alertify.error("No response from server")

        if (result.error) {
            alertify.error(result.error); 
            return;
        } else {
            alertify.success(result.message);
            navigate("/");
        }
    }

    return(<>
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
        <div className="auth-footer">
            <span>Alredy have existing account?</span>
            <Link to="/login">Log in here</Link>
        </div>
    </>)
}