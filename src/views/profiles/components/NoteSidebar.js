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
import { useParams } from "react-router-dom";
import { createNote, updateNote } from "../../../redux/profiles";

export default ({ open, toggleSidebar, callNote }) => {
  // ** States
  const params = useParams();
  const [note, setNote] = useState("");
  const [formSubmissionLoader, setFormSubmissionLoader] = useState(false);
  //store
  const dispatch = useDispatch();
  const errors = useSelector((state) => state.profiles.errors);

  const handleSubmit = (event) => {
    event.preventDefault();
    setFormSubmissionLoader(true);
    dispatch(
      callNote
        ? updateNote({
          formData: {
            note,
          },
          id: callNote.id,
        })
        : createNote({
          note,
          profile_id: params.id
        })
    ).then((res) => {
      setFormSubmissionLoader(false);
      if (res.payload.data) {
        toggleSidebar();
      }
    });
  };
  // ** Set note fields in case of edit mode
  useEffect(() => {
    if (callNote) {
      setNote(callNote.note);
    }
  }, [callNote]);

  const handleSidebarClosed = () => {
    setNote("");
  };

  return (
    <Sidebar
      size="lg"
      open={open}
      title={note ? "Update Note" : "New Note"}
      headerClassName="mb-1"
      contentClassName="pt-0"
      toggleSidebar={toggleSidebar}
      onClosed={handleSidebarClosed}
    >
      <Form onSubmit={handleSubmit}>
        <div className="mb-1">
          <Label className="form-label" for="title">
            Note
          </Label>
          <Input
            type="textarea"
            placeholder="Enter Note here"
            value={note}
            className={
              errors.has("note") ? "is-invalid form-control" : "form-control"
            }
            onChange={(e) => {
              const value = e.target.value.replace(
                /(^\w{1})|(\s+\w{1})/g,
                (letter) => letter.toUpperCase()
              );
              setNote(value);
            }}
          />
          {errors.has("note") && (
            <FormFeedback>{errors.get("note")}</FormFeedback>
          )}
        </div>
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
