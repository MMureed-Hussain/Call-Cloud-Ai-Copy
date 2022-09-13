import { useSelector } from "react-redux";

const WorkspaceMemberView = ({ workspaceId }) => {
  const store = useSelector((state) => state.workspaces);
  console.log("workspace id", workspaceId);
  return (
    <p>
      Member view: {store.currentWorkspace ? store.currentWorkspace.name : ""}
    </p>
  );
};

export default WorkspaceMemberView;
