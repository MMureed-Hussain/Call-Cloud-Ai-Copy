// ** React Imports
import { Fragment, useEffect, useState } from "react";

// ** Invoice List Sidebar
import QueueSidebar from "./QueueSidebar";

// ** Table Columns
import { QueueTableColumn} from './QueueTableColumn'

// ** Confirm box
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "@styles/base/plugins/extensions/ext-component-sweet-alerts.scss";
const MySwal = withReactContent(Swal);

import Skeleton from "react-loading-skeleton";

// ** Store & Actions
// import { getAllData, getData } from "../store";
import {

  storeCurrentPageQueue,
  storeRowsPerPageQueue,
  getQueue,
  deleteQueueFromWorkspace
} from "@store/workspaces";
import { useDispatch, useSelector } from "react-redux";

// ** Third Party Components
import Select from "react-select";
import ReactPaginate from "react-paginate";
import DataTable from "react-data-table-component";
import {
  ChevronDown,
} from "react-feather";

// ** Utils
// eslint-disable-next-line no-unused-vars
import { selectThemeColors } from "@utils";

// ** Reactstrap Imports
import {
  Row,
  Col,
  Card,
  Input,
  Button,
} from "reactstrap";

// ** Styles
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/libs/tables/react-dataTable-component.scss";

// ** Table Header
const CustomHeader = ({
  //   store,
  toggleSidebar,
  handlePerPage,
  rowsPerPage,
  handleFilter,
  searchTerm,
  queueData,
  setEditQueue,
}) => {
  return (
    <div className="invoice-list-table-header w-100 me-1 ms-50 mt-2 mb-75">
      <Row>
        <Col xl="6" className="d-flex align-items-center p-0">
          <div className="d-flex align-items-center mb-sm-0 mb-1 me-1">
            <Input
              id="search-invoice"
              className="ms-50 w-100"
              type="text"
              placeholder="Type to find"
              value={searchTerm}
              onChange={(e) => handleFilter(e.target.value)}
            />
          </div>
        </Col>
        <Col
          xl="6"
          className="d-flex align-items-sm-center justify-content-xl-end justify-content-start flex-xl-nowrap flex-wrap flex-sm-row flex-column pe-xl-1 p-0 mt-xl-0 mt-1"
        >
          <div className="d-flex align-items-center mx-50">
            <label htmlFor="rows-per-page">Show</label>
            <Input
              className="mx-50"
              type="select"
              id="rows-per-page"
              value={rowsPerPage}
              onChange={handlePerPage}
              style={{ width: "5rem" }}
            >
              {/* <option value="2">2</option> */}
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </Input>
          </div>

          {queueData.user.role === "company" && (
            <div className="d-flex align-items-center table-header-actions">
              <Button
                className="add-new-queue"
                color="primary"
                onClick={() => {
                  setEditQueue(null);
                  toggleSidebar();
                }}
              >
                Create New Queue
              </Button>
            </div>
          )}
        </Col>
      </Row>
    </div>
  );
};

const Queue = ({ workspaceId }) => {
  // ** Store Vars
  const dispatch = useDispatch();
  const store = useSelector((state) => state.workspaces);
  const queueData = useSelector((state) => state.auth);

  // ** States
  const [sort, setSort] = useState("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(() => store.currentPageQueue);
  const [sortColumn, setSortColumn] = useState("id");
  const [rowsPerPage, setRowsPerPage] = useState(() => store.rowsPerPageQueue);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [editQueue, setEditQueue] = useState(null);

  // ** Function to toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const refreshTable = () => {
    dispatch(
      getQueue({
        sort,
        sortColumn,
        q: searchTerm,
        page: currentPage,
        perPage: rowsPerPage,
        id: workspaceId,
      })
    );
  };

  // ** Get data on mount
  useEffect(() => {
    if (store.queueLoading && workspaceId) {
      dispatch(
        getQueue({
          sort,
          sortColumn,
          q: searchTerm,
          page: currentPage,
          perPage: rowsPerPage,
          id: workspaceId,
        })
      );
    }
  }, [workspaceId]);

  // ** Function in get data on page change
  const handlePagination = (page) => {
    dispatch(
      getQueue({
        sort,
        sortColumn,
        q: searchTerm,
        perPage: rowsPerPage,
        page: page.selected + 1,
        id: workspaceId,
      })
    );
    const newPage = page.selected + 1;
    setCurrentPage(newPage);
    dispatch(storeCurrentPageQueue({ currentPage: newPage }));
  };

  // ** Function in get data on rows per page
  const handlePerPage = (e) => {
    const value = parseInt(e.currentTarget.value);
    dispatch(
      getQueue({
        sort,
        sortColumn,
        q: searchTerm,
        perPage: value,
        page: 1,
        id: workspaceId,
      })
    );
    setCurrentPage(1);
    setRowsPerPage(value);
    dispatch(storeCurrentPageQueue({ currentPage: 1 }));
    dispatch(storeRowsPerPageQueue({ rowsPerPage: value }));
  };

  // ** Function in get data on search query change
  const handleFilter = (val) => {
    setSearchTerm(val);
    refreshTable();
  };

  // ** Custom Pagination
  const CustomPagination = () => {
    const count = Number(Math.ceil(store.totalQueue / rowsPerPage));

    return (
      <ReactPaginate
        previousLabel={""}
        nextLabel={""}
        pageCount={count || 1}
        activeClassName="active"
        forcePage={currentPage !== 0 ? currentPage - 1 : 0}
        onPageChange={(page) => handlePagination(page)}
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

  // ** Table data to render
  const dataToRender = () => {
    const filters = {
      q: searchTerm,
    };

    const isFiltered = Object.keys(filters).some(function (k) {
      return filters[k].length > 0;
    });

    if (store.queue.length > 0) {
      const queue = store.queue.map((queue) => {
        const tempUser = { ...queue };
        tempUser.handleEdit = (id) => {
          const editQueue = store.queue.filter((queue) => queue.id === id);
          if (editQueue.length) {
            setEditQueue(editQueue[0]);
            toggleSidebar();
          }
        };
        tempUser.handleDelete = async (id, joinedAt) => {
          console.log("joinedAt", id);
          // prettier-ignore
          const text = joinedAt ? "Are you sure you would like to delete this queue?" : "Are you sure you would like to delete this queue?";
          // prettier-ignore
          const confirmButtonText = joinedAt ? "Yes, delete it!" : "Yes, delete it!";
          console.log("jinnedatt", joinedAt)

          const result = await MySwal.fire({
            title: "Are you sure?",
            text,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText,
            customClass: {
              confirmButton: "btn btn-primary",
              cancelButton: "btn btn-danger ms-1",
            },
            buttonsStyling: false,
          });
          if (result.value) {
            dispatch(deleteQueueFromWorkspace({ id, workspaceId }));
            console.log("delete queue", id);
            refreshTable();
          } else if (result.dismiss === MySwal.DismissReason.cancel) {
            MySwal.fire({
              title: "Cancelled",
              text: "Action Cancelled!!",
              icon: "error",
              customClass: {
                confirmButton: "btn btn-success",
              },
            });
          }
        };
        return tempUser;
      });

      return queue;
    } else if (store.queue.length === 0 && isFiltered) {
      return [];
    } else {
      return store.queue.slice(0, rowsPerPage);
    }
  };

  const handleSort = (column, sortDirection) => {
    console.log(column, sortDirection);
    setSort(sortDirection);
    setSortColumn(column.sortField);
    dispatch(
      getQueue({
        sort: sortDirection,
        sortColumn: column.sortField,
        q: searchTerm,
        page: currentPage,
        perPage: rowsPerPage,
        id: workspaceId,
      })
    );
  };

  if (store.queueLoading) {
    return (
      <Fragment>
        <div className="vh-100">
          <Skeleton height={"15%"} />
          <Skeleton height={"7%"} count={9} />
        </div>
      </Fragment>
    );
  }

  return (
    <Fragment>
      <Card className="overflow-hidden workspace-list">
        <div className="react-dataTable">
          <DataTable
            noHeader
            subHeader
            sortServer
            pagination
            responsive
            paginationServer
            columns={QueueTableColumn}
            onSort={handleSort}
            sortIcon={<ChevronDown />}
            className="react-dataTable"
            paginationComponent={CustomPagination}
            data={dataToRender()}
            subHeaderComponent={
              <CustomHeader
                store={store}
                searchTerm={searchTerm}
                rowsPerPage={rowsPerPage}
                handleFilter={handleFilter}
                handlePerPage={handlePerPage}
                toggleSidebar={toggleSidebar}
                queueData={queueData}
                setEditQueue={setEditQueue}
              />
            }
          />
        </div>
      </Card>

      {sidebarOpen && (
        <QueueSidebar
          open={sidebarOpen}
          refreshTable={refreshTable}
          toggleSidebar={toggleSidebar}
          workspaceId={workspaceId}
          queue={editQueue}
        />
      )}
    </Fragment>
  );
};
export default Queue;