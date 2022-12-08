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

// ** Store & Actions
import { useDispatch, useSelector } from "react-redux";
import { createStatus, setErrors, updateStatus } from "../../../redux/statuses";

export default ({ open, toggleSidebar, status }) => {
  const [name, setName] = useState("");
  const [order, setOrder] = useState("");
  const [formSubmissionLoader, setFormSubmissionLoader] = useState(false);

  //store
  const dispatch = useDispatch();
  const errors = useSelector((state) => state.statuses.errors);

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
              order,
            },
            id: status.id,
          })
        : createStatus({
            name,
            order,
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
        <FormGroup>
          <Label className="form-label" for="title">
            Order<span className="text-danger">*</span>
          </Label>
          <Input
            placeholder="Enter Order here"
            value={order}
            className={
              errors.has("name") ? "is-invalid form-control" : "form-control"
            }
            onChange={(e) => {
              setOrder(e.target.value);
            }}
          />
          {errors.has("order") && (
            <FormFeedback>{errors.get("order")}</FormFeedback>
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
