import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { Context } from "../store/ContextProvider";

import "../styles/track.scss";

export default function TrackPage() {
    const { id } = useParams();
    const { fetchTrack, handleTrack, rateTrack, currentTrack, isPlaying} = useContext(Context);

    const [track, setTrack] = useState(null);

    useEffect(() => {
        const load = async () => {
            const data = await fetchTrack(id);
            setTrack(data);
        };

        load();
    }, [id]);

    if (!track) return <div className="loading">Loading...</div>;

    return (
        <div className="track-page">

            <div className="track-container">

                <div className="track-left">
                    <img
                        src={`http://localhost:3000${track.cover_path}`}
                        alt={track.title}
                    />
                </div>

                <div className="track-right">

                    <h1>{track.title}</h1>
                    <h3>{track.author}</h3>

                    <p className="description">
                        {track.description || "No description provided."}
                    </p>

                    <div className="meta">
                        <span>Views: {track.views}</span>
                        <span>Rating: {track.rating}</span>
                    </div>

                    <div className="action-div">

                        <button onClick={() => handleTrack(track)}>
                            {currentTrack?.id===track.id && isPlaying  ?
                                <i className="fa-solid fa-pause"></i>               :
                                <i className="fa-solid fa-play"></i>}
                        </button>

                        <button onClick={() => rateTrack(track.id)}>
                            <i className="fa-solid fa-thumbs-up"></i>
                        </button>

                        {/* <button onClick={() => saveTrack(track.id)}>
                            <i className="fa-solid fa-floppy-disk"></i>
                        </button> */}

                    </div>

                </div>

            </div>

        </div>
    );
}