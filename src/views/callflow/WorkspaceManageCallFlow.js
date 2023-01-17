import React from "react";
import { useSelector } from "react-redux";
import Index from "./Index";

function WorkspaceManageLeadlist() {
  const workspaceState = useSelector(
    (state) => state.workspaces?.currentWorkspace?.id
  );

  return (
    <div className="app-user-list">
      <Index workspaceId={workspaceState} />
    </div>
  );
}
export default WorkspaceManageLeadlist;
