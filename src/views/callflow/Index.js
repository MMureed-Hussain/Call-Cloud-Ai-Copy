/* eslint-disable */
import LeadAbout from "./components/LeadAbout";
import { Row, Col } from "reactstrap";
import LeadTable from "./components/LeadTable";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCallFlowData} from "../../redux/callflow"
import CallFlowAbout from "./components/LeadAbout";
import CallFlowTable from "./components/LeadTable";
import RecordList from "./components/RecordList";

export default () => {
  const [callFlowData,setCallFlowData]=useState();
const [nextCall,setNextCall]=useState(true);

  const workspaceId =  useSelector(
    (state) => state.workspaces?.currentWorkspace?.id
  );
  

const dispatch=useDispatch();
  useEffect(() => {
    

  dispatch(
  
    getCallFlowData(workspaceId)
   ).then((data)=>setCallFlowData(data.payload.data.callflow));


  

}, []);
useEffect(() => {

    dispatch(
    
      getCallFlowData(workspaceId)
     ).then((data)=>setCallFlowData(data.payload.data.callflow));
  }
  
  

, [nextCall]);




const nextCallRecord=()=>{
setNextCall(!nextCall);


}

  
  return (


    <div id="user-profile">
      <section id="profile-info">
        <Row>
          {console.log("callflow",callFlowData)}
          <Col lg={{ size: 3, order: 1 }} sm={{ size: 12 }} xs={{ order: 2 }}>
            <CallFlowAbout callFlowData={callFlowData} />
          </Col>
          <Col lg={{ size: 9, order: 2 }} sm={{ size: 12 }} xs={{ order: 1 }}>
             <CallFlowTable callFlowRecord={callFlowData} nextCallRecord={nextCallRecord}/>
            
            <RecordList rowId={callFlowData?.leadlist[0].leadlist_rows[0]?.id} /> 

          </Col>
        </Row>
      </section>
    </div>
  );
};
