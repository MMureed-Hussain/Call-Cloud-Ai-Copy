import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Index from "./Index";
import { getCallFlowData } from "../../redux/workspaces"


function WorkspaceManageLeadlist() {
  const workspaceState = useSelector(
    (state) => state.workspaces?.currentWorkspace?.id
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (workspaceState) {
      dispatch(
        getCallFlowData(workspaceState)
      );
    };
  }, [workspaceState]);

  return (
    <div className="app-user-list">
      <Index workspaceId={workspaceState} />
    </div>
  );
}
export default WorkspaceManageLeadlist;
