/* eslint-disable */
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ReactPaginate from "react-paginate";
import DataTable from "react-data-table-component";
import { Button } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";

// ** Reactstrap Imports
import { Card, CardHeader, CardTitle } from "reactstrap";

const CallFlowTable = ({ callFlowRecord, nextCallRecord }) => {
  const [callFlowData, setCallFlowData] = useState();
  const [tableColumns, setTableColumns] = useState([]);
  const [tableRows, setTableRows] = useState([]);
  const [nextLead, setNextLead] = useState(false);
  const columns = [];
  const rows = [];
  const dispatch = useDispatch();
  const workspaceId = useSelector(
    (state) => state.workspaces?.currentWorkspace?.id
  );

  const { id } = useParams();

  useEffect(() => {
    if (callFlowRecord && callFlowRecord.leadlist) {
      let local = [];
      Object.values(callFlowRecord?.leadlist[0].leadlist_header).map((data) => {
        if (data.header_name.includes("website")) {
          columns.push({
            name: data.header_name,
            sortable: true,
            minWidth: "172px",
            selector: (row) => {
              return row[data.header_name];
            },
            cell: (row) => {
              return (
                <a href={`https://${row[data.header_name]}`} target="_blank">
                  <span className="text-dark">{row[data.header_name]}</span>
                </a>
              );
            },
          });
        }

        if (data.header_name.includes("name")) {
          columns.push({
            name: data.header_name,
            sortable: true,
            minWidth: "172px",
            selector: (row) => {
              return row[data.header_name];
            },
            cell: (row) => {
              return (
                <Link to={`/leads/${callFlowRecord?.leadprofile.id}`}>
                  <span className="text-dark">{row[data.header_name]}</span>
                </Link>
              );
            },
          });
        }

        columns.push({
          name: data.header_name,
          sortable: true,
          minWidth: "172px",
          selector: (row) => {
            return row[data.header_name];
          },
          cell: (row) => {
            return row[data.header_name];
          },
        });
      });
      setTableColumns(columns);
      if (callFlowRecord) {
        const rowsData = callFlowRecord?.leadlist[0].leadlist_rows[0]?.row_data;
        local.push(rowsData ? rowsData : "");
        setTableRows(local);
      }
    }
  }, [callFlowRecord]);

  const handleButton = () => {
    setNextLead(!nextLead);
    nextCallRecord();
  };

  return (
    <>
      <Card>
        <CardHeader className="py-1">
          <CardTitle tag="h4">Lead Profile</CardTitle>
          <Button onClick={() => handleButton()}>Next Lead</Button>
        </CardHeader>

        <div className="react-dataTable">
          <section>
            <DataTable columns={tableColumns} data={tableRows}></DataTable>
          </section>
        </div>
      </Card>
    </>
  );
};

export default CallFlowTable;
