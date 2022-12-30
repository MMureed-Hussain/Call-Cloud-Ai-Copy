// ** Reducers Imports
/* eslint-disable */
import layout from "./layout";
import navbar from "./navbar";
import auth from "./auth";
import workspaces from "./workspaces";
import plans from "./plans";

import companies from "./companies";
import bookingPages from "./bookingPages";
import feedbacks from "./feedbacks";
import notifications from "./notifications";
import profiles from "./profiles";
import pipelines from "./pipelines";
import statuses from "./statuses";
import followups from "./followups";
import callStatuses from "./callStatuses";
import leadStatuses from "./leadStatuses";
import clientStatuses from "./clientStatuses";
import note from "./note";

const rootReducer = {
    navbar,
    layout,
    auth,
    workspaces,
    plans,
    feedbacks,
    companies,
    bookingPages,
    notifications,
    profiles,
    pipelines,
    statuses,
    followups,
    callStatuses,
    leadStatuses,
    clientStatuses,
    note,
};


export default rootReducer;
