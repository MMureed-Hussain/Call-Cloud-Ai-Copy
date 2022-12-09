/* eslint-disable */
import { useState, useCallback, useMemo } from "react";
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
  Badge,
} from "reactstrap";
import CustomHeader from "./components/CustomHeader";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProfiles, setReloadTable, deleteResource } from "../../redux/profiles";
import { getPipelines } from "../../redux/pipelines";
import { Edit, Eye, Trash, MoreVertical } from "react-feather";
import { Link } from "react-router-dom";
import { debounce } from "lodash";

export default () => {
  // ** States
  const [sort, setSort] = useState("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState("id");
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const dispatch = useDispatch();
  //selectors
  const currentWorkspace = useSelector(
    (state) => state.workspaces.currentWorkspace
  );
  const profiles = useSelector((state) => state.profiles.profiles);
  const loading = useSelector((state) => state.profiles.loadingProfiles);
  const pageCount = useSelector((state) => state.profiles.pageCount);
  const reloadTable = useSelector((state) => state.profiles.reloadTable);
  const filterValue = useSelector((state) => state.profiles.filterValue);

  // ** Factory method to dispatch the api call
  const loadProfiles = (options) => {
    let params = {
      records_per_page: rowsPerPage,
      page: currentPage,
      workspace_id: currentWorkspace?.id,
      sort_by: sortColumn,
      sort,
      ...options,
    };
    if(filterValue){
      params = {...params, filter: "pipeline", filter_value: filterValue.value}
    }
    dispatch(getProfiles(params));
    setCurrentPage(options.page);
  };
  // ** Reload the table when record is deleted
  useEffect(() => {
    if (reloadTable) {
      dispatch(setReloadTable(false));
      loadProfiles({
        page: currentPage
      });
    }
  }, [reloadTable]);
  // ** load data when filter value is changed
  useEffect(() => {
    if (filterValue) {
      loadProfiles({
        filter: "pipeline",
        filter_value: filterValue.value,
        page: 1,
      });
    }
  }, [filterValue]);
  // ** Load the all call profiles for the selected workspace
  useEffect(() => {
    if (currentWorkspace) {
      loadProfiles({ page: 1 });
      dispatch(getPipelines(currentWorkspace.id));
    }
  }, [currentWorkspace]);
  // ** Columns meta for the data table
  const columns = [
    {
      name: "Name",
      sortable: true,
      minWidth: "172px",
      sortField: "name",
      selector: (row) => row.name,
      cell: (row) => (
        <Link to={`/profiles/${row.id}`}>
          <div className="d-flex justify-content-left align-items-center">
            <div className="d-flex flex-column">
              <span className="fw-bolder">{row.name}</span>
            </div>
          </div>
        </Link>
      ),
    },
    {
      name: "Phone number",
      sortable: true,
      minWidth: "172px",
      sortField: "phone",
      selector: (row) => row.phone,
      cell: (row) => row.phone,
    },
    {
      name: "Pipeline",
      sortable: false,
      minWidth: "172px",
      cell: (row) => {
        return row.pipeline ? <Badge color="primary">{row.pipeline.name}</Badge> : "-"
      },
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
              <DropdownMenu container={'body'} end>
                <Link to={`/profiles/${row.id}`}>
                  <DropdownItem>
                    <Eye size={15} />
                    <span className="align-middle ms-50">View</span>
                  </DropdownItem>
                </Link>
                <Link to={`/profiles/${row.id}/edit`}>
                  <DropdownItem>
                    <Edit size={15} />
                    <span className="align-middle ms-50">Edit</span>
                  </DropdownItem>
                </Link>
                <DropdownItem onClick={() => dispatch(deleteResource(`${process.env.REACT_APP_API_ENDPOINT}/api/profiles/${row.id}`))}>
                  <Trash size={15} className="me-50" />
                  <span
                    className="align-middle ms-50"
                  >
                    Delete
                  </span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </div>
        );
      },
    },
  ];
  //Handle sorting
  const handleSort = (column, sortDirection) => {
    setSort(sortDirection);
    setSortColumn(column.sortField);
    loadProfiles({
      page: 1,
      sort: sortDirection,
      sort_by: sortColumn,
    });
  };

  // ** Function in get data on rows per page
  const handlePerPage = (e) => {
    const value = parseInt(e.currentTarget.value);
    setRowsPerPage(value);
    loadProfiles({
      page: 1,
      records_per_page: value,
    });
  };

  // ** Function in get data on search query change
  const debounceLoadData = useCallback(debounce(loadProfiles, 1000), []);
  useEffect(() => {
    if (searchTerm) {
      debounceLoadData({
        page: 1,
        search: searchTerm,
        workspace_id: currentWorkspace.id,
      });
    }
  }, [searchTerm]);

  // ** Custom Pagination
  const CustomPagination = () => {
    return (
      <ReactPaginate
        previousLabel={""}
        nextLabel={""}
        pageCount={pageCount || 1}
        activeClassName="active"
        forcePage={currentPage !== 0 ? currentPage - 1 : 0}
        onPageChange={({ selected }) => loadProfiles({ page: selected })}
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

  if (loading) {
    return (
      <div className="vh-100">
        <Skeleton height={"15%"} />
        <Skeleton height={"7%"} count={9} />
      </div>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CustomHeader
        searchTerm={searchTerm}
        rowsPerPage={rowsPerPage}
        handleSearch={setSearchTerm}
        handlePerPage={handlePerPage}
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
          sortIcon={<ChevronDown />}
          className="react-dataTable"
          paginationComponent={CustomPagination}
          data={profiles}
        />
      </div>
    </Card>
  );
};
