/* eslint-disable */
import { Navigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import Skeleton from "react-loading-skeleton";
import moment from "moment";
import toast from "react-hot-toast";
import Select from "react-select";
import PhoneInput from "react-phone-input-2";
// ** Reactstrap Imports
import {
  Row,
  Col,
  Button,
  Card,
  CardHeader,
  CardTitle,
  Badge,
  Table,
  Input,
  CardBody,
} from "reactstrap";

//Redux
import { useDispatch, useSelector } from "react-redux";
import {
  getCallsList,
  leadProfileStatusList,
  setErrors,
  getRecordingByWorkspace,
} from "../../redux/calls";
import CallPlayer from "../profiles/components/CallPlayer";
import UserInfo from "../profiles/components/UserInfo";

export default () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const per_page = useSelector((state) => state.layout.pagination.per_page);
  const calls = useSelector((state) => state.calls.calls);
  const recordings = useSelector((state) => state.calls.recordings);
  const currentWorkspace = useSelector(
    (state) => state.workspaces.currentWorkspace
  );
  const [profileStatus, setProfileStatus] = useState(null);
  const [callStatus, setCallStatus] = useState(null);
  const [callProfiles, setCallProfiles] = useState(null);
  const [data, setData] = useState({
    sort: "desc",
    orderby: "created_at",
    per_page: per_page,
    search: "",
  });

  useEffect(() => {
    if (currentWorkspace) {
      dispatch(leadProfileStatusList({ id: currentWorkspace.id })).then(
        ({ payload }) => {
          if (payload && payload.lead_statuses) {
            setProfileStatus(payload.lead_statuses);
          }

          if (payload && payload.lead_statuses) {
            setCallStatus(payload.call_statuses);
          }

          if (payload && payload.call_profiles) {
            setCallProfiles(payload.call_profiles);
          }
        }
      );

      const privateChannel = window.Pusher.subscribe(
        `private-workspaces.${currentWorkspace.id}`
      );
      privateChannel.bind("WorkspaceCallRecordingStatus", (res) => {
        dispatch(getRecordingByWorkspace({ id: currentWorkspace.id }));
        if (res.status == "SUBMITTED") {
          loadData();
        }
      });
    }
  }, [currentWorkspace]);

  useEffect(() => {
    loadData();
  }, [data, currentWorkspace]);

  const loadData = (options) => {
    if (currentWorkspace) {
      let queryParams = {
        workspace_id: currentWorkspace.id,
        ...data,
        ...options,
      };
      dispatch(getCallsList(queryParams));
    }
  };

  const perPageOptions = [
    { value: 15, label: 15 },
    { value: 25, label: 25 },
    { value: 50, label: 50 },
    { value: 100, label: 100 },
  ];

  const handleSelectChange = (e, name) => {
    let target = {
      name,
      type: "input",
      value: e.value,
    };

    handleChange({ target });
  };

  const handleChange = (e) => {
    const key = e.target.name;
    const value =
      e.target.type == "checkbox" ? e.target.checked : e.target.value;

    setData((data) => ({
      ...data,
      [key]: value,
    }));
  };

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!calls.data) {
    return (
      <div className="vh-100">
        <Skeleton height={"15%"} />
        <Skeleton height={"7%"} count={9} />
      </div>
    );
  }

  const paginationLine = {
    height: "1px",
    width: "98%",
    position: "absolute",
    top: "39px",
    marginLeft: "12px",
    border: "2px solid red",
  };

  return (
    <>
      {Boolean(recordings.length) && (
        <Card>
          <CardHeader className="py-1">
            <CardTitle tag="h4"> Call recording status</CardTitle>
          </CardHeader>
          <div className="react-dataTable">
            <Table responsive>
              <tbody>
                {recordings.map((row, ind) => (
                  <tr key={ind} className="text-center">
                    <td>
                      <UserInfo
                        name={`${row.sender.first_name} ${row.sender.last_name}`}
                        email={row.sender.email}
                      />
                    </td>
                    <td>
                      {row.status == "STARTED" && (
                        <Badge color="success" className="bg-light-success">
                          {row.status}
                        </Badge>
                      )}
                      {row.status == "PAUSED" && (
                        <Badge color="info" className="bg-light-info">
                          {row.status}
                        </Badge>
                      )}
                      {row.status == "RESUMED" && (
                        <Badge color="primary" className="bg-light-primary">
                          {row.status}
                        </Badge>
                      )}
                      {(row.status == "NOT_SUBMITTED" ||
                        row.status == "SUBMITTED" ||
                        row.status == "STOPPED") && (
                        <Badge color="danger" className="bg-light-danger">
                          {row.status}
                        </Badge>
                      )}
                    </td>
                    <td>{row.callprofile && row.callprofile.name}</td>
                    <td>
                      {row.callprofile && (
                        <PhoneInput
                          className="phone-placeholder"
                          country={"us"}
                          value={row.callprofile.phone}
                          disableSearchIcon
                          disabled
                          placeholder="1 234 567 8900"
                        />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card>
      )}
      <Card>
        <CardHeader className="py-1">
          <CardTitle tag="h4">Call Overview</CardTitle>
        </CardHeader>
        <div className="p-1">
          <Row>
            <Col lg="10">
              <Row>
                <Col lg="3">
                  <Select
                    classNamePrefix="select"
                    options={perPageOptions}
                    onChange={(e) => handleSelectChange(e, "per_page")}
                    placeholder="Per Page"
                    className="mb-2"
                  />
                </Col>
                {callStatus && (
                  <Col lg="3">
                    <Select
                      classNamePrefix="select"
                      onChange={(e) => handleSelectChange(e, "call_status")}
                      options={[{ value: "", label: "None" }, ...callStatus]}
                      placeholder="Select call status"
                      className="mb-2"
                    />
                  </Col>
                )}

                {callProfiles && (
                  <Col lg="3">
                    <Select
                      classNamePrefix="select"
                      onChange={(e) => handleSelectChange(e, "member")}
                      options={[{ value: "", label: "None" }, ...callProfiles]}
                      placeholder="Select Profiles"
                      className="mb-2"
                    />
                  </Col>
                )}

                {profileStatus && (
                  <Col lg="3">
                    <Select
                      classNamePrefix="select"
                      onChange={(e) => handleSelectChange(e, "lead_status")}
                      options={[{ value: "", label: "None" }, ...profileStatus]}
                      className="mb-2"
                      placeholder="Select profile status"
                    />
                  </Col>
                )}
              </Row>
            </Col>
            <Col lg="2">
              <div className="d-flex align-center flex-wrap gap-4 mb-2">
                <Input
                  name="search"
                  value={data.search}
                  onChange={(e) => handleChange(e)}
                  placeholder="Search..."
                  style={{ maxHeight: "40px" }}
                />
              </div>
            </Col>
          </Row>
        </div>
        <div className="react-dataTable">
          <Table responsive>
            <thead>
              <tr>
                <th>Created By</th>
                <th>Recording</th>
                <th>Status</th>
                <th>Profile</th>
                <th>Phone</th>
                <th>Notes</th>
                <th style={{ whiteSpace: "nowrap" }}>Created at</th>
              </tr>
            </thead>
            <tbody>
              {calls.data &&
                calls.data.map((row, ind) => (
                  <tr key={ind}>
                    <td>
                      <UserInfo
                        name={`${row.created_by.first_name} ${row.created_by.last_name}`}
                        email={row.created_by.email}
                      />
                    </td>
                    <td>
                      <CallPlayer callId={row.id} />
                    </td>
                    <td>
                      <Badge color="primary" className="bg-light-primary">
                        {row.call_status && row.call_status.name.toUpperCase()}
                      </Badge>
                    </td>
                    <td>
                      <div>{row.callprofile && row.callprofile.name}</div>
                      {row.callprofile && row.callprofile.lead_status && (
                        <Badge color="warning" className="bg-light-warning">
                          {row.callprofile.lead_status.name.toUpperCase()}
                        </Badge>
                      )}
                    </td>
                    <td>
                      {row.callprofile && (
                        <PhoneInput
                          className="phone-placeholder"
                          country={"us"}
                          value={row.callprofile.phone}
                          disableSearchIcon
                          disabled
                          placeholder="1 234 567 8900"
                        />
                      )}
                    </td>
                    <td style={{ maxWidth: "300px" }}>{row.notes}</td>
                    <td>{moment(row.created_at).fromNow()}</td>
                  </tr>
                ))}

              {calls && !Boolean(calls.data.length) && (
                <tr>
                  <td colSpan={12} className="text-center">
                    No data Found!
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>

        <Row style={{ position: "relative" }}>
          {calls.last_page < 2 ? <div style={{ ...paginationLine }}></div> : ""}
          <Col className="small">
            {calls.data && (
              <div className="my-2 ms-1">
                {" "}
                Showing {calls.from} to {calls.to} of {calls.total} entries
              </div>
            )}
          </Col>
          <Col>
            {calls && Boolean(calls.data.length) && (
              <ReactPaginate
                previousLabel={""}
                nextLabel={""}
                pageCount={calls && calls.last_page !== 0 ? calls.last_page : 0}
                activeClassName="active"
                onPageChange={({ selected }) =>
                  loadData({ page: selected + 1 })
                }
                pageClassName={"page-item"}
                nextLinkClassName={"page-link"}
                nextClassName={"page-item next"}
                previousClassName={"page-item prev"}
                previousLinkClassName={"page-link"}
                pageLinkClassName={"page-link"}
                containerClassName={
                  "pagination react-paginate justify-content-end my-5 pe-1"
                }
              />
            )}
          </Col>
        </Row>
      </Card>
    </>
  );
};
