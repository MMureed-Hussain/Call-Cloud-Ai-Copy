/* eslint-disable */
import { useEffect, useState, useMemo } from "react";
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
import Select from "react-select";
import { selectThemeColors } from "@utils";
// ** Store & Actions
import { useDispatch, useSelector } from "react-redux";
import Recorder from "./Recorder";
import { useParams } from "react-router-dom";
import { createCall, updateCall } from "../../../redux/profiles";
import TagInput from "./TagInput";
import { getStatuses } from "../../../redux/callStatuses";

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
  const [callStatus, setCallStatus] = useState(null);
  //store
  const dispatch = useDispatch();
  const errors = useSelector((state) => state.profiles.errors);
  const statuses = useSelector((state) => state.callStatuses.statuses);
  const currentWorkspace = useSelector(
    (state) => state.workspaces.currentWorkspace
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData();
    if (!call) {
      formData.append("note", note);
      formData.append("tags", JSON.stringify(tags));
      formData.append("voice", audioDetails.blob);
      formData.append("call_profile_id", params.id);
      if (callStatus) {
        formData.append("call_status", callStatus.value);
      }
    }
    setFormSubmissionLoader(true);
    dispatch(
      call
        ? updateCall({
            formData: {
              note,
              tags: JSON.stringify(tags),
              call_status: callStatus?.value,
            },
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
      if (call.call_status) {
        setCallStatus({
          value: call.call_status.id,
          label: call.call_status.name,
        });
      }
    }
    dispatch(
      getStatuses({
        workspace_id: currentWorkspace.id,
        include_call_count: "true",
      })
    );
  }, [call]);

  const callStatusOptions = useMemo(() => {
    return statuses.map((p) => ({ value: p.id, label: p.name }));
  }, [statuses]);

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
        {!call && (
          <Recorder
            audioDetails={audioDetails}
            setAudioDetails={setAudioDetails}
          />
        )}
        <FormGroup>
          <Label className="form-label" for="phone-number">
            Call Status<span className="text-danger">*</span>
          </Label>
          <Select
            value={callStatus}
            theme={selectThemeColors}
            classNamePrefix="select"
            className={
              errors.has("call_status")
                ? "is-invalid react-select"
                : "react-select"
            }
            placeholder="Select call status"
            options={callStatusOptions}
            onChange={setCallStatus}
          />
          {errors.has("call_status") && (
            <FormFeedback>{errors.get("call_status")}</FormFeedback>
          )}
        </FormGroup>
        <FormGroup>
          <Label className="form-label" for="title">
            Tags<span className="text-danger">*</span>
          </Label>
          <TagInput
            value={tags}
            onChange={setTags}
            className={
              errors.has("tags") ? "is-invalid react-select" : "react-select"
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
            Notes
          </Label>
          <Input
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
