// ** Reducers Imports
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

const rootReducer = { navbar, layout, auth, workspaces, plans, feedbacks, companies, bookingPages, notifications };

export default rootReducer;
