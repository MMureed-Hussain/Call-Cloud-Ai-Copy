// ** React Imports
/* eslint-disable */
import { Fragment, useEffect, useState } from "react";

// ** Invoice List Sidebar
import UserSidebar from "./UserSidebar";

// ** Table Columns
import { userColumns } from "./columns";

// ** Confirm box
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "@styles/base/plugins/extensions/ext-component-sweet-alerts.scss";
const MySwal = withReactContent(Swal);

import Skeleton from "react-loading-skeleton";

// ** Store & Actions
// import { getAllData, getData } from "../store";
import
{
  getUsers,
  storeCurrentPageUser,
  storeRowsPerPageUser,
  //   deleteUser,
  deleteMemberFromWorkspace,
} from "@store/workspaces";
import { useDispatch, useSelector } from "react-redux";

// ** Third Party Components
import Select from "react-select";
import ReactPaginate from "react-paginate";
import DataTable from "react-data-table-component";
import
{
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
import
{
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

// ** Table Header
const CustomHeader = ({
  //   store,
  toggleSidebar,
  handlePerPage,
  rowsPerPage,
  handleFilter,
  searchTerm,
  userData,
  setEditUser,
}) =>
{
  return (
    <div className="invoice-list-table-header w-100 me-1 ms-50 mt-2 mb-75">
      <Row>
        <Col xl="6" className="d-flex align-items-center p-0">
          <div className="d-flex align-items-center mb-sm-0 mb-1 me-1">
            {/* <label className="mb-0" htmlFor="search-invoice"></label> */}
            <Input
              id="search-invoice"
              className="ms-50 w-80 d-flex flex-column mt-xl-0  mt-l-0 mt-sm-0 mt-m-0 mt-1"
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
            {/* <label htmlFor="rows-per-page">Entries</label> */}
          </div>

          {userData.user.role === "company" && (
            <div className="d-flex mt-xl-0  mt-l-0 mt-sm-0 mt-m-0 mt-1">
              <Button
                className="add-new-user"
                color="primary"
                onClick={() =>
                {
                  setEditUser(null);
                  toggleSidebar();
                }}
              >
                Add New User
              </Button>
            </div>
          )}
        </Col>
      </Row>
    </div>
  );
};

const UsersList = ({ workspaceId }) =>
{

  // ** Store Vars
  const dispatch = useDispatch();
  const store = useSelector((state) => state.workspaces);
  const userData = useSelector((state) => state.auth);

  // ** States
  const [sort, setSort] = useState("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(() => store.currentPageUser);
  const [sortColumn, setSortColumn] = useState("id");
  const [rowsPerPage, setRowsPerPage] = useState(() => store.rowsPerPageUser);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [editUser, setEditUser] = useState(null);

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
  const toggleSidebar = () =>
  {
    setSidebarOpen(!sidebarOpen);
  };

  const refreshTable = () =>
  {
    dispatch(
      getUsers({
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

  useEffect(() =>
  {
    if (!store.usersLoading) {
      dispatch(
        getUsers({
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
  if (store.usersLoading) {
    dispatch(
      getUsers({
        sort,
        sortColumn,
        q: searchTerm,
        page: currentPage,
        perPage: rowsPerPage,
        id: workspaceId,
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
  const handlePagination = (page) =>
  {
    dispatch(
      getUsers({
        sort,
        sortColumn,
        q: searchTerm,
        perPage: rowsPerPage,
        page: page.selected + 1,
        id: workspaceId,
        // role: currentRole.value,
        // status: currentStatus.value,
        // currentPlan: currentPlan.value,
      })
    );
    const newPage = page.selected + 1;
    setCurrentPage(newPage);
    dispatch(storeCurrentPageUser({ currentPage: newPage }));
  };

  // ** Function in get data on rows per page
  const handlePerPage = (e) =>
  {
    const value = parseInt(e.currentTarget.value);
    dispatch(
      getUsers({
        sort,
        sortColumn,
        q: searchTerm,
        perPage: value,
        page: 1,
        id: workspaceId,
        // role: currentRole.value,
        // currentPlan: currentPlan.value,
        // status: currentStatus.value,
      })
    );
    setCurrentPage(1);
    setRowsPerPage(value);
    dispatch(storeCurrentPageUser({ currentPage: 1 }));
    dispatch(storeRowsPerPageUser({ rowsPerPage: value }));
  };

  // ** Function in get data on search query change
  const handleFilter = (val) =>
  {
    setSearchTerm(val);
    dispatch(
      getUsers({
        sort,
        q: val,
        sortColumn,
        page: currentPage,
        perPage: rowsPerPage,
        id: workspaceId,
        // role: currentRole.value,
        // status: currentStatus.value,
        // currentPlan: currentPlan.value,
      })
    );
  };

  // ** Custom Pagination
  const CustomPagination = () =>
  {
    const count = Number(Math.ceil(store.totalUsers / rowsPerPage));

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
  const dataToRender = () =>
  {
    const filters = {
      //   role: currentRole.value,
      //   currentPlan: currentPlan.value,
      //   status: currentStatus.value,
      q: searchTerm,
    };

    const isFiltered = Object.keys(filters).some(function (k)
    {
      return filters[k].length > 0;
    });

    if (store.users.length > 0) {
      const users = store.users.map((user) =>
      {
        const tempUser = { ...user };
        tempUser.handleEdit = (id) =>
        {
          const editUser = store.users.filter((user) => user.id === id);
          if (editUser.length) {
            setEditUser(editUser[0]);
            toggleSidebar();
          }
        };
        tempUser.handleDelete = async (id, joinedAt) =>
        {
        
          // prettier-ignore
          const text = joinedAt ? "Are you sure you would like to remove this user?" : "Are you sure you would like to cancel this invitation?";
          // prettier-ignore
          const confirmButtonText = joinedAt ? "Yes, remove it!" : "Yes, cancel it!";

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
            dispatch(deleteMemberFromWorkspace({ id }));
  
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

      return users;
    } else if (store.users.length === 0 && isFiltered) {
      return [];
    } else {
      return store.users.slice(0, rowsPerPage);
    }
  };

  const handleSort = (column, sortDirection) =>
  {
    console.log(column, sortDirection);
    setSort(sortDirection);
    setSortColumn(column.sortField);
    dispatch(
      getUsers({
        sort: sortDirection,
        sortColumn: column.sortField,
        q: searchTerm,
        page: currentPage,
        perPage: rowsPerPage,
        id: workspaceId,
        // role: currentRole.value,
        // status: currentStatus.value,
        // currentPlan: currentPlan.value,
      })
    );
  };

  if (store.usersLoading) {
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
      {/* {store.currentWorkspace && (
        <p>Manage workspace: {store.currentWorkspace.name}</p>
      )} */}
      <Card className="overflow-hidden workspace-list">
        <div className="react-dataTable">
          <DataTable
            noHeader
            subHeader
            sortServer
            pagination
            responsive
            paginationServer
            columns={userColumns}
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
                userData={userData}
                setEditUser={setEditUser}
              />
            }
          />
        </div>
      </Card>

      {sidebarOpen && (
        <UserSidebar
          open={sidebarOpen}
          refreshTable={refreshTable}
          toggleSidebar={toggleSidebar}
          workspaceId={workspaceId}
          user={editUser}
          auth={userData}
        />
      )}
    </Fragment>
  );
};
export default UsersList;
