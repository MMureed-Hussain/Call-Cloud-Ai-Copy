/* eslint-disable */
import React, { useState, useEffect } from "react";
import { TagsInput } from "react-tag-input-component";
import Recorder from '../UpdateOrCreate/components/Recorder';

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
import Cleave from "cleave.js/react";
import "cleave.js/dist/addons/cleave-phone.us";
import { useDispatch, useSelector } from "react-redux";
import { createProfile } from "../../../redux/profiles";
import { Link } from "react-router-dom";

export default () => {
  // const [audioDetails, setAudioDetails] = useState([
  //   {
  //     url: null,
  //     blob: null,
  //     chunks: [],
  //     duration: {
  //       h: 0,
  //       m: 0,
  //       s: 0,
  //     },
  //   }
  // ]);

  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [selected, setSelected] = useState([]);
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.profiles.loading);
  const errors = useSelector((state) => state.profiles.errors);
  const currentWorkspace = useSelector(
    (state) => state.workspaces.currentWorkspace
  );
 
  useEffect(() => {
    return () => {
      //todo remove event listeners
    };
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(
      createProfile({
        name: note,
        phone,
        workspace_id: currentWorkspace.id,
      })
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle tag="h4">Create Form</CardTitle>
      </CardHeader>
      <Form onSubmit={handleSubmit}>
        <CardBody>
          <Row>
            <Col md="6" sm="12">
              <FormGroup>
                <Label className="form-label" for="title">
                  Notes<span className="text-danger">*</span>
                </Label>
                <Input
                  id="profile"
                  placeholder="Enter Note here"
                  value={note}
                  className={
                    errors.has("name")
                      ? "is-invalid form-control"
                      : "form-control"
                  }
                  onChange={(e) => {
                    setNote(e.target.value);
                  }}
                />
                {errors.has("name") && (
                  <FormFeedback>{errors.get("name")}</FormFeedback>
                )}
              </FormGroup>
            </Col>
            <Col md="6" sm="12">
              <h1>Recorder</h1>
            </Col>
            <Col md="6" sm="12">
              <FormGroup>
                <Label className="form-label" for="title">
                  Tags<span className="text-danger">*</span>
                </Label>
                <TagsInput
                  value={selected}
                  onChange={setSelected}
                  name="Tags"
                  placeHolder="Enter something here"
                />
                {errors.has("name") && (
                  <FormFeedback>{errors.get("name")}</FormFeedback>
                )}
              </FormGroup>
            </Col>
            <Col sm="12">
              <div className="d-flex">
                {/* <Button
                  className="me-1"
                  color="primary"
                  disabled={loading}
                  type="submit"
                >
                  Add Form
                </Button>
                <Button color="secondary" type="reset">
                  Cancel
                </Button> */}
              </div>
            </Col>
          </Row>
        </CardBody>
      </Form>
    </Card>
  );
};
