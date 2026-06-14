import alertify from "alertifyjs";
import {createContext, useState, useEffect, useRef} from "react";

export const Context = createContext(null);

export function ContextProvider({children}) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentTrack, setCurrentTrack] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [tracks, setTracks] = useState([])
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
        setCurrentTrack(null);
        setIsPlaying(false);
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
            return {error: data.error || "Failed to log in"}
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

        const data = await response.json();

        if (!response.ok || !response) {;
            return {error: data.error || "Failed to register"}
        }

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
        if (!response.ok || !response) {
            alertify.error("Failed to fetch tracks");
            return;
        }
        const data = await response.json() || [];
        setTracks(data.tracks);
        return data;
    }

    const fetchTrack = async (id) => {
        const response = await fetch(
            `http://localhost:3000/audio/${id}`,
            {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );
        
        if (!response.ok || !response) {
            alertify.error("Failed to fetch track");
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
        if (!response.ok || !response) {
            alertify.error("Failed to submit track")
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
            updateViews(track.id)
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
        const data = await res.json()
        if(!data || data.error) {
            alertify.error(data.error || "Couldn't rate")
        }
        return data;
    };

    const updateViews = async (id) => {
        const res = await fetch(`http://localhost:3000/tracks/${id}/view`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if(!res || !await res.json()) alertify.error("Something went wrong");
    }

    return (
        <Context.Provider value={{
            token, user, loading, currentTrack, audioRef, isPlaying, tracks,
            login, logout, register, fetchTracksData, submitTrack, setIsPlaying, handleTrack, rateTrack, fetchTrack
        }}>
            {children}
        </Context.Provider>
    )
}