import { Context } from "../store/ContextProvider";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/upload.scss";
import alertify from "alertifyjs";

export default function SubmitAudioPage() {
    const navigate = useNavigate();
    const { submitTrack } = useContext(Context);

    const [audio, setAudio] = useState(null);
    const [cover, setCover] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSumbit = async (e) => {
        e.preventDefault();

        setLoading(true);

        try {
            const formData = new FormData();

            if (!audio) {
                alertify.error("Please select an audio file");
                setLoading(false);
                return;
            }

            formData.append("audio", audio);

            if (cover) {
                formData.append("cover", cover);
            }

            formData.append("title", e.target.title.value);
            formData.append("author", e.target.author.value);
            formData.append("description", e.target.description.value);

            const result = await submitTrack(formData);

            setAudio(null);
            setCover(null);

            if (result.error) {
                alertify.error(result.error);
                setLoading(false);
                return;
            }

            alertify.success(result.message);

            setTimeout(() => {
                navigate("/tracks");
            }, 1000);

        } catch (err) {
            alertify.error("Network error");
        } finally {
            setLoading(false);
        }
    };

    const handleDrop = (e, setter) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) setter(file);
    };

    const handleClear = () => {
        setAudio(null);
        setCover(null);
    };

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
                <p>Uploading track...</p>
            </div>
        );
    }

    return (
        <div className="upload-page">
            <form className="upload-container" onSubmit={handleSumbit}>

                <div className="upload-media">

                    <label className="media-box small"
                        onDrop={(e) => handleDrop(e, setAudio)}
                        onDragOver={(e) => e.preventDefault()}
                    >
                        {audio ? (
                            <span>{audio.name}</span>
                        ) : (
                            <>
                                <span>Audio</span>
                                <input
                                    type="file"
                                    name="audio"
                                    accept="audio/*"
                                    onChange={(e) => setAudio(e.target.files[0])}
                                />
                            </>
                        )}
                    </label>

                    <label className="media-box large"
                        onDrop={(e) => handleDrop(e, setCover)}
                        onDragOver={(e) => e.preventDefault()}
                    >
                        {cover ? (
                            <img
                                src={URL.createObjectURL(cover)}
                                alt="cover"
                            />
                        ) : (
                            <>
                                <i className="fas fa-cloud-upload-alt fa-3x icon"></i>
                                <span>Drop cover image</span>

                                <input
                                    type="file"
                                    name="cover"
                                    accept="image/*"
                                    onChange={(e) => setCover(e.target.files[0])}
                                />
                            </>
                        )}
                    </label>

                </div>

                <div className="upload-info">

                    <h2>Upload track</h2>

                    <input type="text" name="title" placeholder="Title" disabled={loading} />
                    <input type="text" name="author" placeholder="Author" disabled={loading} />
                    <textarea name="description" placeholder="Description (optional)" />
                    
                    <button type="button" className="clear-btn" onClick={handleClear} disabled={loading} >Clear</button>
                    <button type="submit" disabled={loading} >Submit</button>
                </div>

            </form>
        </div>
    );
}