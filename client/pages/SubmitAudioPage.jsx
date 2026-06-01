import { AuthContext } from "../store/AuthProvider";
import { useContext } from "react";

export default function SubmitAudioPage() {
    const { token } = useContext(AuthContext);
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const result = await fetch("http://localhost:3000/audio/submit", {
            method: "POST",
            headers: {"authorization": `Bearer ${token}`},
            body: formData
        });
    }
    return (
        <>
        <h2>Submit your audio here!</h2>
        <form action="" onSubmit={handleSubmit}>

            <label htmlFor="audio">Audio:</label>
            <input type="file" id="audio" name="audio" accept="audio/*" />

            <label htmlFor="cover">Cover Image(not required):</label>
            <input type="file" id="cover" name="cover" accept="image/*" />

            <label htmlFor="title">Title:</label>
            <input type="text" id="title" name="title" />

            <label htmlFor="author">Author:</label>
            <input type="text" id="author" name="author" />
            
            <label htmlFor="description">Description:</label>
            <input type="text" id="description" name="description" />

            <button type="submit">Submit</button>
        </form>
        </>
    )
}