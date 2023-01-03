import React from "react";
import { useSelector } from "react-redux";
import QueueTable from "./QueueTable";

function WorkspaceManageLeadlist() {
  const workspaceState = useSelector(
    (state) => state.workspaces?.currentWorkspace?.id
  );

  return (
    <div className="app-leadlist-list">
      <QueueTable workspaceId={workspaceState} />
    </div>
  );
}
export default WorkspaceManageLeadlist;
