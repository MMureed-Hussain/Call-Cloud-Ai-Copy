/* eslint-disable */
import { Card, CardBody, CardText } from "reactstrap";

const CallFlowAbout = ({ callFlowData }) => {
  return (
    <>
      <Card>
        <CardBody>
          <CardText>Lead From</CardText>
          <div className="mt-2">
            <h5 className="mb-75">Queue Name:</h5>{" "}
            {callFlowData?.queue_name || ""}
          </div>
          <div className="mt-2">
            <h5 className="mb-75">Lead List:</h5>
            {callFlowData?.leadlist?.[0]?.leadlist_name || ""}
          </div>
          <div className="mt-2">
            <h5 className="mb-75">Current Row:</h5>
            {callFlowData?.row_index || ""}
          </div>
          <div className="mt-2">
            <h5 className="mb-75">Total Rows:</h5>
            {callFlowData?.leadlist?.[0]?.total_rows || ""}
          </div>
        </CardBody>
      </Card>
    </>
  );
};

export default CallFlowAbout;
