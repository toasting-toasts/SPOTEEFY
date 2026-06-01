import {createContext, useState, useEffect} from "react";

export const AuthContext = createContext(null);

export function AuthProvider({children}) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            setToken(storedToken);
            fetchUser(storedToken);
        }
    }, [])

    const fetchUser = async (token) => {
        const response = await fetch("http://localhost:3000/auth/me", {
            headers: {
                "authorization": `Bearer ${token}`
            }
        });
        if (response.ok) {
            const userData = await response.json();
            setUser(userData);
        } else {
            logout();
        }
    }

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("token");
    }

    const login = async (username, password) => {
        const response = await fetch("http://localhost:3000/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();
        setToken(data.token);
        localStorage.setItem("token", data.token);
        await fetchUser(data.token);

        return data;
    }

    const register = async (email, username, password) => {
        const response = await fetch(
        "http://localhost:3000/auth/register", 
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                username: username,
                password: password
            })
        })
        const data = await response.json();

        setToken(data.token);
        localStorage.setItem("token", data.token);
        await fetchUser(data.token);

        return data;
    }

    return (
        <AuthContext.Provider value={{token, user, login, logout, register}}>
            {children}
        </AuthContext.Provider>
    )
}