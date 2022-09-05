import { Card, CardHeader, CardBody, CardTitle, CardText } from "reactstrap";
import { useParams } from "react-router-dom";
// import Table from "./Table";

const WorkspaceDetails = () => {
  const params = useParams();

  return (
    <div className="app-user-list">
      {/* <Table /> */}
      {params.id}
    </div>
  );
};

export default WorkspaceDetails;
