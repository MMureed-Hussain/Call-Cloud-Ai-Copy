import { useParams, Navigate } from "react-router-dom";
import { useEffect } from "react";
import UsersTable from "./UsersTable";
import WorkspaceMemberView from "./WorkspaceMemberView";

import { useSelector, } from "react-redux";
// import { storeCurrentWorkspaceById } from "@store/workspaces";

const WorkspaceDetails = () => {
  const params = useParams();
// console.log("praMS", params)
  //   const navigate = useNavigate();
  // const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const authStates = useSelector((state) => state);

  const workspaceState = useSelector((state) => state.workspaces);
  const xy = document.cookie
  console.log("authState", authStates)
  console.log("x", xy)

  useEffect(() => {

    if (
      (authState.user &&
        workspaceState.currentWorkspace &&
        workspaceState.currentWorkspace.id !== params.id) ||
      (authState.user && !workspaceState.currentWorkspace)
    ) {
      // dispatch(storeCurrentWorkspaceById({ id: params.id }));
    }
  }, []);

  if (authState.user.role !== "company") {
    return <Navigate to={`/workspace/${params.id}`} />;
  }
  if (params.id === "id") {
    return (
      <Navigate
        to={`/workspaces?error_message=Please create workspace first!`}
      />
    );
  }

  return (
    <div>
      <div className="app-user-list">
        <UsersTable workspaceId={params.id} />
      </div>
    </div>
  );
};

export default WorkspaceDetails;
