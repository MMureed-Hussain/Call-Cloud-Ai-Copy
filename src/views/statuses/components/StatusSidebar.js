/* eslint-disable */
import { useEffect, useState } from "react";
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
import { SketchPicker } from "react-color";

// ** Store & Actions
import { useDispatch, useSelector } from "react-redux";
import {
  createStatus,
  updateStatus,
  setErrors,
} from "../../../redux/clientStatuses";

export default ({ open, toggleSidebar, clientStatus }) => {
  const [name, setName] = useState("");
  const [colorPiker, setColorPiker] = useState("#000000");
  const [formSubmissionLoader, setFormSubmissionLoader] = useState(false);

  //store
  const dispatch = useDispatch();
  const errors = useSelector((state) => state.clientStatuses.errors);
  const currentWorkspace = useSelector(
    (state) => state.workspaces.currentWorkspace
  );

  useEffect(() => {
    if (clientStatus) {
      setName(clientStatus.name);
    }
  }, [clientStatus]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setFormSubmissionLoader(true);
    console.log("onSubmit", name, colorPiker);
    dispatch(setErrors({}));
    dispatch(
      clientStatus
        ? updateStatus({
            formData: {
              name,
            },
            id: clientStatus.id,
          })
        : createStatus({
            name,
            colorPiker,
            workspace_id: currentWorkspace.id,
          })
    ).then((res) => {
      setFormSubmissionLoader(false);
      if (res.payload.data) {
        toggleSidebar();
        dispatch(setErrors({}));
      }
    });
  };

  const handleChangeComplete = (color) => {
    setColorPiker(color.hex);
  };

  return (
    <Sidebar
      size="lg"
      open={open}
      title={clientStatus ? "Update Client Status" : "New Client Status"}
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
            style={{
              color: colorPiker,
              fontSize: colorPiker.value,
            }}
            onChange={(e) => {
              const value = e.target.value.replace(
                /(^\w{1})|(\s+\w{1})/g,
                (letter) => letter.toUpperCase()
              );
              setName(value);
            }}
          />
          <SketchPicker color={colorPiker} onChange={handleChangeComplete} />
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
