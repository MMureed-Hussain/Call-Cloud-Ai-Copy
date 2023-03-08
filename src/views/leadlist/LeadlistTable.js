// ** React Imports
import { Fragment, useEffect, useState } from "react";

// ** Invoice List Sidebar
import LeadlistSidebar from "./LeadlistSidebar";
import { LeadListTableColumn } from "./LeadListTableColumn";
import CustomHeader from "./CustomHeader";

// ** Table Columns
// ** Confirm box
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "@styles/base/plugins/extensions/ext-component-sweet-alerts.scss";
const MySwal = withReactContent(Swal);

import Skeleton from "react-loading-skeleton";
import { isEmpty } from "lodash";
// ** Store & Actions
import {
  getLeadlist,
  getRecord,
  storeCurrentPageLeadlist,
  storeRowsPerPageLeadlist,
  getCsv,
  deleteLeadListWorkspace,
} from "@store/workspaces";
import { useDispatch, useSelector } from "react-redux";

// ** Third Party Components
import Select from "react-select";
import ReactPaginate from "react-paginate";
import DataTable from "react-data-table-component";
import { ChevronDown } from "react-feather";

// ** Utils
// eslint-disable-next-line no-unused-vars

// ** Reactstrap Imports
import { Card, Modal, ModalHeader, ModalBody } from "reactstrap";

// ** Styles
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/libs/tables/react-dataTable-component.scss";

const LeadList = ({ workspaceId }) => {
  // ** Store Vars
  const dispatch = useDispatch();
  const store = useSelector((state) => state.workspaces);
  const leadListData = useSelector((state) => state.auth);
  const csvData = useSelector((state) => state.workspaces?.csv);
  // ** States
  const [sort, setSort] = useState("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(store.currentPageUser);
  const [sortColumn, setSortColumn] = useState("id");
  const [rowsPerPage, setRowsPerPage] = useState(store.rowsPerPageUser);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarOpenImport, setSidebarOpenImport] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [record, setRecord] = useState({});

  const [editLeadlist, setEditLeadList] = useState(null);
  const [recordColums, setRecordColmns] = useState([]);
  const [recordData, setRecordData] = useState([]);

  const toggleSidebarImport = () => {
    setSidebarOpenImport(!sidebarOpenImport);
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const fetchLeadLists = () => {
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

  const refreshTable = () => {
    fetchLeadLists();
  };

  const handleRowClicked = (row) => {
    toggleModal();
    dispatch(getRecord(row.id)).then((result) => {
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
    tempLink.href = `${process.env.REACT_APP_API_ENDPOINT}/api/leadlists/dummycsv`;
    tempLink.download = `dummycsv`;
    tempLink.click();
  };

  const handleDownloadExp = () => {
    const tempLink = document.createElement("a");
    tempLink.href = `${process.env.REACT_APP_API_ENDPOINT}/api/leadlist/export/${workspaceId}/`;
    tempLink.download = `dummycsv`;
    tempLink.click();
  };

  // ** Function in get data on page change
  const handlePagination = (page) => {
    setCurrentPage(page.selected + 1);
    dispatch(storeCurrentPageLeadlist({ currentPage }));
  };

  // ** Function in get data on rows per page
  const handlePerPage = (e) => {
    const value = parseInt(e.currentTarget.value);
    setCurrentPage(1);
    setRowsPerPage(value);
    dispatch(storeCurrentPageLeadlist({ currentPage: 1 }));
    dispatch(storeRowsPerPageLeadlist({ rowsPerPage: value }));
  };

  // ** Function in get data on search query change
  const handleFilter = (val) => {
    setSearchTerm(val);
  };

  // ** Custom Pagination
  const CustomPagination = () => {
    const count = Number(Math.ceil(store.totalLeadlist / rowsPerPage));
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

    if (store.leadlist.length > 0) {
      const leadlist = store.leadlist.map((leadlist) => {
        const tempUser = { ...leadlist };
        tempUser.handleEdit = (id) => {
          const editLeadlist = store.leadlist.filter(
            (leadlist) => leadlist.id === id
          );
          if (editLeadlist.length) {
            setEditLeadList(editLeadlist[0]);
            toggleSidebar();
          }
        };
        tempUser.handleDelete = async (id) => {
          // prettier-ignore
          const text = "Are you sure you would like to remove this leadlist?";
          // prettier-ignore
          const confirmButtonText = "Yes, remove it!";

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
            dispatch(deleteLeadListWorkspace({ id, workspaceId }));
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

      return leadlist;
    } else if (store.leadlist.length === 0 && isFiltered) {
      return [];
    } else {
      return store.leadlist.slice(0, rowsPerPage);
    }
  };

  const handleSort = (column, sortDirection) => {
    setSort(sortDirection);
    setSortColumn(column.sortField);
  };

  const downloadXLS = () => {
    const ws = XLSX.utils.json_to_sheet([csvData]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "People");
    XLSX.writeFile(wb, "leadlistData.xlsx");
  };

  useEffect(() => {
    if (!isEmpty(record)) {
      const localCols = [];
      let localData = [];
      Object.values(record.headers).map((entry) => {
        if (entry.header.includes("website")) {
          localCols.push({
            name: entry.external_header,
            sortable: true,
            minWidth: "172px",
            selector: (row) => {
              return row[entry.header];
            },
            cell: (row) => {
              return (
                <a href={`https://${row[entry.header]}`} target="_blank">
                  {row[entry.header]}
                </a>
              );
            },
          });
        } else localCols.push({
            name: entry.external_header,
            sortable: true,
            minWidth: "172px",
            selector: (row) => {
              return row[entry.header];
            },
            cell: (row) => {
              return row[entry.header];
            },
          });
      });

      localData = [...record.rows];
      setRecordColmns(localCols);
      setRecordData(localData);
    }
  }, [record]);

  useEffect(() => {
    if (workspaceId) {
      fetchLeadLists();
    }
  }, [workspaceId, sort, sortColumn, searchTerm, currentPage, rowsPerPage]);

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

  return (
    <Fragment>
      <Modal
        size="xl"
        id="my_modal"
        style={{ width: "1000px !imporatant ", height: "100vh !important" }}
        isOpen={showModal}
        toggle={toggleModal}
      >
        <ModalHeader toggle={() => setShowModal(!showModal)}>
          Lead List
        </ModalHeader>

        <ModalBody>
          <DataTable columns={recordColums} data={recordData}></DataTable>
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
            columns={LeadListTableColumn}
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
                toggleSidebarImport={toggleSidebarImport}
                leadListData={leadListData}
                setEditLeadList={setEditLeadList}
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
          leadlist={editLeadlist}
        />
      )}
    </Fragment>
  );
};
export default LeadList;
