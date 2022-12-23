/*  eslint-disable */
import { forwardRef, useImperativeHandle, useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { faMicrosoft, faCalendarCheck } from "@fortawesome/free-solid-svg-icons";
import moment from 'moment/moment';

import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

const ViewCalendarModal = forwardRef((props, ref) =>
{

    const user = useSelector((state) => state.auth.user);

    console.log(user);
    const [open, setOpen] = useState(false);
    const [followUp, setFollowUp] = useState(null);
    const toggle = () => setOpen(!open);

    useImperativeHandle(ref, () => ({
        open: (row) =>
        {
            setFollowUp(row);
            setOpen(true);
        }
    }))

    const handleGoogleCalendar = () =>
    {
        const start_date = moment(followUp.meeting_at).format(`YYYYMMDDTHH:mm:ssZ`);
        const end_date = moment(followUp.meeting_at).add(30, 'minutes').format(`YYYYMMDDTHH:mm:ssZ`);
        window.open(`https://calendar.google.com/calendar/u/0/r/eventedit?dates=${start_date}/${end_date}&text=${user.name}`, '_blank');
    }

    const handleMicrosoftCalendar = () =>
    {
        const start_date = moment(followUp.meeting_at).format(`YYYY-MM-DDTHH:mm:ss`);
        const end_date = moment(followUp.meeting_at).add(30, 'minutes').format(`YYYY-MM-DDTHH:mm:ss`);
        window.open(`https://outlook.live.com/owa/?path=/calendar/action/compose&rru=addevent&startdt=${start_date}&enddt=${end_date}&subject=${user.name}&body=${followUp.notes}`, '_blank');

    }

    return (
        <>
            {followUp &&
                <Modal isOpen={open} toggle={toggle} centered>
                    <ModalHeader toggle={toggle} >Connect your calendar</ModalHeader>
                    <ModalBody>
                        <p>Never miss a meeting. Connect your calendar to get notifications, sync up time zones, and schedule time automatically.</p>
                        <div className='d-flex justify-content-between m-3'>
                            <Button color="white border text-primary" onClick={handleGoogleCalendar}>
                                Sign in with Google
                            </Button>
                            <Button color="white border text-primary" onClick={handleMicrosoftCalendar}>
                                Sign in with Microsoft
                            </Button>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={toggle}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            }
        </>
    );
});

export default ViewCalendarModal;