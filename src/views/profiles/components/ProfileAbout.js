/* eslint-disable */
import { Button, Card, CardBody, Input, CardText, Badge, FormGroup } from "reactstrap";
import moment from "moment";
import { useEffect, useMemo, useRef, useState } from "react";
import Select from "react-select";
import { selectThemeColors } from "@utils";
import { Edit } from "react-feather";
import ProfileSidebar from "./ProfileSidebar";
import PhoneInput from "react-phone-input-2";
import { Link } from "react-router-dom";
import { Link as LinkIcon } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../../../redux/profiles";

const ProfileAbout = ({ data, clientOptions, leadOptions, pipelineOptions, workspaceUsers, campaignsOptions }) =>
{

  const dispatch = useDispatch();
  const profileSidebarRef = useRef(null);

  const [input, setInput] = useState({
    name: data.name,
    phone: data.phone,
  });

  const handleChange = (e) =>
  {
    const key = e.target.name;
    let value = e.target.value;
    setInput((input) => ({
      ...input,
      [key]: value,
    }));
  };

  const handleSelectChange = (e, name) =>
  {
    let target = {
      name,
      type: "input",
      value: e.value,
    };

    handleChange({ target });
  };

  const handleSelected = (op, sel) =>
  {
    let newOptions = [{ value: 0, label: 'None' }, ...op];
    let selected = sel ? sel : 0;
    return newOptions.filter(option => option.value === selected);
  }

  useEffect(() =>
  {
    if (input) {
      dispatch(updateProfile({ payload: input, id: data.id }));
    }
  }, [input]);

  return (
    <>
      <Card>
        <div className="d-flex justify-content-between">
          <div className="form-switch form-check-success mt-1 ms-1">
            <Input
              type="switch"
              id="switch-success"
              name="type"
              checked={data.type === "client"}
              onChange={() => handleChange({ target: { name: 'type', type: 'input', value: data.type === "client" ? "lead" : "client" } })}
            />
          </div>
          <Button onClick={() => profileSidebarRef.current.handleShow(data)} className="rounded-circle btn-icon" color="primary">
            <Edit size={20} />
          </Button>
        </div>
        <CardBody>
          <h5 className="mb-75">
            Profile{" "}
            <Badge className="ms-1" color={`light-${data.type === "client" ? "success" : "warning"}`} > {" "}
              {data.type}
            </Badge>
          </h5>
          <CardText>{data.name}</CardText>
          <div className="mt-1">
            <h5 className="mb-75">Phone:</h5>
            <PhoneInput
              className="phone-placeholder"
              country={"us"}
              value={data.phone}
              disableSearchIcon
              disabled
              placeholder="1 234 567 8900"
              inputStyle={{ maxWidth: "fit-content" }}
            />
          </div>
          <div className="mt-1 mb-1">
            <h5 className="mb-75">Campaign</h5>
            <Select
              classNamePrefix="select"
              onChange={e => handleSelectChange(e, 'campaign_id')}
              options={[{ value: '', label: 'None' }, ...campaignsOptions]}
              value={handleSelected(campaignsOptions, data.campaign_id)}
            />
          </div>
          <div className="mb-1">
            <h5 className="mb-75">Pipeline:</h5>
            <Select
              classNamePrefix="select"
              className="mb-2"
              placeholder="Pipeline"
              options={pipelineOptions}
              onChange={e => handleSelectChange(e, 'pipeline_id')}
              value={handleSelected(pipelineOptions, data.pipeline_id)}
            />
          </div>
          <div className="mb-1">
            <h5 className="mb-75">Status:</h5>
            {data.type == 'client' &&
              <Select
                classNamePrefix="select"
                className="mb-2"
                placeholder='Client Status'
                options={clientOptions}
                onChange={e => handleSelectChange(e, 'client_status_id')}
                value={handleSelected(clientOptions, data.client_status_id)}
              />
            }
            {
              data.type == 'lead' &&
              <Select
                classNamePrefix="select"
                className="mb-2"
                placeholder='Lead Status'
                options={leadOptions}
                onChange={e => handleSelectChange(e, 'lead_status_id')}
                value={handleSelected(leadOptions, data.lead_status_id)}
              />
            }
          </div>
          <div className="mt-2">
            <h5 className="mb-75">Users:</h5>
            <Select
              isMulti
              defaultValue={data.users.map((item) => ({ value: item.id, label: item.name }))}
              theme={selectThemeColors}
              value={input.users}
              classNamePrefix="select"
              className="react-select"
              placeholder="Select User"
              options={workspaceUsers}
              onChange={(e) => handleChange({ target: { name: 'users', type: 'input', value: e } })}
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
          <div className="mt-2">
            <Link className="d-flex align-items-center" to={`/activity-logs?model_type=CallProfile&model_id=${data.id}`}>
              <LinkIcon size={14} className="me-50" />
              <h5 className="mb-0">Activity Logs</h5>
            </Link>
          </div>
        </CardBody>
      </Card>

      <ProfileSidebar
        pipelineOptions={pipelineOptions}
        leadOptions={leadOptions}
        clientOptions={clientOptions}
        type={data.type}
        ref={profileSidebarRef}
      />
    </>
  );
};

export default ProfileAbout;
