// ** React Imports
import { Fragment, useEffect, useState, useRef } from "react";

import Skeleton from "react-loading-skeleton";

import {
  getActivityLogs,
  setCurrentPage as storeCurrentPage,
  setRowsPerPage as storeRowsPerPage
} from "@store/activityLogs";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

// ** Third Party Components
import ReactPaginate from "react-paginate";
import DataTable from "react-data-table-component";
import { ChevronDown } from "react-feather";

// ** Utils
// eslint-disable-next-line no-unused-vars
import { selectThemeColors } from "@utils";

// ** Reactstrap Imports
import {
  Row,
  Col,
  Card,
  Input
} from "reactstrap";
import { ActivityLogTableColumns } from "./TableColumns";

// ** Styles
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/libs/tables/react-dataTable-component.scss";

// ** Table Header
const CustomHeader = ({
  handlePerPage,
  rowsPerPage,
  handleFilter,
  // searchTerm,
  userData
}) => {
  const ref = useRef();
  return (
    <div className="invoice-list-table-header w-100 me-1 ms-50 mt-2 mb-75">
      <Row>
        <Col xl="6" className="d-flex align-items-center p-0">
          <div className="d-flex align-items-center mb-sm-0 mb-1 me-1">
            {/* <label className="mb-0" htmlFor="search-invoice"></label> */}
            {/* <Input
              id="search-invoice"
              className="ms-50 w-100"
              type="text"
              placeholder="Type to find"
              value={searchTerm}
              onChange={(e) => handleFilter(e.target.value)}
            /> */}
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

          {userData.user.role === "company" && (
            <div className="d-flex align-items-center table-header-actions">
              <Input
                id="fileName"
                className="ms-50 w-100"
                title="import"
                ref={ref}
                type="file"
                style={{ display: "none" }}
                onChange={(e) => handleFilter(e.target.value)}
              />
            </div>
          )}
        </Col>
      </Row>
    </div>
  );
};

const ActivityLogList = ({ workspaceId }) => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const store = useSelector((state) => state.activityLogs);
  const userData = useSelector((state) => state.auth);
  const [sort, setSort] = useState("desc");
  const [searchTerm, SetSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(() => store.currentPage);
  const [sortColumn, setSortColumn] = useState("id");
  const [rowsPerPage, setRowsPerPage] = useState(() => store.rowsPerPage);

  const fetchActivityLogs = () => {
    dispatch(
      getActivityLogs({
        model_type: searchParams.get('model_type'),
        model_id: searchParams.get('model_id'),
        sort,
        sort_by: sortColumn,
        // q: searchTerm,
        page: currentPage,
        per_page: rowsPerPage,
        // id: workspaceId,
      })
    );
  }

  // ** Function in get data on page change
  const handlePagination = (page) => {
    const newPage = page.selected + 1;
    setCurrentPage(newPage);
    dispatch(storeCurrentPage(newPage));
  };

  // ** Function in get data on rows per page
  const handlePerPage = (e) => {
    const value = parseInt(e.currentTarget.value);
    setCurrentPage(1);
    setRowsPerPage(value);
    dispatch(storeCurrentPage(1));
    dispatch(storeRowsPerPage(value));
  };

  // ** Function in get data on search query change
  const handleFilter = (val) => {
    console.log("search q", val);
    // setSearchTerm(val);
  };

  // ** Custom Pagination
  const CustomPagination = () => {
    const count = Number(Math.ceil(store.totalCount / rowsPerPage));
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

  const handleSort = (column, sortDirection) => {
    setSort(sortDirection);
    setSortColumn(column.sortField);
  };

  useEffect(() => {
    fetchActivityLogs();
  }, [workspaceId, rowsPerPage, sort, sortColumn, currentPage]);

  if (store.isLoading) {
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
            columns={ActivityLogTableColumns}
            onSort={handleSort}
            sortIcon={<ChevronDown />}
            className="react-dataTable"
            paginationComponent={CustomPagination}
            data={store.logs}
            subHeaderComponent={
              <CustomHeader
                searchTerm={searchTerm}
                rowsPerPage={rowsPerPage}
                handleFilter={handleFilter}
                handlePerPage={handlePerPage}
                userData={userData}
              />
            }
          />
        </div>
      </Card>
    </Fragment>
  );
};
export default ActivityLogList;