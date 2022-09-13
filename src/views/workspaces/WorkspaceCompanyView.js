import { useSelector } from "react-redux";

const WorkspaceCompanyView = ({ workspaceId }) => {
  const store = useSelector((state) => state.workspaces);
  console.log("workspace id", workspaceId);
  return (
    <p>
      Company view: {store.currentWorkspace ? store.currentWorkspace.name : ""}
    </p>
  );
};

export default WorkspaceCompanyView;
