import { useContext } from "react";
import { Context } from "../store/ContextProvider";

import "../styles/player.scss";

export default function PlayerBar() {
    const {
        audioRef,
        currentTrack,
        isPlaying,
        setIsPlaying,
        setCurrentTrack
    } = useContext(Context);

    const audio = audioRef.current;

    if (!currentTrack) return null;

    const togglePlay = () => {
        if (audio.paused) {
            audio.play();
            setIsPlaying(true);
        } else {
            audio.pause();
            setIsPlaying(false);
        }
    };

    const seek = (e) => {
        audio.currentTime = (e.target.value / 100) * audio.duration;
    };

    const restart = () => {
        audio.currentTime = 0;
    };

    const nextTrack = () => {
        // placeholder for now (you'll later connect playlist logic)
        console.log("next track");
    };

    return (
        <div className="player-bar">

            <div className="player-info">
                <p className="title">{currentTrack.title}</p>
                <p className="author">{currentTrack.author}</p>
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
                    max="100"
                    value = {0}
                    onChange={seek}
                />
            </div>

        </div>
    );
}