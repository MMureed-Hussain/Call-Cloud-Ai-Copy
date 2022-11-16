import { useState } from "react";
import ReactPaginate from "react-paginate";
import DataTable from "react-data-table-component";
import { ChevronDown } from "react-feather";
// ** Reactstrap Imports
import { Card } from "reactstrap";
import CustomHeader from "./components/CustomHeader";

export default () => {
    // ** States
    const [sort, setSort] = useState("desc");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [sortColumn, setSortColumn] = useState("id");
    const [rowsPerPage, setRowsPerPage] = useState(25);

    const columns = [
        {
            name: "Phone number",
            sortable: true,
            minWidth: "172px",
            sortField: "phone",
            selector: (row) => row.phone,
            cell: (row) => (
                <div className="d-flex justify-content-left align-items-center">
                    <div className="d-flex flex-column">
                        <span className="fw-bolder">{row.phone}</span>
                    </div>
                </div>
            ),
        },
    ];

    const handlePagination = (page) => {
        //todo add logic
    }

    const handleSort = (column, sortDirection) => {
        console.log(column, sortDirection);
        //todo add logic
    };

    // ** Function in get data on rows per page
    const handlePerPage = (e) => {
        const value = parseInt(e.currentTarget.value);
        console.log(value)
    };

    // ** Function in get data on search query change
    const handleFilter = (val) => {
        setSearchTerm(val);
    };

    // ** Custom Pagination
    const CustomPagination = () => {
        const count = Number(Math.ceil(0 / rowsPerPage));
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
                    columns={columns}
                    onSort={handleSort}
                    sortIcon={<ChevronDown />}
                    className="react-dataTable"
                    paginationComponent={CustomPagination}
                    data={[]}
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