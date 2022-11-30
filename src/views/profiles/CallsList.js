/* eslint-disable */
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import DataTable from "react-data-table-component";
import { ChevronDown } from "react-feather";
import Skeleton from "react-loading-skeleton";
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
import CallListHeader from "./components/CallListHeader";
import { useDispatch, useSelector } from "react-redux";
import { Edit, Eye, Trash, MoreVertical } from "react-feather";
import { Link, useParams } from "react-router-dom";
import CallSidebar from "./components/CallSidebar";
import moment from "moment";
import CallPlayer from "./components/CallPlayer";
import { getCallsByProfileId, setReloadCalls } from "../../redux/profiles";

export default () => {
  // ** States
  const [sort, setSort] = useState("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState("id");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [calls, setCalls] = useState([]);
  const [pageCount, setPageCount] = useState(1);

  const dispatch = useDispatch();
  const params = useParams();
  const reloadCalls = useSelector((state) => state.profiles.reloadCalls);

  useEffect(() => {
    loadCalls({
      page: 1,
    });
  }, []);

  useEffect(() => {
    if (reloadCalls) {
      setReloadCalls(false);
      loadCalls({
        page: 1,
      });
    }
  }, [reloadCalls]);

  function deleteCall(id)
  {
    alert(id);
  }

  

  const loadCalls = (options) => {
    dispatch(
      getCallsByProfileId({
        id: params.id,
        params: {
          records_per_page: rowsPerPage,
          page: currentPage,
          sort_by: sortColumn,
          sort,
          ...options,
        },
      })
    ).then(({ payload }) => {
      if (payload.data !== null) {
        setCalls(payload.data.data);
        setPageCount(payload.data.last_page);
      }
    });
    setCurrentPage(options.page);
  };

  const columns = [
    {
      name: "Id",
      sortable: true,
      minWidth: "172px",
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
      cell: (row) => {
        return <CallPlayer callId={row.id} />;
      },
    },
    {
      name: "Created By",
      sortable: true,
      sortField: "created_by",
      minWidth: "172px",
      selector: (row) => row.created_by,
      cell: (row) => row.created_by.first_name,
    },
    {
      name: "Created At",
      sortable: true,
      sortField: "created_at",
      minWidth: "172px",
      selector: (row) => row.created_at,
      cell: (row) => moment(row.created_at).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      name: "Actions",
      allowOverflow: true,
      cell: (row) => {
        return (
          <div className="d-flex">
            <UncontrolledDropdown>
              <DropdownToggle className="pe-1" tag="span">
                <MoreVertical size={15} />
              </DropdownToggle>
              <DropdownMenu end>
               
                <Link to={`/profiles/${row.id}/edit`}>
                  <DropdownItem>
                    <Edit size={15} />
                    <span className="align-middle ms-50">Edit</span>
                  </DropdownItem>
                </Link>
                <DropdownItem>
                  <Trash size={15} />
                  <span className="align-middle ms-50" onClick={()=>deleteCall(row.id)}>Delete</span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </div>
        );
      },
    },
  ];

  const handleSort = (column, sortDirection) => {
    console.log(column, sortDirection);
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
        onPageChange={({ selected }) => console.log(selected)}
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

  if (!calls) {
    return (
      <div className="vh-100">
        <Skeleton height={"15%"} />
        <Skeleton height={"7%"} count={9} />
      </div>
    );
  }

  return (
    <>
      <Card className="overflow-hidden workspace-list">
        <CardHeader className="py-1">
          <CardTitle tag="h4">Calls</CardTitle>
        </CardHeader>
        <div className="react-dataTable">
          <DataTable
            noHeader
            subHeader
            sortServer
            pagination
            responsive
            paginationServer
            defaultSortField={"id"}
            columns={columns}
            onSort={handleSort}
            defaultSortAsc={false}
            sortIcon={<ChevronDown />}
            className="react-dataTable"
            paginationComponent={CustomPagination}
            data={calls}
            subHeaderComponent={
              <CallListHeader
                searchTerm={searchTerm}
                rowsPerPage={rowsPerPage}
                handleFilter={handleFilter}
                handlePerPage={handlePerPage}
                toggleSidebar={toggleSidebar}
              />
            }
          />
        </div>
      </Card>
      {sidebarOpen && (
        <CallSidebar open={sidebarOpen} toggleSidebar={toggleSidebar} />
      )}
    </>
  );
};
