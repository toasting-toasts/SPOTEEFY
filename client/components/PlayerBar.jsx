import { useContext, useState, useEffect } from "react";
import { Context } from "../store/ContextProvider";
import { useNavigate } from "react-router";

import "../styles/player.scss";

export default function PlayerBar() {
    const {
        audioRef,
        currentTrack,
        isPlaying,
        setIsPlaying,
        setCurrentTrack,
        handleTrack,
        fetchTrack
    } = useContext(Context);

    const [duration, setDuration] = useState(0);
    const [progress, setProgress] = useState(0);
    const audio = audioRef.current;
    const navigate = useNavigate()

    

    useEffect(() => {
        if (!audio) return;

        const handleLoadedMetadata = () => {
            setDuration(audio.duration);
        };

        const handleTimeUpdate = () => {
            setProgress(audio.currentTime);
        };

        audio.addEventListener("loadedmetadata", handleLoadedMetadata);
        audio.addEventListener("timeupdate", handleTimeUpdate);

        return () => {
            audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
            audio.removeEventListener("timeupdate", handleTimeUpdate);
        };
    }, [audio]);

    const togglePlay = () => {
        handleTrack(currentTrack)
    };

    const seek = (e) => {
        const time = Number(e.target.value);

        audio.currentTime = time;
        setProgress(time);
    };

    const restart = () => {
        audio.currentTime = 0;
    };

    const nextTrack = async () => {
        let track = await fetchTrack(currentTrack.id + 1);

        if (!track) {
            track = await fetchTrack(1);
        }

        if (track) {
            handleTrack(track);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);

        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    if (!currentTrack) return null;
    
    return (
        <div className="player-bar" onClick={()=>navigate(`/track/${currentTrack.id}`)}>
            <div className="player-info">

                <img className="cover" src={`http://localhost:3000${currentTrack.cover_path}`} alt="" />

                <div className="track-meta">
                    <p className="title">{currentTrack.title}</p>
                    <p className="author">{currentTrack.author}</p>
                </div>
            </div>

            <div className="player-controls">

                <button onClick={restart}>
                    <i className="fa-solid fa-backward-step"></i>
                </button>

                <button onClick={togglePlay}>
                    {isPlaying
                        ? <i className="fa-solid fa-pause"></i>
                        : <i className="fa-solid fa-play"></i>
                    }
                </button>

                <button onClick={nextTrack}>
                    <i className="fa-solid fa-forward-step"></i>
                </button>

            </div>

            <div className="player-seek">
                <input
                    type="range"
                    min="0"
                    max={duration || 0}
                    value={progress}
                    onChange={seek}
                />

                <div className="player-time">
                    <span>{formatTime(progress)}</span>
                    /
                    <span>{formatTime(duration)}</span>
                </div>
            </div>

        </div>
    );
}