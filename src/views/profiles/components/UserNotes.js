import React from "react";
import { Card, CardBody } from "reactstrap";
import Timeline from "@components/timeline";

const UserNotes = (props) => {
  const timelineData = [];
  console.log("props1", props);

  timelineData.push({
    title: props.data.name,
    content: props.data.note,
    meta: "12 min ago",
  });

  return (
    <>
      <Card>
        <CardBody>
          <Timeline data={timelineData} />
        </CardBody>
      </Card>
    </>
  );
};

export default UserNotes;
