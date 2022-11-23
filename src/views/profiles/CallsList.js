/* eslint-disable */
import { useState } from "react";
import ReactPaginate from "react-paginate";
import DataTable from "react-data-table-component";
import { ChevronDown } from "react-feather";
import Skeleton from "react-loading-skeleton";
// ** Reactstrap Imports
import { Card, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Badge, CardHeader, CardTitle, Button } from "reactstrap";
import CallListHeader from "./components/CallListHeader";
import { useDispatch, useSelector } from "react-redux";
import { Edit, Eye, Trash, MoreVertical,Play } from 'react-feather'
import { Link } from "react-router-dom";
import CallSidebar from "./calls/CallSidebar";
import moment from "moment";

export default () => {
    // ** States
    const [sort, setSort] = useState("desc");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [sortColumn, setSortColumn] = useState("id");
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [loadingFile, setLoadingFile] = useState(false);
    const [fileInLoading, setFileInLoading] = useState("");
    const dispatch = useDispatch();
    //selectors
    const calls = useSelector((state) => state.profiles.selectedProfileCalls);

    const columns = [
        {
            name: "Id",
            sortable: true,
            minWidth: "172px",
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
            name: "Voice",
            sortable: false,
            minWidth: "172px",
            cell: (row) => {
                return (<div className='rounded-circle overflow-hidden'>
                    <Button.Ripple className='btn-icon rounded-circle' color='primary'>
                        <Play size={14} />
                    </Button.Ripple>
                </div>
                // :
                //     <div className='rounded-circle overflow-hidden'>
                //         <Button.Ripple className='btn-icon rounded-circle' color='warning' onClick={onPause}>
                //             <Pause size={16} />
                //         </Button.Ripple>
                //     </div>
                    )
            },
        },
        {
            name: "Created By",
            sortable: true,
            minWidth: "172px",
            selector: (row) => row.created_by,
            cell: (row) => row.created_by.first_name,
        },
        {
            name: "Created At",
            sortable: true,
            minWidth: "172px",
            selector: (row) => row.created_at,
            cell: (row) => moment(row.created_at).format("YYYY-MM-DD HH:mm:ss")
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

    };

    // ** Function in get data on rows per page
    const handlePerPage = (e) => {
        const value = parseInt(e.currentTarget.value);
        setRowsPerPage(state => value);

    };

    // ** Function in get data on search query change
    const handleFilter = (val) => {
        setSearchTerm(val);
        //todo add 
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };


    // ** Custom Pagination
    const CustomPagination = () => {
        return (
            <ReactPaginate
                previousLabel={""}
                nextLabel={""}
                pageCount={1}
                activeClassName="active"
                forcePage={currentPage !== 0 ? currentPage - 1 : 0}
                onPageChange={({ selected }) => console.log(selected)}
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

    if (!calls) {
        return (
            <div className="vh-100">
                <Skeleton height={"15%"} />
                <Skeleton height={"7%"} count={9} />
            </div>
        );
    }

    return (
        <>
            <Card className="overflow-hidden workspace-list">
                <CardHeader className='py-1'>
                    <CardTitle tag='h4'>Calls</CardTitle>
                </CardHeader>
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
                        data={calls}
                        subHeaderComponent={
                            <CallListHeader
                                searchTerm={searchTerm}
                                rowsPerPage={rowsPerPage}
                                handleFilter={handleFilter}
                                handlePerPage={handlePerPage}
                                toggleSidebar={toggleSidebar}
                            />
                        }
                    />
                </div>
            </Card>
            {sidebarOpen && (
                <CallSidebar
                    open={sidebarOpen}
                    toggleSidebar={toggleSidebar}
                />
            )}
        </>
    );
}