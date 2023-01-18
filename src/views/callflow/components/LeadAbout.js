/* eslint-disable */
import { Button, Card, CardBody, Input, CardText, Badge } from "reactstrap";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import Select from "react-select";
import { selectThemeColors } from "@utils";
import { Edit } from "react-feather";
import {
  getCallFlowData
  // getRecord,
  // storeCurrentPageLeadlist,
  // storeRowsPerPageLeadlist,
  // deleteLeadlistWorkspace,
} from "@store/workspaces";

const CallFlowAbout = ({ callFlowData }) => {

 
  

 

  return (
    <>
      <Card>
        <CardBody>
          <CardText>Lead From</CardText>
          <div className="mt-2">
            <h5 className="mb-75">Queue Name:</h5> {callFlowData?.queue_name}
          </div>
          <div className="mt-2">
            <h5 className="mb-75">Lead List:</h5>{callFlowData?.leadlist[0].leadlist_name}
          </div>
          <div className="mt-2">
              <h5 className="mb-75">Total Rows:</h5>{callFlowData?.leadlist[0].total_rows}
            </div>
        </CardBody>
      </Card>
    </>
  );
};

export default CallFlowAbout;
