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
import { MoreVertical } from "react-feather";

// ** Store & Actions
import { useDispatch, useSelector } from "react-redux";

export default ({ 
  open, 
  toggleSidebar, 
  status, 
  moduleName,
  createStatus,
  updateStatus,
  setErrors
}) => {
  const [name, setName] = useState("");
  const [color, setColor] = useState("#9B9B9B");
  const [showColor, setShowColor] = useState(false);
  const [formSubmissionLoader, setFormSubmissionLoader] = useState(false);

  //store
  const dispatch = useDispatch();
  const errors = useSelector((state) => state[moduleName].errors);
  const currentWorkspace = useSelector(
    (state) => state.workspaces.currentWorkspace
  );

  useEffect(() => {
    if (status) {
      setName(status.name);
    }
  }, [status]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setFormSubmissionLoader(true);
    dispatch(setErrors({}));
    dispatch(
      status
        ? updateStatus({
            formData: {
              name,
              color,
            },
            id: status.id,
          })
        : createStatus({
            name,
            color,
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

  return (
    <Sidebar
      size="lg"
      open={open}
      title={status ? "Update Status" : "New Status"}
      headerClassName="mb-1"
      contentClassName="pt-0"
      toggleSidebar={toggleSidebar}
    >
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label className="form-label" for="title">
            Name<span className="text-danger">*</span>
          </Label>
          <div style={{ display: "ruby-base" }}>
            <div style={{ width: "90%" }}>
              <Input
                placeholder="Enter name here"
                value={name}
                className={
                  errors.has("name")
                    ? "is-invalid form-control"
                    : "form-control"
                }
                style={{
                  color: color,
                  // fontSize: color.value,
                  marginBottom: "5%",
                }}
                onChange={(e) => {
                  const value = e.target.value.replace(
                    /(^\w{1})|(\s+\w{1})/g,
                    (letter) => letter.toUpperCase()
                  );
                  setName(value);
                }}
              />
            </div>
            <div style={{ width: "10%" }}>
              <MoreVertical
                size={25}
                onClick={() => setShowColor(!showColor)}
              />
            </div>
          </div>
          {showColor && <SketchPicker color={color} onChange={(color) => setColor(color.hex)} />}
          {errors.has("color") && (
            <FormFeedback>{errors.get("color")}</FormFeedback>
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
