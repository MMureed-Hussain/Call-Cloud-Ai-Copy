// ** Reducers Imports
import layout from "./layout";
import navbar from "./navbar";
import auth from "./auth";
import workspaces from "./workspaces";
import plans from "./plans";
import feedbacks from "./feedbacks";
import notifications from "./notifications";

const rootReducer = { navbar, layout, auth, workspaces, plans, feedbacks, notifications };

export default rootReducer;
