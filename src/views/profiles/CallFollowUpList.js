/* eslint-disable */
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import ReactPaginate from "react-paginate";
import DataTable from "react-data-table-component";
import { ChevronDown } from "react-feather";
import Skeleton from "react-loading-skeleton";
import { Row, Col, Button } from "reactstrap";

// ** Reactstrap Imports
import { Card, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, CardHeader, CardTitle, Badge } from "reactstrap";
import { Edit, Eye, Trash, MoreVertical } from "react-feather";
import moment from "moment";

//Redux
import { useDispatch, useSelector } from "react-redux";
import { getCallFollowUpsByProfileId, setReloadTable, deleteCallFollowUp } from "../../redux/profiles";
import FollowUpSidebar from "../followups/components/FollowUpSidebar";
import FollowUpViewSidebar from "./components/FollowUpViewSidebar";
import ViewCalendarModal from "./components/ViewCalendarModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faCalendarCheck } from "@fortawesome/free-solid-svg-icons";


export default () =>
{
    // ** States
    const followUpSidebarRef = useRef(null);
    const followViewUpSidebarRef = useRef(null);
    const ViewCalendarModalRef = useRef(null);
    const dispatch = useDispatch();
    const params = useParams();
    const reloadTable = useSelector((state) => state.profiles.reloadTable);
    const perPage = useSelector((state) => state.layout.pagination.per_page);

    const [sort, setSort] = useState("desc");
    const [currentPage, setCurrentPage] = useState(1);
    const [sortColumn, setSortColumn] = useState("created_at");
    const [rowsPerPage, setRowsPerPage] = useState(perPage);
    const [followups, setFollowUps] = useState([]);
    const [pageCount, setPageCount] = useState(1);

    useEffect(() =>
    {
        loadFollowUps({
            page: 1,
        });
    }, []);

    useEffect(() =>
    {
        if (reloadTable) {
            dispatch(setReloadTable(false));
            loadFollowUps({
                page: currentPage,
            });
        }
    }, [reloadTable]);

    const loadFollowUps = (options) =>
    {
        let queryParams = {
            records_per_page: rowsPerPage,
            page: currentPage,
            sort_by: sortColumn,
            sort,
            ...options,
        };

        dispatch(
            getCallFollowUpsByProfileId({
                id: params.id,
                params: queryParams,
            })
        ).then(({ payload }) =>
        {
            if (payload.data !== null) {
                setFollowUps(payload.data.data);
                setPageCount(payload.data.last_page);
            }
        });

        setCurrentPage(options.page);
    };

    const handleSort = (column, sortDirection) =>
    {
        setSort(sortDirection);
        setSortColumn(column.sortField);
        loadFollowUps({
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
        loadFollowUps({
            page: 1,
            records_per_page: value,
        });
    };

    const columns = [
        {
            name: "Date",
            sortable: true,
            minWidth: "50px",
            sortField: "created_at",
            selector: (row) => row.created_at,
            cell: (row) => (
                <div className="d-flex justify-content-left align-items-center">
                    <div className="d-flex flex-column">
                        <span className="fw-bolder">{row.created_at}</span>
                    </div>
                </div>
            ),
        },
        {
            name: "Meeting At",
            sortable: false,
            minWidth: "50px",
            cell: (row) =>
                <div className="d-flex justify-content-left align-items-center">
                    <span className="me-2">{row.meeting_at}</span>
                    <FontAwesomeIcon className="text-info cursor-pointer" icon={faCalendarCheck} fontSize={20} onClick={() => ViewCalendarModalRef.current.open(row)} />
                </div>,
        },
        {
            name: "Notes",
            sortable: false,
            minWidth: "150px",
            cell: (row) => row.notes,
        },
        {
            name: "Location",
            sortable: false,
            sortField: "location",
            minWidth: "250px",
            cell: (row) => row.location,
        },

        {
            name: "Actions",
            sortable: false,
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
                            <DropdownMenu container={"body"} end>
                                <DropdownItem onClick={() => followViewUpSidebarRef.current.handleShow(row)} >
                                    <Eye size={15} />
                                    <span className="align-middle ms-50">View</span>
                                </DropdownItem>
                                <DropdownItem onClick={() => followUpSidebarRef.current.handleShow(row)} >
                                    <Edit size={15} />
                                    <span className="align-middle ms-50">Edit</span>
                                </DropdownItem>
                                <DropdownItem onClick={() => dispatch(deleteCallFollowUp(row.id))}>
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
                onPageChange={({ selected }) => loadFollowUps({ page: selected })}
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

    if (!followups) {
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
                    <CardTitle tag="h4">Follow Ups</CardTitle>
                    <Button onClick={() => followUpSidebarRef.current.handleShow()}>
                        Add FollowUp
                    </Button>
                </CardHeader>

                <div className="react-dataTable">
                    <DataTable
                        noHeader
                        sortServer
                        pagination
                        responsive
                        paginationServer
                        defaultSortField={"created_at"}
                        columns={columns}
                        onSort={handleSort}
                        defaultSortAsc={false}
                        style={{ width: "80vw" }}
                        sortIcon={<ChevronDown />}
                        className="react-dataTable"
                        paginationComponent={CustomPagination}
                        data={followups}
                    />
                </div>
            </Card>

            <FollowUpSidebar ref={followUpSidebarRef} />
            <FollowUpViewSidebar ref={followViewUpSidebarRef} />
            <ViewCalendarModal ref={ViewCalendarModalRef} />
        </>
    );
};
