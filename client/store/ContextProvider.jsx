import {createContext, useState, useEffect, useRef} from "react";

export const Context = createContext(null);

export function ContextProvider({children}) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentTrack, setCurrentTrack] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(new Audio());

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            setToken(storedToken);
            fetchUser(storedToken);
        }
        setLoading(false);
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
        setLoading(true);
        const response = await fetch("http://localhost:3000/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();

        if (!response.ok) {
            setLoading(false);
            return {error: data.error || "Failed to deliver"}
        }
        
        setToken(data.token);
        localStorage.setItem("token", data.token);
        await fetchUser(data.token);

        setLoading(false);
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

        if (!response.ok) {;
            throw new Error("Registration failed");
        }

        const data = await response.json();

        setToken(data.token);
        localStorage.setItem("token", data.token);
        await fetchUser(data.token);

        return data;
    }

    const fetchTracksData = async (start, amount) => {
        const response = await fetch(
            `http://localhost:3000/tracks?start=${start}&amount=${amount}`,
            {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );
        if (!response.ok) {
            console.error("Failed to fetch tracks");
            return;
        }
        return await response.json();
    }

    const submitTrack = async (formData) => {
        const response = await fetch(
            "http://localhost:3000/audio/submit",
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: formData
            }
        );
        if (!response.ok) {
            throw new Error("Failed to submit track");
        }
        const data = await response.json();
        return data;
    }

    const handleTrack = async (track) => {
        const audio = audioRef.current;
        
        if (currentTrack?.id === track.id) {
            if (audio.paused) {
                await audio.play();
                setIsPlaying(true);
            } else {
                audio.pause();
                setIsPlaying(false);
            }
            return;
        }
    
        audio.pause();
    
        audio.src = `http://localhost:3000/audio/stream/${track.id}`;
    
        audio.onended = () => {
            setIsPlaying(false);
            setCurrentTrack(null)
        };
    
        await audio.play();
    
        setCurrentTrack(track);
        setIsPlaying(true);
    };

    const rateTrack = async (id) => {
        const res = await fetch(`http://localhost:3000/tracks/${id}/rate`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return await res.json();
    };

    return (
        <Context.Provider value={{
            token, user, loading, currentTrack, audioRef, isPlaying,
            login, logout, register, fetchTracksData, submitTrack, setIsPlaying, handleTrack, rateTrack
        }}>
            {children}
        </Context.Provider>
    )
}