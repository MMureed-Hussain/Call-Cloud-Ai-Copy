/* eslint-disable */
import React, { useState, useEffect, useMemo } from "react";
import {
  Card,
  Form,
  Input,
  Label,
  Col,
  Row,
  FormGroup,
  CardBody,
  Button,
  CardTitle,
  CardHeader,
  FormFeedback,
} from "reactstrap";
import "cleave.js/dist/addons/cleave-phone.us";
import { useDispatch, useSelector } from "react-redux";
import { createProfile, getProfile, updateProfile } from "../../redux/profiles";
import { getPipelines } from "../../redux/pipelines";
import { Link, useNavigate, useParams } from "react-router-dom";
import 'react-phone-input-2/lib/style.css'
import PhoneInput from "react-phone-input-2";
import Select from "react-select"
import { selectThemeColors } from '@utils'

export default () => {
  const [phone, setPhone] = useState("");
  const [profileName, setProfileName] = useState("");
  const [pipeline, setPipeline] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();

  const loading = useSelector((state) => state.profiles.loading);
  const errors = useSelector((state) => state.profiles.errors);
  const pipelines = useSelector((state) => state.pipelines.pipelines);

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
          let { data } = res.payload;
          setPhone(data.phone);
          setProfileName(data.name);
          if (data.pipeline) {
            setPipeline({ value: data.pipeline.id, label: data.pipeline.name });
          }
        }
      });
    }
    dispatch(getPipelines(currentWorkspace.id));
  }, [params.id]);

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(
      params.id
        ? updateProfile({
          payload: {
            name: profileName,
            phone: phone,
            pipeline: pipeline?.value
          },
          id: params.id,
        })
        : createProfile({
          name: profileName,
          phone: phone,
          workspace_id: currentWorkspace.id,
          pipeline: pipeline?.value
        })
    ).then((res) => {
      if (res.payload.data) {
        navigate(`/profiles/${res.payload.data.id}`);
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle tag="h4">Create Profile</CardTitle>
      </CardHeader>
      <Form onSubmit={handleSubmit}>
        <CardBody>
          <Row>
            <Col md="6" sm="12">
              <FormGroup>
                <Label className="form-label" for="title">
                  Profile Name<span className="text-danger">*</span>
                </Label>
                <Input
                  id="profile"
                  placeholder="Enter profile name"
                  value={profileName}
                  className={
                    errors.has("name")
                      ? "is-invalid form-control"
                      : "form-control"
                  }
                  onChange={(e) => {
                    setProfileName(e.target.value);
                  }}
                />
                {errors.has("name") && (
                  <FormFeedback>{errors.get("name")}</FormFeedback>
                )}
              </FormGroup>
            </Col>
            <Col md="6" sm="12">
              <FormGroup>
                <Label className="form-label" for="phone-number">
                  Phone Number<span className="text-danger">*</span>
                </Label>
                <PhoneInput
                  country={"us"}
                  value={phone}
                  containerClass={errors.has("phone") ? "is-invalid" : ""}
                  inputClass={
                    errors.has("phone")
                      ? "is-invalid form-control w-100"
                      : "form-control w-100"
                  }
                  placeholder="1 234 567 8900"
                  onChange={setPhone}
                />
                {errors.has("phone") && (
                  <FormFeedback>{errors.get("phone")}</FormFeedback>
                )}
              </FormGroup>
            </Col>
            <Col md="6" sm="12">
              <FormGroup>
                <Label className="form-label" for="phone-number">
                  Pipeline<span className="text-danger">*</span>
                </Label>
                <Select
                  value={pipeline}
                  theme={selectThemeColors}
                  classNamePrefix="select"
                  className={
                    errors.has("pipeline")
                      ? "is-invalid react-select"
                      : "react-select"
                  }
                  placeholder="Select pipeline"
                  options={pipelinesOptions}
                  onChange={setPipeline}
                />
                {errors.has("pipeline") && (
                  <FormFeedback>{errors.get("pipeline")}</FormFeedback>
                )}
              </FormGroup>
            </Col>
            <Col sm="12">
              <div className="d-flex">
                <Button
                  className="me-1"
                  color="primary"
                  disabled={loading}
                  type="submit"
                >
                  Submit
                </Button>
                <Link to={"/profiles"}>
                  <Button color="secondary" type="reset" outline>
                    Cancel
                  </Button>
                </Link>
              </div>
            </Col>
          </Row>
        </CardBody>
      </Form>
    </Card>
  );
};
