import {React, useRef} from "react";


import {
  Row,
  Col,
  Input,
  Button,
} from "reactstrap";

const CustomHeader = ({
    //   store,
    toggleSidebar,
    handlePerPage,
    rowsPerPage,
    handleFilter,
    searchTerm,
    leadListData,
    setEditLeadList,
    handleDownloadCsv,
  }) => {
    const ref = useRef();
    return (
      <div className="invoice-list-table-header w-100 me-1 ms-50 mt-2 mb-75">
        <Row>
          <Col xl="6" className="d-flex align-items-center p-0">
            <div className="d-flex align-items-center mb-sm-0 mb-1 me-1">
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
                <option value="2">2</option>
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
              </Input>
            </div>
  
            {leadListData.user.role === "company" && (
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
                  className="add-new-leadlist"
                  color="primary"
                  onClick={() => {
                    setEditLeadList(null);
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

export default CustomHeader;