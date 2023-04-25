/* eslint-disable */
import { useEffect, useState, useRef } from "react";
import { Clock, Meh, X } from "react-feather";
import { Row, Col, FormGroup, Input, Label, FormFeedback } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { storeOrUpdate, getCrrentTimer } from "../../../redux/timers";
import { getCompaignsByWorkspace } from "../../../redux/campaigns";
import { millisecondsToTime } from "../../../utility/Utils";
import Select from "react-select";

const Timetracker = () =>
{

    const [loadCounter, setLoadCounter] = useState(0);
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [counter, setCounter] = useState(0);
    const [timestamp, setTimestamp] = useState(0);
    const [sessionTime, setSessionTime] = useState({ h: '00', m: '00', s: '00' });
    const timer = useSelector((state) => state.timers.timer);
    const currentWorkspace = useSelector((state) => state.workspaces.currentWorkspace);
    const campaignsOptions = useSelector((state) => state.campaigns.campaignsOptions);
    const [data, setData] = useState({ campaign_id: 0 });

    useEffect(() =>
    {
        if (currentWorkspace) {
            dispatch(getCompaignsByWorkspace({ id: currentWorkspace.id }));
            dispatch(getCrrentTimer());
        }

    }, [currentWorkspace]);


    useEffect(() =>
    {
        setLoadCounter(loadCounter + 1);
        setData(data => ({
            ...data,
            ['campaign_id']: timer?.campaign_id ?? 0,
        }));

        if (timer) {

            if (loadCounter == 1) {
                let now = new Date();
                let currentTime = new Date(now.getTime() + now.getTimezoneOffset() * 60000).getTime();
                let started_at = new Date(timer.started_at).getTime();
                let time = (currentTime - started_at);
                setTimestamp(time);
            }

            setCounter(setInterval(() => { setTimestamp(timestamp => timestamp + 1000) }, 1000));
        } else {
            setTimestamp(0);
        }

        clearInterval(counter);

    }, [timer]);




    useEffect(() =>
    {

        let time = millisecondsToTime(timestamp);
        let session = {
            h: padStart(time.h),
            m: padStart(time.m),
            s: padStart(time.s)
        };
        setSessionTime(session);


    }, [timestamp])


    const padStart = (n) =>
    {
        return n.toString().padStart(2, '0');

    }

    const handleToggle = (e) =>
    {
        e.preventDefault()
        setOpen(!open);
    }

    const handleSelectChange = (e, name) =>
    {
        setData(data => ({
            ...data,
            [name]: e.value,
        }));

    }

    const handleSelected = (campaignsOptions, id) =>
    {
        let newOptions = [{ value: 0, label: 'None' }, ...campaignsOptions];
        let selected = id ? id : 0;
        return newOptions.filter(option => option.value === selected);
    }

    const handleChange = (e) =>
    {
        dispatch(storeOrUpdate(data));
    }


    return (
        <div className={`customizer d-none d-md-block ${open && 'open'}`}>
            <a
                href="/"
                onClick={handleToggle} style={{ transform: 'translateY(-40px)' }}
                className={`customizer-toggle d-flex align-items-center justify-content-center ${timer ? 'bg-success' : 'bg-danger'}`}>
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
                    <Row className="mb-2">
                        <Col>
                            <FormGroup>
                                <Label>Select a campaign </Label>
                                <Select
                                    classNamePrefix="select"
                                    className={`${!Boolean(data.campaign_id && 'is-invalid')}`}
                                    onChange={e => handleSelectChange(e, 'campaign_id')}
                                    options={[{ value: 0, label: 'None' }, ...campaignsOptions]}
                                    value={handleSelected(campaignsOptions, data.campaign_id)}
                                    isDisabled={Boolean(timer)}
                                />
                                {!Boolean(data.campaign_id) && <FormFeedback className="text-danger">Please select a campaign to start the session! </FormFeedback>}
                            </FormGroup>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <h2> {`${sessionTime.h} : ${sessionTime.m} : ${sessionTime.s}`}</h2>
                            <p>Current Session</p>
                        </Col>
                        <Col className="text-end">
                            <FormGroup switch className="text-end d-inline-block">
                                <Input
                                    type="switch"
                                    disabled={!Boolean(data.campaign_id)}
                                    name="current_session"
                                    className="cursor-pointer"
                                    onChange={(e) => handleChange(e)} role="switch"
                                    checked={Boolean(timer)}
                                />
                            </FormGroup>
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
    );
}

export default Timetracker;