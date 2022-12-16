import { useMemo } from "react";
import { Input, Row, Col, Button, Badge } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { setCallFilterValue } from "../../../redux/profiles";
import Select from "react-select";
import { selectThemeColors } from "@utils";

export default ({ handlePerPage, rowsPerPage, handleSearch, searchTerm, toggleSidebar }) => {
    const statuses = useSelector((state) => state.statuses.statuses);
    const callFilterValue = useSelector((state) => state.profiles.callFilterValue);

    const statusOptions = useMemo(() => {
        return statuses.map((p) => ({ value: p.id, label: p.name, count: p.calls_count }));
    }, [statuses]);

    const dispatch = useDispatch();

    const formatOptionLabel = ({ label, count }) => (
        <div className="d-flex justify-content-between">
          <div>{label}</div>
          <Badge color="light-primary">{count}</Badge>
        </div>
      );

    return (
        <div className="w-100 me-1 ms-50 mt-2 mb-75">
            <Row className="p-1">
                <Col xl="6" className="d-flex align-items-center p-0 justify-content-start">
                    <div className="me-1">
                        <Input
                            className="dataTable-filter"
                            type="text"
                            placeholder="Type to find"
                            value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </div>
                    <div className="d-flex align-items-center w-50">
                        <label className="me-1">Statuses: </label>
                        <Select
                            className="react-select w-100"
                            type="select"
                            value={callFilterValue}
                            theme={selectThemeColors}
                            formatOptionLabel={formatOptionLabel}
                            classNamePrefix="select"
                            placeholder="Select"
                            options={[{ label: "None", value: null }, ...statusOptions]}
                            onChange={(value) => dispatch(setCallFilterValue(value))}
                            menuPortalTarget={document.body}
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
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                        </Input>
                    </div>
                    <div className="d-flex align-items-center table-header-actions">
                        <Button
                            className="add-new-user"
                            onClick={toggleSidebar}
                            color="primary"
                        >
                            New Call
                        </Button>
                    </div>
                </Col>
            </Row>
        </div>
    );
};
