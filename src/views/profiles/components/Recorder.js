/* eslint-disable */
import React, { useState, useEffect } from "react"
import { useParams } from "react-router-dom";
import { Button, Row } from "reactstrap";
import { millisecondsToTime } from "../../../utility/Utils";
import { Mic, Pause, StopCircle, Play } from 'react-feather';
import { padStart } from "lodash"
import { sendCallRecordingStatus } from "@store/notifications";
import { useDispatch, useSelector } from "react-redux";

export default ({ audioDetails, setAudioDetails }) =>
{

    const parms = useParams();
    const dispatch = useDispatch();
    const [recording, setRecording] = useState(false); //if recording is in progress
    const [recordPaused, setRecordPaused] = useState(false); //if recording is in pause state
    const [timer, setTimer] = useState(0);
    const [timestamp, setTimestamp] = useState(0); //duration of recording in milliseconds
    const [recorder, setRecorder] = useState(null); //media recorder instance
    const currentWorkspace = useSelector((state) => state.workspaces.currentWorkspace);
    const currentSession = useSelector((state) => state.timers.timer);

    useEffect(() =>
    {
        setAudioDetails(details =>
        {
            const duration = millisecondsToTime(timestamp);
            details.duration = duration;
            return details;
        })
    }, [timestamp])

    const accessMediaRecorder = () =>
    {
        navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) =>
        {
            const mediaRecorder = new MediaRecorder(stream);
            setRecorder(mediaRecorder);
            mediaRecorder.addEventListener("dataavailable", (event) =>
            {
                setAudioDetails(details =>
                {
                    details.chunks.push(event.data);
                    return details;
                })
            });
        });
    };

    useEffect(() =>
    {
        accessMediaRecorder(); //access
    }, [])

    const startTimer = () =>
    {
        setTimer(setInterval(() =>
        {
            setTimestamp(timestamp => timestamp + 100)
        }, 100))
    }

    const resetRecorder = () =>
    {
        setTimestamp(0);
        setAudioDetails(() => ({
            url: null,
            blob: null,
            chunks: [],
            duration: {
                h: 0,
                m: 0,
                s: 0
            }
        }))
    }

    const onStart = async () =>
    {

        if (!currentSession) {
            alert('Please start the timer first!');
            return;
        }

        resetRecorder();
        startTimer();
        setRecording(true);
        setRecordPaused(false);
        recorder.start(10); // start recorder with 10ms buffer

        //Update Call recording status
        dispatch(sendCallRecordingStatus({ workspace_id: currentWorkspace.id, status: 'STARTED', call_profile_id: parms.id }));
    }

    const onResume = () =>
    {
        startTimer();
        recorder.resume();
        setRecordPaused(false);
        //Update Call recording status
        dispatch(sendCallRecordingStatus({ workspace_id: currentWorkspace.id, status: 'RESUMED', call_profile_id: parms.id }));
    }

    const onPause = () =>   
    {
        clearInterval(timer);
        recorder.pause();
        setRecordPaused(true);
        //Update Call recording status
        dispatch(sendCallRecordingStatus({ workspace_id: currentWorkspace.id, status: 'PAUSED', call_profile_id: parms.id }));
    }

    const onStop = () =>
    {
        clearInterval(timer);
        setRecording(false);
        setRecordPaused(false);
        recorder.stop();
        const audioBlob = new Blob(audioDetails.chunks, {
            type: 'audio/mp3'
        });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioDetails(details =>
        {
            const clonedDetails = { ...details, url: audioUrl, blob: audioBlob };
            return clonedDetails;
        })

        //Update Call recording status
        dispatch(sendCallRecordingStatus({ workspace_id: currentWorkspace.id, status: 'STOPPED', call_profile_id: parms.id }));
    }
    /*eslint multiline-ternary: ["error", "always"]*/
    return (
        <>
            <div className="d-flex justify-content-center">
                {recording ?
                    <div className='rounded-circle overflow-hidden me-1'>
                        <Button.Ripple className='btn-icon rounded-circle' color='danger' onClick={onStop}>
                            <StopCircle size={16} />
                        </Button.Ripple>
                    </div>
                    : <div className='rounded-circle overflow-hidden me-1'>
                        <Button.Ripple className='btn-icon rounded-circle sid' color='danger' onClick={onStart}>
                            <Mic size={16} />
                        </Button.Ripple>
                    </div>}
                {/* {recording ?
                    recordPaused ?
                        <div className='rounded-circle overflow-hidden'>
                            <Button.Ripple className='btn-icon rounded-circle' color='warning' onClick={onResume}>
                                <Play size={16} />
                            </Button.Ripple>
                        </div>
                        :
                        <div className='rounded-circle overflow-hidden'>
                            <Button.Ripple className='btn-icon rounded-circle' color='warning' onClick={onPause}>
                                <Pause size={16} />
                            </Button.Ripple>
                        </div>
                    : null} */}
            </div>
            <br />
            <Row className="text-center mb-2">
                {
                    audioDetails?.url ?
                        <audio style={{ height: "30px" }} controls>
                            <source src={audioDetails?.url} type='audio/ogg' />
                            <source src={audioDetails?.url} type='audio/mpeg' />
                        </audio>
                        : null
                }
                {recording ?
                    <h1 style={{ fontSize: "3rem" }}>{`${padStart(audioDetails.duration.h, 2, '0')}:${padStart(audioDetails.duration.m, 2, '0')}:${padStart(audioDetails.duration.s, 2, '0')}`}</h1>
                    : null}
            </Row>

        </>
    )
}