/* eslint-disable */
import { Button, Card, CardBody, Input, CardText, Badge } from "reactstrap";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPipelines } from "../../../redux/pipelines";
import { getLeadStatuses } from "../../../redux/leadStatuses";
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
    data.leadStatus
      ? { value: data.leadStatus.id, label: data.leadStatus.name }
      : null
  );
  const pipelines = useSelector((state) => state.pipelines.pipelines);
  const leadStatuses = useSelector((state) => state.leadStatuses.leadStatuses);

  const pipelinesOptions = useMemo(() => {
    return pipelines.map((p) => ({ value: p.id, label: p.name }));
  }, [pipelines]);

  const leadStatusesOptions = useMemo(() => {
    return leadStatuses.map((p) => ({ value: p.id, label: p.name }));
  }, [leadStatuses]);

  useEffect(() => {
    dispatch(getPipelines({ workspace_id: data.workspace_id }));
  }, []);

  useEffect(() => {
    dispatch(getLeadStatuses({ workspace_id: data.workspace_id }));
  }, []);

  useEffect(() => {
    if (pipeline && pipeline.value != data.pipeline_id) {
      dispatch(
        updateProfile({
          payload: {
            pipeline: pipeline.value,
            name: data.name,
            phone: data.phone,
          },
          id: data.id,
        })
      );
    }
  }, [pipeline]);

  useEffect(() => {
    if (leadStatus && leadStatus.value != data.leadStatus_id) {
      dispatch(
        updateProfile({
          payload: {
            leadStatus: leadStatus.value,
            name: data.name,
            phone: data.phone,
          },
          id: data.id,
        })
      );
    }
  }, [leadStatus]);

  const updateProfileType = () => {
    dispatch(
      updateProfile({
        payload: {
          pipeline: pipeline.value,
          leadStatus: leadStatus.value,
          name: data.name,
          phone: data.phone,
          type: data.type === "lead" ? "client" : "lead",
        },
        id: data.id,
      })
    );
  };

  useEffect(() => {
    if (data?.pipeline) {
      setPipeline({ value: data.pipeline.id, label: data.pipeline.name });
    }
  }, [data]);

  useEffect(() => {
    if (data?.leadStatus) {
      setLeadStatus({ value: data.leadStatus.id, label: data.leadStatus.name });
    }
  }, [data]);

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
              onChange={updateProfileType}
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
              onChange={setPipeline}
            />
          </div>
          <div className="mt-2">
            <h5 className="mb-75">Lead Status:</h5>
            <Select
              value={leadStatus}
              theme={selectThemeColors}
              classNamePrefix="select"
              className="react-select"
              placeholder="Select leadStatus"
              options={leadStatusesOptions}
              onChange={setLeadStatus}
            />
          </div>
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
