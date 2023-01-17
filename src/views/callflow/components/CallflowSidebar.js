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

// ** Store & Actions
import { useDispatch, useSelector } from "react-redux";
import Recorder from "./Recorder";
import { useParams } from "react-router-dom";
import { postCallFlowRecord } from "../../../redux/callflow";
import { ContactSupportOutlined } from "@material-ui/icons";

export default ({ open, toggleSidebar, call,callRecordList ,rowId}) => {
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
  //store
  const dispatch = useDispatch();
  const errors = useSelector((state) => state.profiles.errors);
  const userId=useSelector((state)=>state.auth.user.id)
  const currentWorkspace = useSelector(
    (state) => state.workspaces.currentWorkspace
  );
  const callFlowData=useSelector((state)=>state.workspaces.callflow)
  
  const handleSubmit = (event) => {

    event.preventDefault();
    const formData = new FormData();
  // rowid , audio,userid,workspaceid
  let payload={}
  
  
    
      formData.append("voice", audioDetails?.blob);
      formData.append("user_id", userId);
      formData.append("workspace_id",currentWorkspace?.id)
      formData.append("row_id",rowId)
      
      
    
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
