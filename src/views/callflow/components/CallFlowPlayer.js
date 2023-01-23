/* eslint-disable */
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useRef } from "react";
import { setNowPlaying } from "../../../redux/profiles";
import { UncontrolledButtonDropdown, DropdownMenu, DropdownItem, DropdownToggle } from 'reactstrap';
import { ChevronDown } from "react-feather"
import { useState } from "react";

export default ({ callId, container = "body" }) => {
    const dispatch = useDispatch();
    const [playBackRate, setPlayBackRate] = useState(1);
    const nowPlaying = useSelector((state) => state.profiles.nowPlaying);
    const audioElement = useRef();
    const playBackRateOptions = [1, 1.2, 1.6, 2];
  console.log("callplayer id",callId)
    useEffect(() => {
        if (nowPlaying && nowPlaying != callId) {
            audioElement.current.pause(); //stop previous audio if new one is played
        }
    }, [nowPlaying]);
 
    useEffect(() => {
        audioElement.current.playbackRate = playBackRate;
    }, [playBackRate]);

    return (
        <>
            <div className="d-flex flex-column pt-1 pb-1">
                <div className="overflow-hidden">
                    <audio style={{ "height": "30px" }} controls controlsList={"nodownload noremoteplayback noplaybackrate"} ref={audioElement} onPlay={() => dispatch(setNowPlaying(true))}>
                        <source
                            src={`${process.env.REACT_APP_API_ENDPOINT}/api/callflow/audio-streams/${callId}`}
                            type="audio/ogg"
                        />
                        <source
                            src={`${process.env.REACT_APP_API_ENDPOINT}/api/callflow/audio-streams/${callId}`}
                            type="audio/mpeg"
                        />
                    </audio>
                </div>
                <div className="d-flex justify-content-left">
                    <UncontrolledButtonDropdown>
                        <DropdownToggle style={{
                            color: "#22292f",
                            backgroundColor: "#f6f6f6",
                            borderColor: "#f6f6f6",
                            borderRadius: "15px"
                        }} outline color='light' size='sm'>
                            <span className="me-1">Play speed {playBackRate}x</span> <ChevronDown size={15}/>
                        </DropdownToggle>
                        <DropdownMenu container={container}>
                            {
                                playBackRateOptions.map(option => {
                                    return (<DropdownItem key={`playback-option-${option}`} onClick={() => setPlayBackRate(option)}>{`${option}x`}</DropdownItem>)
                                })
                            }
                        </DropdownMenu>
                    </UncontrolledButtonDropdown>
                </div>
            </div>
        </>
    );
};
