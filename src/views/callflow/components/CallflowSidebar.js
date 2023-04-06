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
import TagInput from "../../profiles/components/TagInput";

import { selectThemeColors } from "@utils";
import { getStatuses } from "../../../redux/callStatuses";
import { useDispatch, useSelector } from "react-redux";
import Recorder from "./Recorder";
import { useParams } from "react-router-dom";
import { postCallFlowRecord } from "../../../redux/workspaces";

export default ({ open, toggleSidebar, call,callRecordList ,rowId,profileId}) => {
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
  const [formSubmissionLoader, setFormSubmissionLoader] = useState(false);
  const [callStatus, setCallStatus] = useState(null);
  const [note, setNote] = useState("");
  const [tags, setTags] = useState([]);

  //store
  const dispatch = useDispatch();
  const errors = useSelector((state) => state.profiles.errors);
  const userId=useSelector((state)=>state.auth.user.id)
  const currentWorkspace = useSelector(
    (state) => state.workspaces.currentWorkspace
  );
  
  const statuses = useSelector((state) => state.callStatuses.statuses);

  const callFlowData=useSelector((state)=>state.workspaces.callflow)
  useEffect(()=>{
   // let tags = call.tags.map((tag) => ({ value: tag.id, label: tag.label }));
   // setTags(tags);
    dispatch(
      getStatuses({
        workspace_id: currentWorkspace.id,
        include_call_count: "true",
      })
    );

  },[])
  const callStatusOptions = useMemo(() =>
  {
    return statuses.map((p) => ({ value: p.id, label: p.name }));
  }, [statuses]);
  const handleSubmit = (event) => {

    event.preventDefault();
    const formData = new FormData();
  // rowid , audio,userid,workspaceid
  let payload={}
  
  let tagsArray=[]
  tags.map((data)=>tagsArray.push( data.label) 
 )
  
    console.log("onsubmit",callStatus,tags)
      formData.append("voice", audioDetails?.blob);
      formData.append("user_id", userId);
      formData.append("workspace_id",currentWorkspace?.id)
      formData.append("row_id",rowId)
      formData.append("call_profile_id",profileId)
      formData.append("note",note)
      formData.append("callstatus",callStatus.label)
      formData.append("tags",tagsArray)      
      
    
    setFormSubmissionLoader(true);
   dispatch(postCallFlowRecord(formData)).then((res)=>{

callRecordList()

setFormSubmissionLoader(false);
toggleSidebar()

   })
  };


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
        
          <Recorder
            audioDetails={audioDetails}
            setAudioDetails={setAudioDetails}
          />
          <div className="mb-1">
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
        </div>
        <div className="mb-1">
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
        </div>
        <div className="mb-1">
          <Label className="form-label" for="title">
            Notes
          </Label>
          <Input
            placeholder="Enter Note here"
            value={note}
            className={
              errors.has("note") ? "is-invalid form-control" : "form-control"
            }
            onChange={(e) =>
            {
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
        <div className="d-flex justify-content-center">
        <Button className="me-1" color="primary">
          Submit
          {formSubmissionLoader && (
            <Spinner style={{ marginLeft: "5px" }} size={"sm"} color="white" />
          )}
        </Button>
        <Button type="reset" color="secondary" outline onClick={toggleSidebar}>
          Cancel
        </Button>
        </div>
      </Form>
    </Sidebar>
  );
};
