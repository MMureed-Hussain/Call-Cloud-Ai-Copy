/* eslint-disable */
/**
 * We'll load the axios HTTP library which allows us to easily issue requests
 * to our Laravel back-end. This library automatically handles sending the
 * CSRF token as a header based on the value of the "XSRF" token cookie.
 */

import axios from 'axios';
axios.defaults.withCredentials = true;

/**
 * Echo exposes an expressive API for subscribing to channels and listening
 * for events that are broadcast by Laravel. Echo and event broadcasting
 * allows your team to easily build robust real-time web applications.
 */

import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import Cookies from "universal-cookie";
const cookies = new Cookies();

if (process.env.REACT_APP_ENV == 'local' || process.env.REACT_APP_ENV == 'development' || process.env.REACT_APP_ENV == 'testing') {
    Pusher.logToConsole = true;
}


window.Pusher = new Pusher(process.env.REACT_APP_PUSHER_KEY, {
    cluster: process.env.REACT_APP_PUSHER_CLUSTER,
    forceTLS: (process.env.REACT_APP_PUSHER_SCHEME ?? 'https') === 'https',
    // authEndpoint: `${process.env.REACT_APP_API_ENDPOINT}/api/broadcasting/auth`,
    // auth: {
    //     headers: {
    //         "X-CSRF-TOKEN": cookies.get("XSRF-TOKEN"),
    //     }
    // },
    authorizer: (channel, options) =>
    {
        return {
            authorize: (socketId, callback) =>
            {
                axios.post(`${process.env.REACT_APP_API_ENDPOINT}/api/broadcasting/auth`, {
                    socket_id: socketId,
                    channel_name: channel.name,
                    headers: {
                        "X-CSRF-TOKEN": cookies.get("XSRF-TOKEN"),
                    }
                })
                    .then(response =>
                    {
                        callback(false, response.data);
                    })
                    .catch(error =>
                    {
                        callback(true, error);
                    });
            }
        };
    },
});


// window.Echo = new Echo({
//     broadcaster: "pusher",
//     key: process.env.REACT_APP_PUSHER_KEY,
//     cluster: process.env.REACT_APP_PUSHER_CLUSTER,
//     forceTLS: (process.env.REACT_APP_PUSHER_SCHEME ?? 'https') === 'https',
//     encrypted: true,
//     // wsHost: process.env.REACT_APP_PUSHER_HOST ? process.env.REACT_APP_PUSHER_HOST : `ws-${process.env.REACT_APP_PUSHER_CLUSTER}.pusher.com`,
//     // enabledTransports: ['ws', 'wss'],
//     // wssPort: process.env.REACT_APP_PUSHER_PORT ?? 443,
//     // wsPort: process.env.REACT_APP_PUSHER_PORT ?? 80,
//     authorizer: (channel, options) =>
//     {
//         return {
//             authorize: (socketId, callback) =>
//             {
//                 axios.post(`${process.env.REACT_APP_API_ENDPOINT}/api/broadcasting/auth`, {
//                     socket_id: socketId,
//                     channel_name: channel.name,
//                     headers: {
//                         "X-CSRF-TOKEN": cookies.get("XSRF-TOKEN"),
//                     }
//                 })
//                     .then(response =>
//                     {
//                         callback(false, response.data);
//                     })
//                     .catch(error =>
//                     {
//                         callback(true, error);
//                     });
//             }
//         };
//     },
// });