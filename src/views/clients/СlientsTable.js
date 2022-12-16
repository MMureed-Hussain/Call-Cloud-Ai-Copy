// ** React Imports
import React, { Fragment, useState } from "react";
import { useLocation } from "react-router-dom";

// ** Invoice List Sidebar
import Sidebar from "./ClientsSidebar";

// ** Table Columns
import { adminCompanyColumns} from "./Columns";

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
  deleteCompany,
} from "@store/companies";
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
  setEditCompany,
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
                  setEditCompany(null);
                  toggleSidebar();
                }}
              >
                Add New Company
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

const ClientsTable = () => {
  const query = useQuery();

  // Show create company sidebar
  let createCompanySidebar = false;
  if (query.get("action") && query.get("action") === "create-company") {
    createCompanySidebar = true;
    const href = window.location.href.split("?")[0];
    window.history.pushState({}, document.title, href);
  }

  // ** Store Vars
  const dispatch = useDispatch();
  const store = useSelector((state) => state.companies);
  const userData = useSelector((state) => state.auth);

  // ** States
  const [sort, setSort] = useState("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(() => store.currentPage);
  const [sortColumn, setSortColumn] = useState("id");
  const [rowsPerPage, setRowsPerPage] = useState(() => store.rowsPerPage);
  const [sidebarOpen, setSidebarOpen] = useState(createCompanySidebar);

  const [editCompany, setEditCompany] = useState(null);

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


  // ** Function in get data on page change
  const handlePagination = (page) => {
    dispatch(
      getData({
        sort,
        sortColumn,
        q: searchTerm,
        perPage: rowsPerPage,
        page: page.selected + 1,
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
      q: searchTerm,
    };

    const isFiltered = Object.keys(filters).some(function (k) {
      return filters[k].length > 0;
    });

    if (store.companies.length > 0) {
      const companies = store.companies.map((company) => {
        console.log(company.id, 'company id');
        console.log(store.companies, 'store companies');
        const tempCompany = { ...company };
        console.log(tempCompany, 'tempCompany');
        tempCompany.handleEdit = (id) => {
          const editCompany = store.companies.filter(
            (company) => company.id === id
          );
          if (editCompany.length) {
            setEditCompany(editCompany[0]);
            toggleSidebar();
          }
        };
        tempCompany.handleDelete = async (id) => {
          const result = await MySwal.fire({
            title: "Are you sure?",
            text: "Are you sure you would like to delete this company?",
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
            dispatch(deleteCompany({ id }));
            refreshTable();
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
        return tempCompany;
      });

      return companies;
    } else if (store.companies.length === 0 && isFiltered) {
      return [];
    } else {
      return store.companies.slice(0, rowsPerPage);
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
      {}
      <Card className="overflow-hidden companies-list">
        <div className="react-dataTable">
          <DataTable
            noHeader
            subHeader
            sortServer
            pagination
            responsive
            paginationServer
            // prettier-ignore
            columns={userData.user.role === "company" ? adminCompanyColumns : userCompanyColumns}
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
                setEditCompany={setEditCompany}
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
          company={editCompany}
        />
      )}
    </Fragment>
  );
};

export default ClientsTable;
