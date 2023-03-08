import React from 'react'
import { useSelector } from 'react-redux';
import LeadlistTable from './LeadlistTable'

function WorkspaceManageLeadlist() {
  
  const workspaceState = useSelector((state) => state.workspaces?.currentWorkspace?.id);

  return (
    <div className="app-leadlist-list">
        <LeadlistTable  workspaceId={workspaceState}/>
    </div>
    
    
  )
}
export default WorkspaceManageLeadlist