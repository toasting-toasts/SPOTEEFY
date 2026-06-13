import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/ContextProvider";
import "../styles/tracks.scss";

export default function TracksPage() {
    const { fetchTracksData, handleTrack, rateTrack, isPlaying, currentTrack } = useContext(Context);
    const navigate = useNavigate();

    const [tracks, setTracks] = useState([]);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const LIMIT = 20;

    useEffect(() => {
        const loadTracks = async () => {
            setLoading(true);

            const data = await fetchTracksData((page - 1) * LIMIT, LIMIT);

            if (data) {
                setTracks(data.tracks || []);
                setTotalPages(Math.ceil((data.total || 0) / LIMIT));
            }

            setLoading(false);
        };

        loadTracks();
    }, [page]);

    if (loading) {
        return (
            <div className="tracks-loading">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="tracks-page">
            <div className="pagination">
                <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                >
                    Prev
                </button>

                <span>
                    Page {page} / {totalPages}
                </span>

                <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                >
                    Next
                </button>
            </div>

            <ul className="tracks-list">
                {tracks.map(track => (
                    <li
                        className="track-card"
                        key={track.id}
                        onClick={() => navigate(`/track/${track.id}`)}
                    >

                        <img
                            className="track-cover"
                            src={`http://localhost:3000${track.cover_path}`}
                            alt={`${track.title} cover`}
                        />

                        <div className="track-info">
                            <h3>{track.title}</h3>
                            <p>{track.author}</p>

                            <div className="track-meta">
                                <span>
                                    {Math.floor(track.duration_s / 60)}:
                                    {String(track.duration_s % 60).padStart(2, "0")}
                                </span>

                                <span>Views: {track.views}</span>
                                <span>Rating: {track.rating}</span>
                            </div>
                        </div>

                        <div className="track-actions">

                            <button 
                                className="play-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleTrack(track);
                                }}
                            >
                                {currentTrack?.id===track.id && isPlaying  ?
                                <i className="fa-solid fa-pause"></i>               :
                                <i className="fa-solid fa-play"></i>}
                            </button>

                            <button
                                className="rate-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    rateTrack(track.id);
                                }}
                            >
                                <i className="fa-solid fa-thumbs-up"></i>
                            </button>
                            <button
                                className="save-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    // saveFavorite(track.id);
                                }}
                            >
                                <i className="fa-solid fa-floppy-disk"></i>
                            </button>

                        </div>

                    </li>
                ))}
            </ul>
        </div>
    );
}