import React, { useState, useEffect, useMemo } from "react";

import { Input, Row, Col, Button } from "reactstrap";
import { getPipelines } from "../../../redux/pipelines";
import { Link, useParams } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { selectThemeColors } from "@utils";

export default ({ handlePerPage, rowsPerPage, handleFilter, searchTerm }) => {
  const [pipeline, setPipeline] = useState(null);
  const pipelines = useSelector((state) => state.pipelines.pipelines);

  const params = useParams();
  const dispatch = useDispatch();

  const pipelinesOptions = useMemo(() => {
    return pipelines.map((p) => ({ value: p.id, label: p.name }));
  }, [pipelines]);

  const currentWorkspace = useSelector(
    (state) => state.workspaces.currentWorkspace
  );

  useEffect(() => {
    if (params.id) {
      dispatch(
        getProfile({
          params: { include_calls: "false" },
          id: params.id,
        })
      ).then((res) => {
        if (res.payload.data) {
          const { data } = res.payload;
          if (data.pipeline) {
            setPipeline({ value: data.pipeline.id, label: data.pipeline.name });
          }
        }
      });
    }
    dispatch(getPipelines(currentWorkspace.id));
  }, [params.id]);

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
          <div className="d-flex align-items-center mx-50">
            <label htmlFor="rows-per-page">Pipelines</label>
            <Select
              className="mx-50"
              type="select"
              id="rows-per-page"
              value={pipeline}
              theme={selectThemeColors}
              classNamePrefix="select"
              placeholder="Select"
              options={pipelinesOptions}
              onChange={setPipeline}
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
            <Link to={"/profiles/create"}>
              <Button className="add-new-user" color="primary">
                Add New Profile
              </Button>
            </Link>
          </div>
        </Col>
      </Row>
    </div>
  );
};
