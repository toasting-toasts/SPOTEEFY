import { useContext } from "react";
import { Context } from "../store/ContextProvider";

export default function TracksPage(props) {
    const {token, fetchTracksData} = useContext(Context);
    return (
        <>
        <ul>
        </ul>
        </>
    );
}