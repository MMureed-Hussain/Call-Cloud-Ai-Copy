// ** Reducers Imports
/* eslint-disable */
import layout from "./layout";
import navbar from "./navbar";
import auth from "./auth";
import workspaces from "./workspaces";
import plans from "./plans";
import feedbacks from "./feedbacks";
import companies from "./companies";
import bookingPages from "./bookingPages";
import notifications from "./notifications";
import profiles from "./profiles";
import followups from "./followups";
import statuses from "./statuses";
import activityLogs from "./activityLogs";
import calls from "./calls";
import campaigns from "./campaigns";
import timers from './timers';

const rootReducer = {
    layout,
    navbar,
    auth,
    workspaces,
    plans,
    feedbacks,
    companies,
    bookingPages,
    notifications,
    profiles,
    followups,
    statuses,
    activityLogs,
    calls,
    campaigns,
    timers,
};


export default rootReducer;
