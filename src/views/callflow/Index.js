/* eslint-disable */
import { Row, Col } from "reactstrap";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCallFlowData } from "../../redux/workspaces"
import CallFlowAbout from "./components/LeadAbout";
import CallFlowTable from "./components/LeadTable";
import RecordList from "./components/RecordList";
import Skeleton from "react-loading-skeleton";


export default ({ workspaceId }) => {
  const [callFlowData, setCallFlowData] = useState();
  const [nextCall, setNextCall] = useState(false);
  // const [loader, setLoader] = useState(true);

  const dispatch = useDispatch();
  const store = useSelector((state) => state.workspaces);

  const fetchCallFlow = () => {
    dispatch(
      getCallFlowData(workspaceId)
    ).then((data) => setCallFlowData(data.payload.data.callflow));
  }

  useEffect(() => {
    if (workspaceId) {
      fetchCallFlow();
    };
  }, [nextCall, workspaceId]);

  const nextCallRecord = () => {
    setNextCall(!nextCall);
  }

  if (store.callflowLoading) {
    return (
      <Fragment>
        <div className="vh-100">
          <Skeleton height={"15%"} />
          <Skeleton height={"7%"} count={9} />
        </div>
      </Fragment>
    );
  }

  return (
    <div id="user-profile">
      <section id="profile-info">
        <Row>
          <Col lg={{ size: 3, order: 1 }} sm={{ size: 12 }} xs={{ order: 2 }}>
            <CallFlowAbout callFlowData={callFlowData} />
          </Col>
          <Col lg={{ size: 9, order: 2 }} sm={{ size: 12 }} xs={{ order: 1 }}>
            <CallFlowTable callFlowRecord={callFlowData} nextCallRecord={nextCallRecord} />

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
