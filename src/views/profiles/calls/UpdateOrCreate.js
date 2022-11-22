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
import { useDispatch, useSelector } from "react-redux";

export default () => {
  const [audioDetails, setAudioDetails] = useState([
    {
      url: null,
      blob: null,
      chunks: [],
      duration: {
        h: 0,
        m: 0,
        s: 0,
      },
    }
  ]);

  const [note, setNote] = useState("");
  const [tags, setTags] = useState([]);
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.profiles.loading);
  const errors = useSelector((state) => state.profiles.errors);

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle tag="h4">Create Call</CardTitle>
      </CardHeader>
      <Form onSubmit={handleSubmit}>
        <CardBody>
          <div className="d-flex justify-content-between">
            <Col md="6" sm="12">
              <FormGroup>
                <Label className="form-label" for="title">
                  Tags<span className="text-danger">*</span>
                </Label>
                <TagsInput
                  value={tags}
                  onChange={setTags}
                  className={
                    errors.has("tags")
                      ? "is-invalid form-control"
                      : "form-control"
                  }
                  name="Tags"
                  placeHolder="Add tag"
                />
                {errors.has("tags") && (
                  <FormFeedback>{errors.get("tags")}</FormFeedback>
                )}
              </FormGroup>
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
              <Recorder audioDetails={audioDetails} setAudioDetails={setAudioDetails} />
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
                <Button color="secondary" type="reset">
                  Cancel
                </Button>
              </div>
            </Col>
          </div>
        </CardBody>
      </Form>
    </Card>
  );
};
