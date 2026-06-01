import LoginForm from "../components/LoginForm";
import { useContext } from "react";
import { AuthContext } from "../store/AuthProvider";

export default function LoginPage() {
    const { token, user } = useContext(AuthContext);
    return (
        <>
        {token&&user ? <p>Already logged in as {user.username}!</p> : <LoginForm />}
        </>
    )
}