/* eslint-disable */

import { useEffect, useState } from "react";
import { Clock, Meh, X } from "react-feather";
import { Row, Col, FormGroup, Input } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentSession, storeOrUpdate } from "../../../redux/timers";
import { millisecondsToTime } from "../../../utility/Utils";

const Timetracker = () =>
{

    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [timer, setTimer] = useState(0);
    const [timestamp, setTimestamp] = useState(0); //duration of recording in milliseconds

    const [startTime, setStartTime] = useState(null); //duration of recording in milliseconds
    const [sessionTime, setSessionTime] = useState({ h: '00', m: '00', s: '00' });
    const currentSession = useSelector((state) => state.timers.current_session);

    useEffect(() =>
    {
        if (currentSession) {
            let time = millisecondsToTime(timestamp);
            let session = {
                h: padStart(time.h),
                m: padStart(time.m),
                s: padStart(time.s)
            };
            setSessionTime(session);
        }

    }, [timestamp])


    useEffect(() =>
    {
        if (currentSession) {

            setStartTime(new Date());
            setTimer(setInterval(() =>
            {
                setTimestamp(timestamp => timestamp + 1000)
            }, 1000))

        } else {
            setStartTime(null);
            setTimestamp(0);
        }

        dispatch(storeOrUpdate({ currentSession }));

        clearInterval(timer);
    }, [currentSession]);


    const padStart = (n) =>
    {
        return n.toString().padStart(2, '0');

    }

    const handleToggle = (e) =>
    {
        e.preventDefault()
        setOpen(!open);
    }

    const handleChange = (e) =>
    {
        dispatch(setCurrentSession(!currentSession));
    }


    return (
        <div className={`customizer d-none d-md-block ${open && 'open'}`}>
            <a
                href="/"
                onClick={handleToggle} style={{ transform: 'translateY(-40px)' }}
                className={`customizer-toggle d-flex align-items-center justify-content-center ${currentSession ? 'bg-success' : 'bg-danger'}`}>
                <Clock size={20} />
            </a>
            <div className="scrollbar-container">
                <div className="customizer-header px-2 pt-1 pb-0 position-relative">
                    <h4 className="mb-0">Session information</h4>
                    {/* <p className="m-0">Thanks for taking the time to provide us with your feedback.</p> */}
                    <a href="/" className="customizer-close" onClick={handleToggle}>
                        <X />
                    </a>
                </div>

                <hr />

                <div className="p-2">
                    <Row>
                        <Col>
                            <h2> {`${sessionTime.h} : ${sessionTime.m} : ${sessionTime.s}`}</h2>
                            <p>Current Session</p>
                        </Col>
                        <Col className="text-end">
                            <FormGroup switch className="text-end d-inline-block">
                                <Input type="switch" className="cursor-pointer" checked={currentSession} onChange={(e) => handleChange(e)} role="switch" />
                            </FormGroup>
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
    );
}

export default Timetracker;