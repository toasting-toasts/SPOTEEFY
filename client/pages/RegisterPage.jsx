import {useState} from "react";
import {Context} from "../store/ContextProvider";
import {useContext} from "react";
import RegisterForm from "../components/RegisterForm";

export default function RegisterPage() {
    const {token, user} = useContext(Context);

    return (
        <>
            {token && user ? <p>Already logged in as {user.username}!</p> : <RegisterForm />}
        </>
    )
}