/* eslint-disable */
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import DataTable from "react-data-table-component";
import { ChevronDown } from "react-feather";
import Skeleton from "react-loading-skeleton";
import CallFlowPlayer from './CallFlowPlayer'
// ** Reactstrap Imports
import {
  Card,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  CardHeader,
  CardTitle,
} from "reactstrap";
import RecordListHeader from "./RecordListHeader";
import { useDispatch, useSelector } from "react-redux";
import { Edit, Eye, Trash, MoreVertical } from "react-feather";
import moment from "moment";
import Select from "react-select";
import { selectThemeColors } from "@utils";
import CallflowSidebar from "./CallflowSidebar";
import { getCallFlowRecord } from "../../../redux/callflow";
const RecordList = ({rowId}) => {
  // ** States
  const [sort, setSort] = useState("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState("id");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pageCount, setPageCount] = useState(1);
  const [calls,setCalls]=useState([]);
  let local=[]
  const [onCallSubmit,setOnCallSubmit]=useState(false)

  const dispatch = useDispatch();
 
  const reloadCallTable = useSelector(
    (state) => state.profiles.reloadCallTable
  );
  const statusFilterValue = useSelector(
    (state) => state.profiles.statusFilterValue
  );
  const currentWorkspace = useSelector(
    (state) => state.workspaces.currentWorkspace
  );
 //const rowId=useSelector((state)=>state.workspaces)
  useEffect(()=>{
    if(rowId){

      dispatch(getCallFlowRecord({rowId:rowId})).then((data)=>
      {
 // console.log("call records",data?.payload?.data.callFlowRecord.callflow_recording[0])
  if(data.payload)
  {
    data?.payload.data.callFlowRecord.callflow_recording.map((data)=>{
      local.push(data)
     
      

    })
    setCalls(local)
    
    

  }
 
  }
      
      )
    }
    


  },[rowId])


  useEffect(()=>{
    if(rowId){

      dispatch(getCallFlowRecord({rowId:rowId})).then((data)=>
      {
 // console.log("call records",data?.payload?.data.callFlowRecord.callflow_recording[0])
  const rowsData=data?.payload.data.callFlowRecord.callflow_recording
  if(data.payload)
  {
    data?.payload.data.callFlowRecord.callflow_recording.map((data)=>{
      local.push(data)
     
      

    })
    setCalls(local)
    
    

  }
 
  }
      
      )
    }
    


  },[onCallSubmit])

  const loadCalls = (options) => {
    let queryParams = {
      records_per_page: rowsPerPage,
      page: currentPage,
      sort_by: sortColumn,
      sort,
      ...options,
    };
    setCurrentPage(options.page);
  };

  const columns = [
    {
      name: "Id",
      sortable: true,
      minWidth: "50px",
      sortField: "id",
      selector: (row) => row.id,
      cell: (row) => (
          <div className="d-flex justify-content-left align-items-center">
              <div className="d-flex flex-column">
                  <span className="fw-bolder">{row.id}</span>
              </div>
          </div>
      ),
    },
    {
      name: "Voice",
      sortable: false,
      minWidth: "350px",
      cell: (row) =>
      {
          return <CallFlowPlayer callId={row.id} />;
      },
    },
    
    {
      name: "Created By",
      sortable: true,
      sortField: "created_by",
      minWidth: "250px",
      selector: (row) => row.created_by,
      // cell: (row) => (
      //     row
          
      //     // <UserInfo
      //     //     name={`${row.created_by.first_name} ${row.created_by.last_name}`}
      //     //     email={row.created_by.email}
      //     // />
      // ),
    },
    {
      name: "Created At",
      sortable: true,
      sortField: "created_at",
      minWidth: "172px",
      selector: (row) => row.created_at,
      cell: (row) => moment(row.created_at).format("YYYY-MM-DD HH:mm:ss"),
    },
   
  ];

  const handleSort = (column, sortDirection) => {
    setSort(sortDirection);
    setSortColumn(column.sortField);
    loadCalls({
      page: 1,
      sort_by: column.sortField,
      sort: sortDirection,
    });
  };

  // ** Function in get data on rows per page
  const handlePerPage = (e) => {
    const value = parseInt(e.currentTarget.value);
    setRowsPerPage(value);
    loadCalls({
      page: 1,
      records_per_page: value,
    });
  };

  // ** Function in get data on search query change
  const handleFilter = (val) => {
    setSearchTerm(val);
    //todo add
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // ** Custom Pagination
  const CustomPagination = () => {
    return (
      <ReactPaginate
        previousLabel={""}
        nextLabel={""}
        pageCount={pageCount}
        activeClassName="active"
        forcePage={currentPage !== 0 ? currentPage - 1 : 0}
        onPageChange={({ selected }) => loadCalls({ page: selected })}
        pageClassName={"page-item"}
        nextLinkClassName={"page-link"}
        nextClassName={"page-item next"}
        previousClassName={"page-item prev"}
        previousLinkClassName={"page-link"}
        pageLinkClassName={"page-link"}
        containerClassName={
          "pagination react-paginate justify-content-end my-2 pe-1"
        }
      />
    );
  };

  const callRecordList=()=>{
setOnCallSubmit(!onCallSubmit)


  }
  return (
    <>
      <Card>
        <CardHeader className="py-1">
          <CardTitle tag="h4">Calls</CardTitle>
        </CardHeader>
        <RecordListHeader
          searchTerm={searchTerm}
          rowsPerPage={rowsPerPage}
          handleSearch={handleFilter}
          handlePerPage={handlePerPage}
          toggleSidebar={toggleSidebar}
        />
        <div className="react-dataTable">
          <DataTable
            columns={columns}
            
            className="react-dataTable"
           
           data={calls}
          ></DataTable>
        </div>
      </Card>
      {sidebarOpen && (
        <CallflowSidebar
          open={sidebarOpen}
          toggleSidebar={toggleSidebar}

          callRecordList={callRecordList}
          rowId={rowId}
          //profile={selectedProfile}
        />
      )}
    </>
  );
};

export default RecordList;
