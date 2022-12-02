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
import Recorder from "./Recorder";
import { useParams } from "react-router-dom";
import { createCall, updateCall } from "../../../redux/profiles";
import TagInput from "./TagInput";

export default ({ open, toggleSidebar, call }) => {
  // ** States
  const [audioDetails, setAudioDetails] = useState({
    url: null,
    blob: null,
    chunks: [],
    duration: {
      h: 0,
      m: 0,
      s: 0,
    },
  });
  const params = useParams();
  const [note, setNote] = useState("");
  const [tags, setTags] = useState([]);
  const [formSubmissionLoader, setFormSubmissionLoader] = useState(false);
  //store
  const dispatch = useDispatch();
  const errors = useSelector((state) => state.profiles.errors);

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("note", note);
    formData.append("tags", JSON.stringify(tags));
    if (audioDetails.blob) {
      formData.append("voice", audioDetails.blob);
    }
    formData.append("call_profile_id", params.id);
    setFormSubmissionLoader(true);
    dispatch(
      call
        ? updateCall({
            formData,
            id: call.id,
          })
        : createCall({
            formData,
            id: params.id,
          })
    ).then((res) => {
      setFormSubmissionLoader(false);
      if (res.payload.data) {
        toggleSidebar();
      }
    });
  };
  // ** Set call fields in case of edit mode
  useEffect(() => {
    if (call) {
      setNote(call.notes);
      setAudioDetails((state) => {
        state.url = `${process.env.REACT_APP_API_ENDPOINT}/audio-stream/${call.id}`;
        return state;
      });
      let tags = call.tags.map((tag) => ({ value: tag.id, label: tag.label }));
      setTags(tags);
    }
  }, [call]);

  const handleSidebarClosed = () => {
    setAudioDetails({
      url: null,
      blob: null,
      chunks: [],
      duration: {
        h: 0,
        m: 0,
        s: 0,
      },
    });
    setNote("");
    setTags([]);
  };

  return (
    <Sidebar
      size="lg"
      open={open}
      title={call ? "Update Call" : "New Call"}
      headerClassName="mb-1"
      contentClassName="pt-0"
      toggleSidebar={toggleSidebar}
      onClosed={handleSidebarClosed}
    >
      <Form onSubmit={handleSubmit}>
        {!call ? (
          <Recorder
            audioDetails={audioDetails}
            setAudioDetails={setAudioDetails}
          />
        ) : (
          null
        )}
        <FormGroup>
          <Label className="form-label" for="title">
            Tags<span className="text-danger">*</span>
          </Label>
          <TagInput
            value={tags}
            onChange={setTags}
            className={{
              input: errors.has("tags")
                ? "is-invalid form-control"
                : "form-control",
            }}
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
            placeholder="Enter Note here"
            value={note}
            className={
              errors.has("note") ? "is-invalid form-control" : "form-control"
            }
            onChange={(e) => {
              setNote(e.target.value);
            }}
          />
          {errors.has("note") && (
            <FormFeedback>{errors.get("note")}</FormFeedback>
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
