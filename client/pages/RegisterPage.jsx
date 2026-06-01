import {useState} from "react";
import {AuthContext} from "../store/AuthProvider";
import {useContext} from "react";
import RegisterForm from "../components/RegisterForm";

export default function RegisterPage() {
    const {token, user} = useContext(AuthContext);

    return (
        <>
            {token && user ? <p>Already logged in as {user.username}!</p> : <RegisterForm />}
        </>
    )
}