// import { useMemo } from "react";
import { Input, Row, Col, Button, Badge } from "reactstrap";

export default ({
  handlePerPage,
  rowsPerPage,
  handleSearch,
  searchTerm,
  toggleSidebar,
}) => {

  return (
    <div className="invoice-list-table-header w-100 me-1 ms-50 mt-2 mb-75">
      <Row className="p-1 pt-0">
        <Col
          xl="7"
          className="d-flex  flex-md-row flex-lg-row flex-xl-row flex-column justify-content-start mt-0"
        >
          <div className="me-1 w-50 mt-xl-1 mt-l-1 mt-sm-0 mt-md-1 mt-1">
            <Input
              className="dataTable-filter w-90"
              type="text"
              placeholder="Type to find"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </Col>
        <Col
          xl="5"
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
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </Input>
          </div>
          <div className="d-flex align-items-center table-header-actions mt-xl-0  mt-l-0 mt-sm-0 mt-m-0 mt-1">
            <Button
              className="add-new-user"
              onClick={toggleSidebar}
              color="primary"
            >
              Record Call
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  );
};
