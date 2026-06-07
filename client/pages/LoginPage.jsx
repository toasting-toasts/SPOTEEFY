import LoginForm from "../components/LoginForm";
import { useContext } from "react";
import { Context } from "../store/ContextProvider";

export default function LoginPage() {
    const { token, user } = useContext(Context);
    return (
        <>
        {token&&user ? <p>Already logged in as {user.username}!</p> : <LoginForm />}
        </>
    )
}