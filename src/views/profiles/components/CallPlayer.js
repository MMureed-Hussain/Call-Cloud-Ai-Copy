/* eslint-disable */
import { useState } from "react";
import { Button } from "reactstrap";
import { Play, Pause } from "react-feather";

export default ({ callId }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [player, setPlayer] = useState(null);

    /**
     * Create the audio object on user click and play it
     */
    const handlePlay = () => {
        let audio = new Audio(`${process.env.REACT_APP_API_ENDPOINT}/audio-stream/${callId}`);
        setPlayer(audio);
        audio.addEventListener('ended', onEnded)
        audio.play().then(() => {
            setIsPlaying(true);
        });
    }

    const handlePause = () => {
        player.pause();
        onEnded();
    }
    /**
     * Remove the audio instance when user pause the audio. So a fresh audio instance can be created once user click on play
     */
    const onEnded = () => {
        setIsPlaying(false);
        player.removeEventListener('ended', onEnded);
        setPlayer(null);
    }

    return (
        <>
            {isPlaying ?
                <div className='rounded-circle overflow-hidden'>
                    <Button.Ripple className='btn-icon rounded-circle' color='warning' onClick={handlePause}>
                        <Pause size={14} />
                    </Button.Ripple>
                </div> :
                <div className='rounded-circle overflow-hidden'>
                    <Button.Ripple className='btn-icon rounded-circle' color='primary' onClick={handlePlay}>
                        <Play size={14} />
                    </Button.Ripple>
                </div>
            }

        </>

    )
}