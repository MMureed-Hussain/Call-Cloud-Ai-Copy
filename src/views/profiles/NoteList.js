/* eslint-disable */
import { useEffect, useState, useCallback } from "react";
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
import UserInfo from "./components/UserInfo";
import { debounce } from "lodash";
import usePrevious from "../../utility/hooks/usePrevious";

const NoteList = ({ profileId }) => {
  // ** States
  const [sort, setSort] = useState("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState("id");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notes, setNotes] = useState([]);
  const [pageCount, setPageCount] = useState(1);
  const [selectedNote, setSelectedNote] = useState(null);
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
      loadNotes({
        page: 1,
      });
    }
  }, [currentWorkspace]);

  useEffect(() => {
    if (reloadNoteTable) {
      dispatch(setReloadNoteTable(false));
      loadNotes({
        page: currentPage,
      });
    }
  }, [reloadNoteTable]);

  const loadNotes = (options) => {
    let queryParams = {
      records_per_page: rowsPerPage,
      page: currentPage,
      sort_by: sortColumn,
      sort,
      ...options,
    };
    if(searchTerm){
      queryParams.search = searchTerm
    }
    dispatch(
      getNotesByProfileId({
        id: profileId,
        params: queryParams,
      })
    ).then(({ payload }) => {
      if (payload.data?.data) {
        setNotes(payload.data.data);
        setPageCount(payload.data.last_page)
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
      name: "Note",
      sortable: false,
      minWidth: "350px",
      cell: (row) => (
        <div className="d-flex justify-content-left align-items-center">
          <div className="d-flex flex-column">
            <span className="fw-bolder">{row.note}</span>
          </div>
        </div>
      ),
    },
    {
      name: "Created By",
      sortable: true,
      sortField: "created_by",
      minWidth: "250px",
      selector: (row) => row.created_by,
      cell: (row) => (
        <UserInfo
          name={`${row.created_by.first_name} ${row.created_by.last_name}`}
          email={row.created_by.email}
        />
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
                    setSelectedNote(row);
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
    loadNotes({
      page: 1,
      sort_by: column.sortField,
      sort: sortDirection,
    });
  };

  // ** Function in get data on rows per page
  const handlePerPage = (e) => {
    const value = parseInt(e.currentTarget.value);
    setRowsPerPage(value);
    loadNotes({
      page: 1,
      records_per_page: value,
    });
  };
  // ** Function in get data on search query change
  const handleFilter = (val) => {
    setSearchTerm(val);
  };

  const debounceLoadData = useCallback(debounce(loadNotes, 1000), []);
  useEffect(() => {
    if (searchTerm) {
      debounceLoadData({
        page: 1,
        search: searchTerm
      });
    }
  }, [searchTerm]);

  usePrevious(
    (prevSearchTerm) => {
      //change when search term is remove
      if (!searchTerm && prevSearchTerm) {
        loadNotes({
          page: 1,
        });
      }
    },
    [searchTerm]
  );

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
        onPageChange={({ selected }) => loadNotes({ page: selected })}
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

  if (!notes) {
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
            setSelectedNote(null);
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
            data={notes}
          />
        </div>
      </Card>
      {sidebarOpen && (
        <NoteSidebar
          open={sidebarOpen}
          callNote={selectedNote}
          toggleSidebar={toggleSidebar}
        />
      )}
    </>
  );
};

export default NoteList;
