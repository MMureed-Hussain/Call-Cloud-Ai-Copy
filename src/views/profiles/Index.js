/* eslint-disable */
import { useState } from "react";
import ReactPaginate from "react-paginate";
import DataTable from "react-data-table-component";
import { ChevronDown } from "react-feather";
import Skeleton from "react-loading-skeleton";
// ** Reactstrap Imports
import { Card, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import CustomHeader from "./components/CustomHeader";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProfiles } from "../../redux/profiles";
import { Edit, Eye, Trash, MoreVertical } from 'react-feather'
import { Link } from "react-router-dom";

export default () => {
    // ** States
    const [sort, setSort] = useState("desc");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [sortColumn, setSortColumn] = useState("id");
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const dispatch = useDispatch();
    //selectors
    const currentWorkspace = useSelector((state) => state.workspaces.currentWorkspace);
    const profiles = useSelector((state) => state.profiles.profiles);
    const loading = useSelector((state) => state.profiles.loadingProfiles);
    const pageCount = useSelector((state) => state.profiles.pageCount);

    const loadProfiles = (page) => {
        dispatch(getProfiles({
            records_per_page: rowsPerPage,
            page,
            workspace_id: currentWorkspace.id,
            sort_by: sortColumn,
            sort
        }));
        setCurrentPage(page);
    }

    useEffect(() => {
        if (currentWorkspace) {
            loadProfiles(1)
        }
    }, [currentWorkspace])

    const columns = [
        {
            name: "Name",
            sortable: true,
            minWidth: "172px",
            sortField: "name",
            selector: (row) => row.name,
            cell: (row) => (
                <div className="d-flex justify-content-left align-items-center">
                    <div className="d-flex flex-column">
                        <span className="fw-bolder">{row.name}</span>
                    </div>
                </div>
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
            name: 'Actions',
            allowOverflow: true,
            cell: (row) => {
                return (
                    <div className='d-flex'>
                        <UncontrolledDropdown>
                            <DropdownToggle className='pe-1' tag='span'>
                                <MoreVertical size={15} />
                            </DropdownToggle>
                            <DropdownMenu end>
                                <Link to={`/profiles/${row.id}`}>
                                    <DropdownItem>
                                        <Eye size={15} />
                                        <span className='align-middle ms-50'>View</span>
                                    </DropdownItem>
                                </Link>
                                <DropdownItem>
                                    <Edit size={15} />
                                    <span className='align-middle ms-50'>Edit</span>
                                </DropdownItem>
                                <DropdownItem>
                                    <Trash size={15} />
                                    <span className='align-middle ms-50'>Delete</span>
                                </DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                    </div>
                )
            }
        }
    ];

    const handleSort = (column, sortDirection) => {
        setSort(state => sortDirection);
        setSortColumn(state => column.sortField);
        loadProfiles(1);
    };

    // ** Function in get data on rows per page
    const handlePerPage = (e) => {
        const value = parseInt(e.currentTarget.value);
        setRowsPerPage(state => value);
        loadProfiles(1);
    };

    // ** Function in get data on search query change
    const handleFilter = (val) => {
        setSearchTerm(val);
        loadProfiles(1);//todo add 
    };

    // ** Custom Pagination
    const CustomPagination = () => {
        return (
            <ReactPaginate
                previousLabel={""}
                nextLabel={""}
                pageCount={pageCount || 1}
                activeClassName="active"
                forcePage={currentPage !== 0 ? currentPage - 1 : 0}
                onPageChange={({ selected }) => loadProfiles(selected)}
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
        <Card className="overflow-hidden workspace-list">
            <div className="react-dataTable">
                <DataTable
                    noHeader
                    subHeader
                    sortServer
                    pagination
                    responsive
                    paginationServer
                    defaultSortField={'id'}
                    columns={columns}
                    onSort={handleSort}
                    defaultSortAsc={false}
                    sortIcon={<ChevronDown />}
                    className="react-dataTable"
                    paginationComponent={CustomPagination}
                    data={profiles}
                    subHeaderComponent={
                        <CustomHeader
                            searchTerm={searchTerm}
                            rowsPerPage={rowsPerPage}
                            handleFilter={handleFilter}
                            handlePerPage={handlePerPage}
                        />
                    }
                />
            </div>
        </Card>
    );
}