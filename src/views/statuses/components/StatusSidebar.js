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
import {
  createStatus,
  updateStatus,
  setErrors,
} from "../../../redux/clientStatuses";

export default ({ open, toggleSidebar, clientStatus }) => {
  const [name, setName] = useState("");
  const [colors, setColors] = useState("#9B9B9B");
  const [showColor, setShowColor] = useState(false);
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
    dispatch(setErrors({}));
    dispatch(
      clientStatus
        ? updateStatus({
            formData: {
              name,
              colors,
            },
            id: clientStatus.id,
          })
        : createStatus({
            name,
            colors,
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

  const handleChange = (color) => {
    setColors(color.hex);
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
                  color: colors,
                  // fontSize: colors.value,
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

          {/* {name ? <SketchPicker color={colors} onChange={handleChange} /> : ""} */}
          {showColor ? (
            <SketchPicker color={colors} onChange={handleChange} />
          ) : (
            ""
          )}
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
