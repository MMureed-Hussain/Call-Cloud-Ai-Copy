/* eslint-disable */
import React, { useState, useEffect, useMemo } from "react";
import {
  Form,
  Input,
  Label,
  FormGroup,
  Spinner,
  Button,
  FormFeedback,
} from "reactstrap";
import "cleave.js/dist/addons/cleave-phone.us";
import { useDispatch, useSelector } from "react-redux";
import { createProfile, setSelectedProfile, updateProfile } from "../../../redux/profiles";
import { getPipelines, setErrors } from "../../../redux/pipelines";
import 'react-phone-input-2/lib/style.css'
import PhoneInput from "react-phone-input-2";
import Select from "react-select"
import { selectThemeColors } from '@utils';
import Sidebar from "@components/sidebar";

export default ({ open, toggleSidebar, profile }) => {
  const [phone, setPhone] = useState("");
  const [profileName, setProfileName] = useState("");
  const [pipeline, setPipeline] = useState(null);

  const dispatch = useDispatch();

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
    dispatch(setErrors({}))
    dispatch(getPipelines({ workspace_id: currentWorkspace.id }));
  }, []);

  useEffect(() => {
    if (!profile) {
      setPipeline(pipelinesOptions[0])
    } else {
      setPhone(profile.phone);
      setProfileName(profile.name);
      if (profile.pipeline) {
        setPipeline({ value: profile.pipeline.id, label: profile.pipeline.name });
      }
    }
  }, [pipelinesOptions, profile])

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(
      profile
        ? updateProfile({
          payload: {
            name: profileName,
            phone: phone,
            pipeline: pipeline?.value
          },
          id: profile.id,
        })
        : createProfile({
          name: profileName,
          phone: phone,
          workspace_id: currentWorkspace.id,
          pipeline: pipeline?.value
        })
    ).then((res) => {
      if (res.payload.data) {
        toggleSidebar();
        // setPipeline({ value: res.payload.data.pipeline.id, label: res.payload.data.pipeline.name });
        dispatch(setSelectedProfile(res.payload.data))
      }
    });
  };

  return (
    <Sidebar
      size="lg"
      open={open}
      title={profile ? "Edit Profile" : "New Profile"}
      headerClassName="mb-1"
      contentClassName="pt-0"
      toggleSidebar={toggleSidebar}
    >
      <Form onSubmit={handleSubmit}>
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
              const value = e.target.value.replace(
                /(^\w{1})|(\s+\w{1})/g,
                (letter) => letter.toUpperCase()
              );
              setProfileName(value);
            }}
          />
          {errors.has("name") && (
            <FormFeedback>{errors.get("name")}</FormFeedback>
          )}
        </FormGroup>
        <FormGroup>
          <Label className="form-label" for="phone-number">
            Phone Number<span className="text-danger">*</span>
          </Label>
          <PhoneInput
            country={"us"}
            value={phone}
            enableSearch
            disableSearchIcon
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
        <Button className="me-1" color="primary" type="submit">
          Submit
          {loading && (
            <Spinner style={{ marginLeft: "5px" }} size={"sm"} color="white" />
          )}
        </Button>
        <Button type="reset" color="secondary" outline onClick={toggleSidebar}>
          Cancel
        </Button>
      </Form>
    </Sidebar>
  );
};
