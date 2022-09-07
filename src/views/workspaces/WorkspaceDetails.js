import { Card, CardHeader, CardBody, CardTitle, CardText } from "reactstrap";
import { useParams } from "react-router-dom";
import UsersTable from "./UsersTable";

const WorkspaceDetails = () => {
  const params = useParams();

  return (
    <div>
      <div className="app-user-list">
        <UsersTable workspaceId={params.id} />
      </div>
    </div>
  );
};

export default WorkspaceDetails;
