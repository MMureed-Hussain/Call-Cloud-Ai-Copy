
/* eslint-disable */
import { useEffect, useState } from 'react';
import axios from 'axios';
import { getSingleNotification, readNotification } from "@store/notifications";
import { useDispatch, useSelector } from "react-redux";
import { UncontrolledAlert } from "reactstrap"

function WebNotification()
{
    const dispatch = useDispatch();
    const [notification, setNotification] = useState(null);
    const user = useSelector(state => state.auth.user);
    const [notifications, setNotifications] = useState([]);
    const [count, setCount] = useState(0);
    const currentWorkspace = useSelector((state) => state.workspaces.currentWorkspace);

    /*  useEffect(() =>
     {
         axios.get(route('notifications')).then(res =>
         {
             if (res.statusText == 'OK') {
                 setCount(res.data.length);
                 setNotifications(res.data);
             }
         });
         
         console.log(user, 'suseer')
     }, []);
  */

    useEffect(() =>
    {
        if (user) {
            dispatch(getSingleNotification(user.id)).then(resp => setNotification(resp.payload.data));
        }
        // if (store.user) {
        //   const getNotification = async () => {
        //     await  axios.get(`${process.env.REACT_APP_API_ENDPOINT}/api/user_notification/${store.user.id}`).then(response => setNotification(response.data))
        //   }
        //   getNotification();
        // }
    }, [user]);


    // if (currentWorkspace) {
    //     Echo.private(`workspaces.${currentWorkspace.id}`)
    //         .listen('WorkspaceCallRecordingStatus', (res) =>
    //         {
    //             console.log(res, 'Workspace');
    //         });
    // }



    const notificationMarkRead = (id) =>
    {
        // console.log('coming', id); return;
        setNotification("");
        dispatch(readNotification({ id }));
    }


    // const handleMarkAsRead = (e) =>
    // {
    //     e.preventDefault();
    //     axios.get(route('notification.markasread')).then(res =>
    //     {
    //         if (res.statusText == 'OK') {
    //             setCount(0);
    //             setNotifications(null);
    //         }
    //     });
    // }

    return (
        <div div className="top-alert overflow-hidden cursor-pointer">
            <div className='demo-spacing-0'>
                {(notification && notification.id) &&
                    <UncontrolledAlert color='primary' toggle={() => notificationMarkRead(notification.id)}>
                        <div className='alert-body text-center' onClick={() => notificationMarkRead(notification.id)}>
                            <span>{notification.message}</span>
                        </div>
                    </UncontrolledAlert >
                }
            </div>
        </div>
    );
}

export default WebNotification;