// ** React Imports
import { Fragment, useEffect, useState, useRef } from "react";

// ** Invoice List Sidebar
import LeadlistSidebar from "./LeadlistSidebar";
import CsvSidebar from "./CsvSidebar";

// ** Table Columns
import { LeadlistColumns, NewTable } from "./columns";
// ** Confirm box
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "@styles/base/plugins/extensions/ext-component-sweet-alerts.scss";
const MySwal = withReactContent(Swal);

import Skeleton from "react-loading-skeleton";
import { isEmpty } from "lodash";

// ** Store & Actions
// import { getAllData, getData } from "../store";
import {
  getLeadlist,
  getRecord,
  storeCurrentPageLeadlist,
  storeRowsPerPageLeadlist,
  getCsv,
  deleteLeadlistWorkspace,
} from "@store/workspaces";
import { useDispatch, useSelector } from "react-redux";

// ** Third Party Components
import Select from "react-select";
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
  Input,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";

// ** Styles
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import SidebarWorkspace from "./Sidebar";

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
  handleDownloadCsv,
}) => {
  const ref = useRef();
  return (
    <div className="invoice-list-table-header w-100 me-1 ms-50 mt-2 mb-75">
      <Row>
        <Col xl="6" className="d-flex align-items-center p-0">
          <div className="d-flex align-items-center mb-sm-0 mb-1 me-1">
            {/* <label className="mb-0" htmlFor="search-invoice"></label> */}
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
              {/* <Button
              // ref={ref}
                className="add-new-user me-1"
                color="primary"
                onClick={() => {
                  // setEditUser(null);
                  toggleSidebarImport()
                }}
                
              >
            
                Import
              </Button> */}
              {/* <input ref={ref} type="file" /> */}
              {/* <Button
                className="add-new-user me-1"
                color="primary"
                onClick={() => {
                  handleDownloadExp()
                  // setEditUser(null);
                  // toggleSidebar();
                }}
              >
                Export
              </Button> */}

              <Button
                className="add-new-user me-1"
                color="primary"
                onClick={() => {
                  handleDownloadCsv();
                }}
              >
                Sample CSV
              </Button>

              <Button
                className="add-new-user"
                color="primary"
                onClick={() => {
                  setEditUser(null);
                  toggleSidebar();
                }}
              >
                Add List
              </Button>
            </div>
          )}
        </Col>
      </Row>
    </div>
  );
};

const LeadList = ({ workspaceId }) => {
  // ** Store Vars
  const dispatch = useDispatch();
  const store = useSelector((state) => state.workspaces);
  const userData = useSelector((state) => state.auth);
  const csvData = useSelector((state) => state.workspaces?.csv);
  // ** States
  const [sort, setSort] = useState("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(() => store.currentPageUser);
  const [sortColumn, setSortColumn] = useState("id");
  const [rowsPerPage, setRowsPerPage] = useState(() => store.rowsPerPageUser);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarOpenImport, setSidebarOpenImport] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [record, setRecord] = useState({});

  const [editUser, setEditUser] = useState(null);
  const [recordColums, setRecordColmns] = useState([]);
  const [recordData, setRecordData] = useState([]);

  const toggleSidebarImport = () => {
    setSidebarOpenImport(!sidebarOpenImport);
  };

  useEffect(() => {
    console.log("runing record effect");
    if (!isEmpty(record)) {
      const localCols = [];
      let localData = [];
      Object.values(record.headers).map((entry) => {
        localCols.push({
          name: entry.external_header,
          sortable: true,
          minWidth: '172px',
          selector: (row) =>  {
            return row[entry.header]
          },
          cell: (row) =>  {
            return row[entry.header]
          }
        });
      });

      localData = [...record.rows];

      setRecordColmns(localCols);
      setRecordData(localData);
    }
  }, [record]);
  const refreshTable = () => {
    dispatch(
      getLeadlist({
        sort,
        sortColumn,
        q: searchTerm,
        page: currentPage,
        perPage: rowsPerPage,
        id: workspaceId,
      })
    );
  };
  const handleRowClicked = (row) => {
    console.log('handleRowClicked called');
    toggleModal();
    dispatch(getRecord(row.id)).then((result) => {
      console.log('setRecord called');
      setRecord(result.payload.data.record);
    });
  };
  const toggleSidebar = () => {
    refreshTable();
    setSidebarOpen(!sidebarOpen);
  };

  // ** Get data on mount
  const getCsvData = () => {
    dispatch(getCsv(csvData));
  };
  const handleDownloadCsv = () => {
    const tempLink = document.createElement("a");
    // const response = await axios.get(
    //   `${process.env.REACT_APP_API_ENDPOINT}/api/dummycsv/`
    // );
    tempLink.href = `${process.env.REACT_APP_API_ENDPOINT}/api/leadlists/dummycsv`;
    tempLink.download = `dummycsv`;
    tempLink.click();
  };

  const handleDownloadExp = () => {
    const tempLink = document.createElement("a");
    // if (workspaceState) {

    tempLink.href = `${process.env.REACT_APP_API_ENDPOINT}/api/leadlist/export/${workspaceId}/`;
    tempLink.download = `dummycsv`;
    tempLink.click();
    // }
  };
  useEffect(() => {
    if (!store.leadlistLoading) {
      dispatch(
        getLeadlist({
          sort,
          sortColumn,
          q: searchTerm,
          page: currentPage,
          perPage: rowsPerPage,
          id: workspaceId,
        })
      );
    }

    if (workspaceId) {
    }
  }, [workspaceId]);
  if (store.leadlistLoading) {
    dispatch(
      getLeadlist({
        sort,
        sortColumn,
        q: searchTerm,
        page: currentPage,
        perPage: rowsPerPage,
        id: workspaceId,
      })
    );
  }

  // ** Function in get data on page change
  const handlePagination = (page) => {
    dispatch(
      getLeadlist({
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
    dispatch(storeCurrentPageLeadlist({ currentPage: newPage }));
  };

  // ** Function in get data on rows per page
  const handlePerPage = (e) => {
    const value = parseInt(e.currentTarget.value);
    dispatch(
      getLeadlist({
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
    dispatch(storeCurrentPageLeadlist({ currentPage: 1 }));
    dispatch(storeRowsPerPageLeadlist({ rowsPerPage: value }));
  };

  // ** Function in get data on search query change
  const handleFilter = (val) => {
    console.log("search q", val);
    setSearchTerm(val);
    dispatch(
      getLeadlist({
        sort,
        q: val,
        sortColumn,
        page: currentPage,
        perPage: rowsPerPage,
        id: workspaceId,
      })
    );
  };

  // ** Custom Pagination
  const CustomPagination = () => {
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
  const dataToRender = () => {
    const filters = {
      q: searchTerm,
    };

    const isFiltered = Object.keys(filters).some(function (k) {
      return filters[k].length > 0;
    });

    if (store?.leadlist?.length > 0) {
      const users = store.leadlist?.map((user) => {
        const tempUser = { ...user };
        tempUser.handleEdit = (id) => {
          const editUser = store.leadlist.filter((user) => user.id === id);
          if (editUser.length) {
            setEditUser(editUser[0]);
            toggleSidebar();
          }
        };

        tempUser.handleDelete = async (id, joinedAt) => {
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
            dispatch(deleteLeadlistWorkspace({ id }));
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
    } else if (store.leadlist.length === 0 && isFiltered) {
      return [];
    } else {
      return store.leadlist.slice(0, rowsPerPage);
    }
  };

  const handleSort = (column, sortDirection) => {
    console.log(column, sortDirection);
    setSort(sortDirection);
    setSortColumn(column.sortField);
    dispatch(
      getLeadlist({
        sort: sortDirection,
        sortColumn: column.sortField,
        q: searchTerm,
        page: currentPage,
        perPage: rowsPerPage,
        id: workspaceId,
      })
    );
  };

  if (store.leadlistLoading) {
    return (
      <Fragment>
        <div className="vh-100">
          <Skeleton height={"15%"} />
          <Skeleton height={"7%"} count={9} />
        </div>
      </Fragment>
    );
  }

  const downloadXLS = () => {
    const ws = XLSX.utils.json_to_sheet([csvData]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "People");
    XLSX.writeFile(wb, "leadlistData.xlsx");
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  return (
    <Fragment>
      {/* {store.currentWorkspace && (
        <p>Manage workspace: {store.currentWorkspace.name}</p>
      )} */}
      <Modal  size="xl" id="my_modal" style={{width : "1000px !imporatant ", height : "100vh !important"}} isOpen={showModal} toggle={toggleModal}>
        <ModalHeader toggle={() => setShowModal(!showModal)}>
          Lead List
        </ModalHeader>

        <ModalBody>
          <DataTable
            columns={recordColums}
            data={recordData}
          ></DataTable>
        </ModalBody>
      </Modal>
      <Card className="overflow-hidden workspace-list">
        <div className="react-dataTable">
          <DataTable
            noHeader
            subHeader
            sortServer
            pagination
            responsive
            paginationServer
            onRowClicked={handleRowClicked}
            // columns={LeadlistColumns}
            columns={NewTable}
            onSort={handleSort}
            sortIcon={<ChevronDown />}
            className="react-dataTable"
            paginationComponent={CustomPagination}
            data={dataToRender()}
            // actions={getCsvData}
            subHeaderComponent={
              <CustomHeader
                store={store}
                searchTerm={searchTerm}
                rowsPerPage={rowsPerPage}
                handleFilter={handleFilter}
                handlePerPage={handlePerPage}
                toggleSidebar={toggleSidebar}
                toggleSidebarImport={toggleSidebarImport}
                userData={userData}
                setEditUser={setEditUser}
                csvData={csvData}
                getCsvData={getCsvData}
                downloadXLS={downloadXLS}
                handleDownloadCsv={handleDownloadCsv}
                handleDownloadExp={handleDownloadExp}
              />
            }
          />
        </div>
      </Card>

      {sidebarOpen && (
        <LeadlistSidebar
          open={sidebarOpen}
          refreshTable={refreshTable}
          toggleSidebar={toggleSidebar}
          workspaceId={workspaceId}
          user={editUser}
        />
      )}
      {sidebarOpenImport && (
        <CsvSidebar
          open={sidebarOpenImport}
          refreshTable={refreshTable}
          toggleSidebar={toggleSidebarImport}
          workspace={workspaceId}
        />
      )}
    </Fragment>
  );
};
export default LeadList;