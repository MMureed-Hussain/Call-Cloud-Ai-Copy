import React from "react";
import { useSelector } from "react-redux";
import TeamTable from "./TeamTabel";

function WorkspaceManageLeadlist() {
  const workspaceState = useSelector(
    (state) => state.workspaces?.currentWorkspace?.id
  );

  return (
    <div className="app-leadlist-list">
      <TeamTable workspaceId={workspaceState} />
    </div>
  );
}
export default WorkspaceManageLeadlist;
