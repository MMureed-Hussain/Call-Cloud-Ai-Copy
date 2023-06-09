/* eslint-disable */
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import DataTable from "react-data-table-component";
import { ChevronDown } from "react-feather";
import Skeleton from "react-loading-skeleton";
// ** Reactstrap Imports
import { Card, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, CardHeader, CardTitle, } from "reactstrap";
import CallListHeader from "./components/CallListHeader";
import { useDispatch, useSelector } from "react-redux";
import { Edit, Eye, Trash, MoreVertical } from "react-feather";
import CallSidebar from "./components/CallSidebar";
import moment from "moment";
import CallPlayer from "./components/CallPlayer";
import { getCallsByProfileId, setReloadCallTable, deleteResource, updateCall, } from "../../redux/profiles";
import CallViewSidebar from "./components/CallViewSidebar";
import UserInfo from "./components/UserInfo";
import Select from "react-select";
import { selectThemeColors } from "@utils";
import usePrevious from "../../utility/hooks/usePrevious";
import { sendCallRecordingStatus } from "@store/notifications";

const CallList = ({ profileId, callOptions }) =>
{
    // ** States
    const dispatch = useDispatch();
    const [sort, setSort] = useState("desc");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [sortColumn, setSortColumn] = useState("id");
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [calls, setCalls] = useState([]);
    const [pageCount, setPageCount] = useState(1);
    const [selectedCall, setSelectedCall] = useState(null);
    const [viewSidebarOpen, setViewSidebarOpen] = useState(false);
    const reloadCallTable = useSelector((state) => state.profiles.reloadCallTable);
    const statusFilterValue = useSelector((state) => state.profiles.statusFilterValue);
    const currentWorkspace = useSelector((state) => state.workspaces.currentWorkspace);

    useEffect(() =>
    {
        if (currentWorkspace) {
            loadCalls({ page: 1 });
        }
    }, [currentWorkspace]);

    useEffect(() =>
    {
        if (reloadCallTable) {
            dispatch(setReloadCallTable(false));
            loadCalls({
                page: currentPage,
            });
        }
    }, [reloadCallTable]);

    //Upate the status when call sidebar menu closed unexpected
    useEffect(() =>
    {
        if (!sidebarOpen && currentWorkspace) {
            dispatch(sendCallRecordingStatus({ workspace_id: currentWorkspace.id, status: 'DISCONNECTED', call_profile_id: profileId }));
        }
    }, [sidebarOpen]);


    usePrevious((prevStatusFilterValue) =>
    {
        //change when filter set to None
        if (prevStatusFilterValue?.value && !statusFilterValue.value) {
            loadCalls({
                page: 1,
            });
        }
        //when filter value is changed
        if (statusFilterValue?.value) {
            loadCalls({
                filter: "status",
                filter_value: statusFilterValue.value,
                page: 1,
            });
        }
    }, [statusFilterValue]);


    const loadCalls = (options) =>
    {
        let queryParams = {
            records_per_page: rowsPerPage,
            page: currentPage,
            sort_by: sortColumn,
            sort,
            ...options
        };
        if (statusFilterValue) {
            queryParams = { ...queryParams, filter: "status", filter_value: statusFilterValue.value }
        }
        dispatch(
            getCallsByProfileId({
                id: profileId,
                params: queryParams,
            })
        ).then(({ payload }) =>
        {
            if (payload.data !== null) {
                setCalls(payload.data.data);
                setPageCount(payload.data.last_page);
            }
        });
        setCurrentPage(options.page);
    };

    const onChangeCallStatus = (call, status) =>
    {
        dispatch(updateCall({
            formData: {
                status_id: status,
            },
            id: call.id,
        })
        );
    }

    const handleSelected = (selected) =>
    {

        return callOptions.filter(op => op.value === selected);
    }

    const columns = [
        {
            name: "Id",
            sortable: true,
            minWidth: "50px",
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
            minWidth: "350px",
            cell: (row) =>
            {
                return <CallPlayer callId={row.id} />;
            },
        },
        {
            name: "Status",
            sortable: false,
            minWidth: "172px",
            cell: (row) =>
            {
                return <Select
                    value={handleSelected(row.status_id)}
                    theme={selectThemeColors}
                    classNamePrefix="select"
                    className="react-select"
                    placeholder="Select call status"
                    options={callOptions}
                    menuPortalTarget={document.body}
                    onChange={e => onChangeCallStatus(row, e.value)}
                />
            }
        },
        {
            name: "Created By",
            sortable: true,
            sortField: "created_by",
            minWidth: "250px",
            selector: (row) => row.created_by,
            cell: (row) => (
                <UserInfo
                    name={`${row.created_by.first_name} ${row.created_by.last_name}`}
                    email={row.created_by.email}
                />
            ),
        },
        {
            name: "Created At",
            sortable: true,
            sortField: "created_at",
            minWidth: "172px",
            selector: (row) => row.created_at,
            cell: (row) => moment(row.created_at).format("YYYY-MM-DD HH:mm:ss"),
        },
        {
            name: "Actions",
            allowOverflow: true,
            right: true,
            cell: (row) =>
            {
                return (
                    <div className="d-flex">
                        <UncontrolledDropdown>
                            <DropdownToggle className="pe-1" tag="span">
                                <MoreVertical size={15} />
                            </DropdownToggle>
                            <DropdownMenu container={'body'} end>
                                <DropdownItem
                                    onClick={() =>
                                    {
                                        setSelectedCall(row);
                                        toggleViewSidebar();
                                    }}
                                >
                                    <Eye size={15} />
                                    <span className="align-middle ms-50">View</span>
                                </DropdownItem>
                                <DropdownItem
                                    onClick={() =>
                                    {
                                        setSelectedCall(row);
                                        toggleSidebar();
                                    }}
                                >
                                    <Edit size={15} />
                                    <span className="align-middle ms-50">Edit</span>
                                </DropdownItem>
                                <DropdownItem
                                    onClick={() => dispatch(deleteResource(`${process.env.REACT_APP_API_ENDPOINT}/api/profiles/delete-call/${row.id}`))}
                                >
                                    <Trash size={15} />
                                    <span className="align-middle ms-50">Delete</span>
                                </DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                    </div>
                );
            },
        },
    ];

    const handleSort = (column, sortDirection) =>
    {
        setSort(sortDirection);
        setSortColumn(column.sortField);
        loadCalls({
            page: 1,
            sort_by: column.sortField,
            sort: sortDirection,
        });
    };

    // ** Function in get data on rows per page
    const handlePerPage = (e) =>
    {
        const value = parseInt(e.currentTarget.value);
        setRowsPerPage(value);
        loadCalls({
            page: 1,
            records_per_page: value,
        });
    };

    // ** Function in get data on search query change
    const handleFilter = (val) =>
    {
        setSearchTerm(val);
        //todo add
    };

    const toggleSidebar = () =>
    {
        setSidebarOpen(!sidebarOpen);
    };

    const toggleViewSidebar = () =>
    {
        setViewSidebarOpen(!viewSidebarOpen);
    };


    const handleCallSidebar = () =>
    {
        setSelectedCall(null);
        toggleSidebar();

    }

    // ** Custom Pagination
    const CustomPagination = () =>
    {
        return (
            <ReactPaginate
                previousLabel={""}
                nextLabel={""}
                pageCount={pageCount}
                activeClassName="active"
                forcePage={currentPage !== 0 ? currentPage - 1 : 0}
                onPageChange={({ selected }) => loadCalls({ page: selected })}
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
            <Card>
                <CardHeader className="py-1">
                    <CardTitle tag="h4">Calls</CardTitle>
                </CardHeader>
                <CallListHeader
                    searchTerm={searchTerm}
                    rowsPerPage={rowsPerPage}
                    handleSearch={handleFilter}
                    handlePerPage={handlePerPage}
                    toggleSidebar={handleCallSidebar}
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
                        style={{ width: "80vw" }}
                        sortIcon={<ChevronDown />}
                        className="react-dataTable"
                        paginationComponent={CustomPagination}
                        data={calls}
                    />
                </div>
            </Card>

            {sidebarOpen && (<CallSidebar open={sidebarOpen} call={selectedCall} toggleSidebar={toggleSidebar} callOptions={callOptions} />)}
            {viewSidebarOpen && (<CallViewSidebar open={viewSidebarOpen} call={selectedCall} toggleSidebar={toggleViewSidebar} />)}
        </>
    );
};

export default CallList
