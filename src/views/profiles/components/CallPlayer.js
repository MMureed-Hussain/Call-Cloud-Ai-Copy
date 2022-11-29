/* eslint-disable */
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useRef } from "react";
import { setNowPlaying } from "../../../redux/profiles";

export default ({ callId }) => {
    const dispatch = useDispatch();

    const nowPlaying = useSelector((state) => state.profiles.nowPlaying);
    const audioElement = useRef();

    useEffect(() => {
        if (nowPlaying && nowPlaying != callId) {
            audioElement.current.pause(); //stop previous audio if new one is played
        }
    }, [nowPlaying]);

    return (
        <>
            <div className="d-flex justify-content-center">
                <div className="overflow-hidden">
                    <audio style={{"height":"30px"}} controls ref={audioElement} onPlay={() => dispatch(setNowPlaying(callId))}>
                        <source
                            src={`${process.env.REACT_APP_API_ENDPOINT}/audio-stream/${callId}`}
                            type="audio/ogg"
                        />
                        <source
                            src={`${process.env.REACT_APP_API_ENDPOINT}/audio-stream/${callId}`}
                            type="audio/mpeg"
                        />
                    </audio>
                </div>
            </div>
        </>
    );
};
