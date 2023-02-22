import React from 'react'
import { useSelector } from 'react-redux';
import ActivityLogTable from './ActivityLogTable';

function Index() {
  
  const workspaceState = useSelector((state) => state.workspaces?.currentWorkspace?.id);

  return (
    
    <div className="app-user-list">
        <ActivityLogTable  workspaceId={workspaceState}/>
    </div>
    
    
  )
}
export default Index;