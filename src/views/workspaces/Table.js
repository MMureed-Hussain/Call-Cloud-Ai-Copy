// ** React Imports
import React, { Fragment, useState } from "react";
import { useLocation } from "react-router-dom";

// ** Invoice List Sidebar
import Sidebar from "./Sidebar";

// ** Table Columns
import { adminWorkspaceColumns, userWorkspaceColumns } from "./columns";

// ** Confirm box
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "@styles/base/plugins/extensions/ext-component-sweet-alerts.scss";
const MySwal = withReactContent(Swal);

// ** Store & Actions
// import { getAllData, getData } from "../store";
import {
  getData,
  storeCurrentPage,
  storeRowsPerPage,
  deleteWorkspace,
} from "@store/workspaces";
import { useDispatch, useSelector } from "react-redux";

// ** Third Party Components
import Select from "react-select";
import ReactPaginate from "react-paginate";
import DataTable from "react-data-table-component";
import {
  ChevronDown,
  Share,
  Printer,
  FileText,
  File,
  Grid,
  Copy,
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
  Label,
  Button,
  CardBody,
  CardTitle,
  CardHeader,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  UncontrolledDropdown,
} from "reactstrap";

// ** Styles
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import Skeleton from "react-loading-skeleton";



// ** Table Header
const CustomHeader = ({
  //   store,
  toggleSidebar,
  handlePerPage,
  rowsPerPage,
  handleFilter,
  searchTerm,
  setEditWorkspace,
  userData,
}) => {

  return (
    <div className="invoice-list-table-header w-100 me-1 ms-50 mt-2 mb-75">
      <Row>
        <Col xl="6" className="d-flex align-items-center p-0">
          <div className="d-flex align-items-center mb-sm-0 mb-1 me-1">
            <label className="mb-0" htmlFor="search-invoice"></label>
            <Input
              id="search-invoice"
              className="ms-50 w-100"
              type="text"
              value={searchTerm}
              placeholder="Type to find"
              onChange={(e) => handleFilter(e.target.value)}
            />
          </div>
        </Col>

        <Col
          xl="6"
          className="d-flex align-items-sm-center justify-content-xl-end justify-content-start flex-xl-nowrap flex-wrap flex-sm-row flex-column pe-xl-1 p-0 mt-xl-0 mt-1"
        >
          <div className="d-flex align-items-center mx-1">
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
            {/* <label htmlFor="rows-per-page">Entries</label> */}
          </div>

          {userData.user.role === "company" && (
            <div className="d-flex align-items-center table-header-actions">
              <Button
                className="add-new-user"
                color="primary"
                onClick={() => {
                  setEditWorkspace(null);
                  toggleSidebar();
                }}
              >
                Add New Workspace
              </Button>
            </div>
          )}
        </Col>
      </Row>
    </div>
  );
};
function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

const WorkspacesList = () => {
  const query = useQuery();

  // Show create workspace sidebar
  let createWorkspaceSidebar = false;
  if (query.get("action") && query.get("action") === "create-workspace") {
    createWorkspaceSidebar = true;
    const href = window.location.href.split("?")[0];
    window.history.pushState({}, document.title, href);
  }

  // ** Store Vars
  const dispatch = useDispatch();
  const store = useSelector((state) => state.workspaces);
  const userData = useSelector((state) => state.auth);

  // ** States
  const [sort, setSort] = useState("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(() => store.currentPage);
  const [sortColumn, setSortColumn] = useState("id");
  const [rowsPerPage, setRowsPerPage] = useState(() => store.rowsPerPage);
  const [sidebarOpen, setSidebarOpen] = useState(createWorkspaceSidebar);

  const [editWorkspace, setEditWorkspace] = useState(null);

  //   const [currentRole, setCurrentRole] = useState({
  //     value: "",
  //     label: "Select Role",
  //   });
  //   const [currentPlan, setCurrentPlan] = useState({
  //     value: "",
  //     label: "Select Plan",
  //   });
  //   const [currentStatus, setCurrentStatus] = useState({
  //     value: "",
  //     label: "Select Status",
  //     number: 0,
  //   });

  // ** Function to toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const refreshTable = () => {
    dispatch(
      getData({
        sort,
        sortColumn,
        q: searchTerm,
        page: currentPage,
        perPage: rowsPerPage,
      })
    );
  };

  // ** Get data on mount
  if (store.loading) {
    dispatch(
      getData({
        sort,
        sortColumn,
        q: searchTerm,
        page: currentPage,
        perPage: rowsPerPage,
      })
    );
  }
  //   useEffect(() => {
  //     dispatch(

  //     );
  //   }, [dispatch, store.workspaces.length, sort, sortColumn, currentPage]);

  // ** User filter options
  //   const roleOptions = [
  //     { value: "", label: "Select Role" },
  //     { value: "admin", label: "Admin" },
  //     { value: "author", label: "Author" },
  //     { value: "editor", label: "Editor" },
  //     { value: "maintainer", label: "Maintainer" },
  //     { value: "subscriber", label: "Subscriber" },
  //   ];

  //   const planOptions = [
  //     { value: "", label: "Select Plan" },
  //     { value: "basic", label: "Basic" },
  //     { value: "company", label: "Company" },
  //     { value: "enterprise", label: "Enterprise" },
  //     { value: "team", label: "Team" },
  //   ];

  //   const statusOptions = [
  //     { value: "", label: "Select Status", number: 0 },
  //     { value: "pending", label: "Pending", number: 1 },
  //     { value: "active", label: "Active", number: 2 },
  //     { value: "inactive", label: "Inactive", number: 3 },
  //   ];

  // ** Function in get data on page change
  const handlePagination = (page) => {
    dispatch(
      getData({
        sort,
        sortColumn,
        q: searchTerm,
        perPage: rowsPerPage,
        page: page.selected + 1,
        // role: currentRole.value,
        // status: currentStatus.value,
        // currentPlan: currentPlan.value,
      })
    );
    const newPage = page.selected + 1;
    setCurrentPage(newPage);
    dispatch(storeCurrentPage({ currentPage: newPage }));
  };

  // ** Function in get data on rows per page
  const handlePerPage = (e) => {
    const value = parseInt(e.currentTarget.value);
    dispatch(
      getData({
        sort,
        sortColumn,
        q: searchTerm,
        perPage: value,
        page: 1,
        // role: currentRole.value,
        // currentPlan: currentPlan.value,
        // status: currentStatus.value,
      })
    );
    setCurrentPage(1);
    setRowsPerPage(value);
    dispatch(storeCurrentPage({ currentPage: 1 }));
    dispatch(storeRowsPerPage({ rowsPerPage: value }));
  };

  // ** Function in get data on search query change
  const handleFilter = (val) => {
    setSearchTerm(val);
    dispatch(
      getData({
        sort,
        q: val,
        sortColumn,
        page: currentPage,
        perPage: rowsPerPage,
        // role: currentRole.value,
        // status: currentStatus.value,
        // currentPlan: currentPlan.value,
      })
    );
  };

  // ** Custom Pagination
  const CustomPagination = () => {
    const count = Number(Math.ceil(store.total / rowsPerPage));

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
      //   role: currentRole.value,
      //   currentPlan: currentPlan.value,
      //   status: currentStatus.value,
      q: searchTerm,
    };

    const isFiltered = Object.keys(filters).some(function (k) {
      return filters[k].length > 0;
    });

    if (store.workspaces.length > 0) {
      const workspaces = store.workspaces.map((workspace) => {
        const tempWorkspace = { ...workspace };
        tempWorkspace.handleEdit = (id) => {
          const editWorkspace = store.workspaces.filter(
            (workspace) => workspace.id === id
          );
          if (editWorkspace.length) {
            setEditWorkspace(editWorkspace[0]);
            toggleSidebar();
          }
        };
        tempWorkspace.handleDelete = async (id) => {
          const result = await MySwal.fire({
            title: "Are you sure?",
            text: "Are you sure you would like to delete this workspace?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            customClass: {
              confirmButton: "btn btn-primary",
              cancelButton: "btn btn-danger ms-1",
            },
            buttonsStyling: false,
          });
          if (result.value) {
            dispatch(deleteWorkspace({ id }));
            refreshTable();

            setTimeout(() => {
              window.location.href = '/workspaces'
            }, 500);

          } else if (result.dismiss === MySwal.DismissReason.cancel) {
            MySwal.fire({
              title: "Cancelled",
              text: "Deactivation Cancelled!!",
              icon: "error",
              customClass: {
                confirmButton: "btn btn-success",
              },
            });
          }
        };
        return tempWorkspace;
      });

      return workspaces;
    } else if (store.workspaces.length === 0 && isFiltered) {
      return [];
    } else {
      return store.workspaces.slice(0, rowsPerPage);
    }
  };

  const handleSort = (column, sortDirection) => {
    console.log(column, sortDirection);
    setSort(sortDirection);
    setSortColumn(column.sortField);
    dispatch(
      getData({
        sort: sortDirection,
        sortColumn: column.sortField,
        q: searchTerm,
        page: currentPage,
        perPage: rowsPerPage,
        // role: currentRole.value,
        // status: currentStatus.value,
        // currentPlan: currentPlan.value,
      })
    );
  };

  if (store.loading) {
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
      {/* <Card>
        <CardHeader>
          <CardTitle tag="h4">Filters</CardTitle>
        </CardHeader>
        <CardBody>
          <Row>
            <Col md="4">
              <Label for="role-select">Role</Label>
              <Select
                isClearable={false}
                value={currentRole}
                options={roleOptions}
                className="react-select"
                classNamePrefix="select"
                theme={selectThemeColors}
                onChange={(data) => {
                  setCurrentRole(data);
                  dispatch(
                    getData({
                      sort,
                      sortColumn,
                      q: searchTerm,
                      role: data.value,
                      page: currentPage,
                      perPage: rowsPerPage,
                      status: currentStatus.value,
                      currentPlan: currentPlan.value,
                    })
                  );
                }}
              />
            </Col>
            <Col className="my-md-0 my-1" md="4">
              <Label for="plan-select">Plan</Label>
              <Select
                theme={selectThemeColors}
                isClearable={false}
                className="react-select"
                classNamePrefix="select"
                options={planOptions}
                value={currentPlan}
                onChange={(data) => {
                  setCurrentPlan(data);
                  dispatch(
                    getData({
                      sort,
                      sortColumn,
                      q: searchTerm,
                      page: currentPage,
                      perPage: rowsPerPage,
                      role: currentRole.value,
                      currentPlan: data.value,
                      status: currentStatus.value,
                    })
                  );
                }}
              />
            </Col>
            <Col md="4">
              <Label for="status-select">Status</Label>
              <Select
                theme={selectThemeColors}
                isClearable={false}
                className="react-select"
                classNamePrefix="select"
                options={statusOptions}
                value={currentStatus}
                onChange={(data) => {
                  setCurrentStatus(data);
                  dispatch(
                    getData({
                      sort,
                      sortColumn,
                      q: searchTerm,
                      page: currentPage,
                      status: data.value,
                      perPage: rowsPerPage,
                      role: currentRole.value,
                      currentPlan: currentPlan.value,
                    })
                  );
                }}
              />
            </Col>
          </Row>
        </CardBody>
      </Card> */}

      <Card className="overflow-hidden workspace-list">
        <div className="react-dataTable">
          <DataTable
            noHeader
            subHeader
            sortServer
            pagination
            responsive
            paginationServer
            // prettier-ignore
            columns={userData.user.role === "company" ? adminWorkspaceColumns : userWorkspaceColumns}
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
                setEditWorkspace={setEditWorkspace}
                userData={userData}
              />
            }
          />
        </div>
      </Card>

      {sidebarOpen && (
        <Sidebar
          open={sidebarOpen}
          refreshTable={refreshTable}
          toggleSidebar={toggleSidebar}
          workspace={editWorkspace}
        />
      )}
    </Fragment>
  );
};

export default WorkspacesList;
