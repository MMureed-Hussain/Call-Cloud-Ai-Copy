/* eslint-disable */
import { Row, Col } from "reactstrap";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getCallFlowData} from "../../redux/workspaces"
import CallFlowAbout from "./components/LeadAbout";
import CallFlowTable from "./components/LeadTable";
import RecordList from "./components/RecordList";

export default ({workspaceId}) => {
  const [callFlowData,setCallFlowData]=useState();
  const [nextCall,setNextCall]=useState(false);

  const dispatch=useDispatch();

  useEffect(() => {
    dispatch(
      getCallFlowData(workspaceId)
    ).then((data)=> setCallFlowData(data.payload.data.callflow));
  }, [nextCall]);

  const nextCallRecord=()=>{
    setNextCall(!nextCall);
  }

  return (
    <div id="user-profile">
      <section id="profile-info">
        <Row>
          <Col lg={{ size: 3, order: 1 }} sm={{ size: 12 }} xs={{ order: 2 }}>
            <CallFlowAbout callFlowData={callFlowData} />
          </Col>
          <Col lg={{ size: 9, order: 2 }} sm={{ size: 12 }} xs={{ order: 1 }}>
             <CallFlowTable callFlowRecord={callFlowData} nextCallRecord={nextCallRecord}/>
            
            {callFlowData?.leadlist && (
              <RecordList 
                rowId={callFlowData.leadlist[0].leadlist_rows[0]?.id} 
                profileId={callFlowData.call_profile_id} 
              /> 
            )}
          </Col>
        </Row>
      </section>
    </div>
  );
};
