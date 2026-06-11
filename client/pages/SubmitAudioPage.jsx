import { Context } from "../store/ContextProvider";
import { useContext, useState } from "react";
import "../styles/upload.scss";

export default function SubmitAudioPage() {
    const { submitTrack } = useContext(Context);

    const [audio, setAudio] = useState(null);
    const [cover, setCover] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();

        if (audio) formData.append("audio", audio);
        if (cover) formData.append("cover", cover);

        formData.append("title", e.target.title.value);
        formData.append("author", e.target.author.value);
        formData.append("description", e.target.description.value);

        await submitTrack(formData);
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

    return (
        <div className="upload-page">
            <form className="upload-container" onSubmit={handleSubmit}>

                <div className="upload-media">

                    <label className="media-box small"
                        onDrop={(e) => handleDrop(e, setAudio)}
                        onDragOver={(e) => e.preventDefault()}
                    >
                        {audio ? (
                            <span>{audio.name}</span>
                        ) : (
                            <>
                                <i className="fas fa-cloud-upload fa-3x icon"></i>
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

                    <input type="text" name="title" placeholder="Title" />
                    <input type="text" name="author" placeholder="Author" />
                    <textarea name="description" placeholder="Description (optional)" />
                    
                    <button type="button" className="clear-btn" onClick={handleClear}>Clear</button>
                    <button type="submit">Submit</button>
                </div>

            </form>
        </div>
    );
}