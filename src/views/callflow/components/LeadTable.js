  /* eslint-disable */
  import { useEffect, useRef, useState } from "react";
  import { useParams } from "react-router-dom";
  import ReactPaginate from "react-paginate";
  import DataTable from "react-data-table-component";
  import { ChevronDown } from "react-feather";
  import Skeleton from "react-loading-skeleton";
  import { Row, Col, Button } from "reactstrap";
import { useDispatch,useSelector } from "react-redux";
import { getCallFlowData } from "../../../redux/workspaces";
import RecordList from '../components/RecordList'

  // ** Reactstrap Imports
  import {
    Card,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    CardHeader,
    CardTitle,
    Badge,
  } from "reactstrap";
  import { Edit, Eye, Trash, MoreVertical } from "react-feather";
  import moment from "moment";

  //Redux
  import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
  import { faCalendar, faCalendarCheck } from "@fortawesome/free-solid-svg-icons";
import { LocalConvenienceStoreOutlined } from "@material-ui/icons";

  const CallFlowTable= ({callFlowRecord,nextCallRecord}) => {
    const [callFlowData,setCallFlowData]=useState();
    const[tableColumns,setTableColumns]=useState([])
    const[tableRows,setTableRows]=useState([])
    const[nextLead,setNextLead]=useState(false)
    const columns=[];
    const rows=[];
    const dispatch=useDispatch();
    const workspaceId = useSelector(
      (state) => state.workspaces?.currentWorkspace?.id
    );
  


  useEffect(()=>{
    if(callFlowRecord){
    
      let local=[]
      Object.values(callFlowRecord?.leadlist[0].leadlist_header).map((data)=>
      { 
    columns.push(
      {
        name: data.header_name,
        sortable: true,
        minWidth: '172px',
        selector: (row) =>  {
          return row[data.header_name]
        },
        cell: (row) =>  {
          return row[data.header_name]
        }
      }
      
      )
      }
    )
    setTableColumns(columns)
if(callFlowRecord){
  const rowsData=callFlowRecord?.leadlist[0].leadlist_rows[0]?.row_data;
 local.push(rowsData?rowsData:'')
 setTableRows(local)

}




    }


  },[callFlowRecord])

const handleButton=()=>{
  //setNextLead(!nextLead)
  nextCallRecord();

  
}
    return (
      <>
        <Card>
          <CardHeader className="py-1">
            <CardTitle tag="h4">Lead Profile</CardTitle>
            <Button
            onClick={() => handleButton()
            
            }
            >
              Next Lead
            </Button>
          </CardHeader>

          <div className="react-dataTable">
            <section>
              
              <DataTable
              
              columns={tableColumns}
              data={tableRows}
              
          
            ></DataTable>

              
         

        
          </section>
          
          </div>
          
        </Card>
      </>
    );
  };

  export default CallFlowTable;
