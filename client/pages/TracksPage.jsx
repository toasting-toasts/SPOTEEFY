import { useContext, useState, useEffect } from "react";
import { Context } from "../store/ContextProvider";

export default function TracksPage(props) {
    const {fetchTracksData} = useContext(Context);
    const [tracks, setTracks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadTracks = async () => {
            const data = await fetchTracksData(0, 20);

            if (data) {
                setTracks(data);
            }

            setLoading(false);
        };

        loadTracks();
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <>
        <ul>
            {tracks.map(track => (
                <li key={track.id}>
                    <img src={`http://localhost:3000${track.cover_path}`} alt={`${track.title} cover`}/>

                    <div className="track-info">
                        <h3>{track.title}</h3>
                        <p>Author: {track.author}</p>
                    </div>
                    
                    <p>{Math.floor(track.duration_s / 60)}:{String(track.duration_s % 60).padStart(2, '0')}</p>

                    <div className="rating">
                        <p>Listens: {track.views}</p>
                        <p>Rating: {track.rating}</p>
                    </div>
                </li>
            ))}
        </ul>
        </>
    );
}