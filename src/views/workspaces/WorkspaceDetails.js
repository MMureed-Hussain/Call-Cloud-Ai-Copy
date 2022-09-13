import { Card, CardHeader, CardBody, CardTitle, CardText } from "reactstrap";
import { useParams } from "react-router-dom";
import UsersTable from "./UsersTable";
import WorkspaceMemberView from "./WorkspaceMemberView";
import WorkspaceCompanyView from "./WorkspaceCompanyView";

import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { storeCurrentWorkspaceById } from "@store/workspaces";

const WorkspaceDetails = () => {
  const params = useParams();
  const authState = useSelector((state) => state.auth);
  const workspaceState = useSelector((state) => state.workspaces);

  const dispatch = useDispatch();
  useEffect(() => {
    if (
      (authState.user &&
        workspaceState.currentWorkspace &&
        workspaceState.currentWorkspace.id !== params.id) ||
      (authState.user && !workspaceState.currentWorkspace)
    ) {
      dispatch(storeCurrentWorkspaceById({ id: params.id }));
    }
  }, []);

  return (
    <div>
      {authState.user.role === "company" ? (
        <WorkspaceCompanyView workspaceId={params.id} />
      ) : (
        <WorkspaceMemberView workspaceId={params.id} />
      )}
    </div>
  );
};

export default WorkspaceDetails;
