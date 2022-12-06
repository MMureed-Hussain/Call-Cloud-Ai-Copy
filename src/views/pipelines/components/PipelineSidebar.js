/* eslint-disable */
import { useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "@components/sidebar";
import {
  Button,
  Label,
  Form,
  Input,
  FormFeedback,
  Spinner,
  FormGroup,
} from "reactstrap";

// ** Store & Actions
import { useDispatch, useSelector } from "react-redux";
import { createPipeline, updatePipeline } from "../../../redux/pipelines";
import { param } from "jquery";

export default ({ open, toggleSidebar, pipeline }) => {
  const [name, setName] = useState("");
  const [formSubmissionLoader, setFormSubmissionLoader] = useState(false);

  //store
  const dispatch = useDispatch();
  const errors = useSelector((state) => state.pipelines.errors);
  const currentWorkspace = useSelector(
    (state) => state.workspaces.currentWorkspace
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    setFormSubmissionLoader(true);
    dispatch(
      pipeline
        ? updatePipeline({
            name,
            id: pipeline.id,
          })
        : createPipeline({
            name,
            workspace_id: currentWorkspace.id,
          })
    ).then((res) => {
      setFormSubmissionLoader(false);
      if (res.payload.data) {
        toggleSidebar();
      }
    });
  };

  return (
    <Sidebar
      size="lg"
      open={open}
      title={pipeline ? "Update Pipeline" : "New Pipeline"}
      headerClassName="mb-1"
      contentClassName="pt-0"
      toggleSidebar={toggleSidebar}
    >
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label className="form-label" for="title">
            Name<span className="text-danger">*</span>
          </Label>
          <Input
            placeholder="Enter name here"
            value={name}
            className={
              errors.has("name") ? "is-invalid form-control" : "form-control"
            }
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          {errors.has("name") && (
            <FormFeedback>{errors.get("name")}</FormFeedback>
          )}
        </FormGroup>
        <Button className="me-1" color="primary">
          Submit
          {formSubmissionLoader && (
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
