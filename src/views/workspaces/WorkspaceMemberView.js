import { useSelector } from "react-redux";

const WorkspaceMemberView = () => {
  const store = useSelector((state) => state.workspaces);
  return (
    <p>
      Member view: {store.currentWorkspace ? store.currentWorkspace.name : ""}
    </p>
  );
};

export default WorkspaceMemberView;
