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
import NoteSidebar from "./components/NoteSidebar";
import NoteListHeader from "./components/NoteListHeader";
import { useDispatch, useSelector } from "react-redux";
import { Edit, Trash, MoreVertical } from "react-feather";
import {
  getNotesByProfileId,
  setReloadNoteTable,
  deleteNote,
} from "../../redux/profiles";

const NoteList = ({ profileId }) => {
  // ** States
  const [sort, setSort] = useState("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState("id");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [calls, setCalls] = useState([]);
  const [pageCount, setPageCount] = useState(1);
  const [selectedCall, setSelectedCall] = useState(null);

  const [viewSidebarOpen, setViewSidebarOpen] = useState(false);

  const dispatch = useDispatch();
  const reloadNoteTable = useSelector(
    (state) => state.profiles.reloadNoteTable
  );
  const currentWorkspace = useSelector(
    (state) => state.workspaces.currentWorkspace
  );

  useEffect(() => {
    if (currentWorkspace) {
      loadCalls({
        page: 1,
      });
    }
  }, [currentWorkspace]);

  useEffect(() => {
    if (reloadNoteTable) {
      dispatch(setReloadNoteTable(false));
      loadCalls({
        page: currentPage,
      });
    }
  }, [reloadNoteTable]);

  const loadCalls = (options) => {
    let queryParams = {
      records_per_page: rowsPerPage,
      page: currentPage,
      sort_by: sortColumn,
      sort,
      ...options,
    };
    dispatch(
      getNotesByProfileId({
        id: profileId,
        params: queryParams,
      })
    ).then(({ payload }) => {
      if (payload.data !== null) {
        // console.log("===Note===1", payload.data.notes);
        setCalls(payload.data.notes);
        // console.log("===Note===2", calls);
      }
    });
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
      name: "Notes",
      sortable: false,
      minWidth: "350px",
      cell: (row) => (
        <div className="d-flex justify-content-left align-items-center">
          <div className="d-flex flex-column">
            <span className="fw-bolder">{row.notes}</span>
          </div>
        </div>
      ),
    },
    {
      name: "Actions",
      allowOverflow: true,
      right: true,
      cell: (row) => {
        return (
          <div className="d-flex">
            <UncontrolledDropdown>
              <DropdownToggle className="pe-1" tag="span">
                <MoreVertical size={15} />
              </DropdownToggle>
              <DropdownMenu container={"body"} end>
                <DropdownItem
                  onClick={() => {
                    setSelectedCall(row);
                    toggleSidebar();
                  }}
                >
                  <Edit size={15} />
                  <span className="align-middle ms-50">Edit</span>
                </DropdownItem>
                <DropdownItem onClick={() => dispatch(deleteNote(row.id))}>
                  <Trash size={15} />
                  <span className="align-middle ms-50">Delete</span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </div>
        );
      },
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

  const toggleViewSidebar = () => {
    setViewSidebarOpen(!viewSidebarOpen);
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
      <Card>
        <CardHeader className="py-1">
          <CardTitle tag="h4">Notes</CardTitle>
        </CardHeader>
        <NoteListHeader
          searchTerm={searchTerm}
          rowsPerPage={rowsPerPage}
          handleSearch={handleFilter}
          handlePerPage={handlePerPage}
          toggleSidebar={() => {
            setSelectedCall(null);
            toggleSidebar();
          }}
        />
        <div className="react-dataTable">
          <DataTable
            noHeader
            sortServer
            pagination
            responsive
            paginationServer
            defaultSortField={"id"}
            columns={columns}
            onSort={handleSort}
            defaultSortAsc={false}
            style={{ width: "80vw" }}
            sortIcon={<ChevronDown />}
            className="react-dataTable"
            paginationComponent={CustomPagination}
            data={calls}
          />
        </div>
      </Card>
      {sidebarOpen && (
        <NoteSidebar
          open={sidebarOpen}
          call={selectedCall}
          toggleSidebar={toggleSidebar}
        />
      )}
    </>
  );
};

export default NoteList;
