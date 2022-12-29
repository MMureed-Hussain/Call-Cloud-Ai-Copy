/* eslint-disable */
import { Button, Card, CardBody, Input, CardText, Badge } from "reactstrap";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPipelines } from "../../../redux/pipelines";
import { getStatuses as getLeadStatuses } from "../../../redux/leadStatuses";
import { getStatuses as getClientStatuses } from "../../../redux/clientStatuses";
import Select from "react-select";
import { selectThemeColors } from "@utils";
import { updateProfile } from "../../../redux/profiles";
import { Edit } from "react-feather";
import ProfileSidebar from "./ProfileSidebar";
import PhoneInput from "react-phone-input-2";

const ProfileAbout = ({ data }) => {
  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pipeline, setPipeline] = useState(
    data.pipeline
      ? { value: data.pipeline.id, label: data.pipeline.name }
      : null
  );
  const [leadStatus, setLeadStatus] = useState(
    data.lead_status
      ? { value: data.lead_status.id, label: data.lead_status.name }
      : null
  );
  const [clientStatus, setClientStatus] = useState(
    data.client_status
      ? { value: data.client_status.id, label: data.client_status.name }
      : null
  );
  const pipelines = useSelector((state) => state.pipelines.pipelines);
  const leadStatuses = useSelector((state) => state.leadStatuses.statuses);
  const clientStatuses = useSelector((state) => state.clientStatuses.statuses);

  const pipelinesOptions = useMemo(() => {
    return pipelines.map((p) => ({ value: p.id, label: p.name }));
  }, [pipelines]);

  const leadStatusesOptions = useMemo(() => {
    return leadStatuses.map((p) => ({ value: p.id, label: p.name }));
  }, [leadStatuses]);

  const clientStatusesOptions = useMemo(() => {
    return clientStatuses.map((p) => ({ value: p.id, label: p.name }));
  }, [clientStatuses]);

  useEffect(() => {
    if (data?.pipeline) {
      setPipeline({ value: data.pipeline.id, label: data.pipeline.name });
    }
    if (data?.lead_status) {
      setLeadStatus({
        value: data.lead_status.id,
        label: data.lead_status.name,
      });
    }
    if (data?.client_status) {
      setClientStatus({
        value: data.client_status.id,
        label: data.client_status.name,
      });
    } else {
      setClientStatus(clientStatusesOptions[0]);
    }
  }, [data]);

  useEffect(() => {
    if (!pipelines.length) {
      dispatch(getPipelines({ workspace_id: data.workspace_id }));
    }
    if (!leadStatuses.length) {
      dispatch(getLeadStatuses({ workspace_id: data.workspace_id }));
    }
    if (!clientStatuses.length) {
      dispatch(getClientStatuses({ workspace_id: data.workspace_id }));
    }
  }, []);

  const handleProfileUpdate = (params) => {
    dispatch(
      updateProfile({
        payload: {
          pipeline: pipeline.value,
          lead_status: leadStatus?.value,
          client_status: clientStatus?.value,
          name: data.name,
          phone: data.phone,
          ...params,
        },
        id: data.id,
      })
    );
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      <Card>
        <div className="d-flex justify-content-between">
          <div className="form-switch form-check-success mt-1 ms-1">
            <Input
              type="switch"
              id="switch-success"
              name="success"
              checked={data.type === "client"}
              onChange={() =>
                handleProfileUpdate({
                  type: data.type === "client" ? "lead" : "client",
                })
              }
            />
          </div>
          <Button
            onClick={toggleSidebar}
            className="rounded-circle btn-icon"
            color="primary"
          >
            <Edit size={20} />
          </Button>
        </div>
        <CardBody>
          <h5 className="mb-75">
            Profile{" "}
            <Badge
              className="ms-1"
              color={`light-${data.type === "client" ? "success" : "warning"}`}
            >
              {" "}
              {data.type}
            </Badge>
          </h5>
          <CardText>{data.name}</CardText>
          <div className="mt-2">
            <h5 className="mb-75">Phone:</h5>
            <PhoneInput
              className="phone-placeholder"
              country={"us"}
              value={data.phone}
              disableSearchIcon
              disabled
              placeholder="1 234 567 8900"
            />
          </div>
          <div className="mt-2">
            <h5 className="mb-75">Pipeline:</h5>
            <Select
              value={pipeline}
              theme={selectThemeColors}
              classNamePrefix="select"
              className="react-select"
              placeholder="Select pipeline"
              options={pipelinesOptions}
              onChange={(value) => {
                setPipeline(value);
                handleProfileUpdate({ pipeline: value.value });
              }}
            />
          </div>
          <div className="mt-2">
              <h5 className="mb-75">Status:</h5>
              <Select
                value={data.type === "lead" ? leadStatus : clientStatus}
                theme={selectThemeColors}
                classNamePrefix="select"
                className="react-select"
                placeholder="Select status"
                options={ data.type === "lead" ? leadStatusesOptions : clientStatusesOptions}
                onChange={(val) => {
                  data.type === "lead" ? setLeadStatus(val): setClientStatus(val);
                  handleProfileUpdate({ [`${data.type}_status`]: val.value });
                }}
              />
            </div>
          {/* {data.type === "client" && (
            <div className="mt-2">
              <h5 className="mb-75">Client Status:</h5>
              <Select
                value={clientStatus}
                theme={selectThemeColors}
                classNamePrefix="select"
                className="react-select"
                placeholder="Select client status"
                options={clientStatusesOptions}
                onChange={(val) => {
                  setClientStatus(val);
                  handleProfileUpdate({ client_status: val.value });
                }}
              />
            </div>
          )} */}
          <div className="mt-2">
            <h5 className="mb-75">Created At:</h5>
            <CardText>
              {moment(data.created_at).format("YYYY-MM-DD HH:mm:ss")}
            </CardText>
          </div>
          <div className="mt-2">
            <h5 className="mb-75">Updated At:</h5>
            <CardText>
              {moment(data.updated_at).format("YYYY-MM-DD HH:mm:ss")}
            </CardText>
          </div>
        </CardBody>
      </Card>
      {sidebarOpen && (
        <ProfileSidebar
          open={sidebarOpen}
          toggleSidebar={toggleSidebar}
          profile={data}
        />
      )}
    </>
  );
};

export default ProfileAbout;
