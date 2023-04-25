/* eslint-disable */
import ProfileAbout from "./components/ProfileAbout";
import { Row, Col } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import CallsList from "./CallsList";
import CallFollowUpList from "./CallFollowUpList";
import ContactList from "./ContactList";
import NoteList from "./NoteList";

import { getProfile, setReloadTable } from "../../redux/profiles";
import { getUsers } from "../../redux/workspaces";
import { getStatusesOptions } from "../../redux/statuses";

export default () =>
{
  const params = useParams();
  const dispatch = useDispatch();
  //selectors
  const currentWorkspace = useSelector((state) => state.workspaces.currentWorkspace);
  const profile = useSelector((state) => state.profiles.selectedProfile);
  const reload = useSelector((state) => state.profiles.reloadTable);

  const clientOptions = useSelector((state) => state.statuses.client_options);
  const callOptions = useSelector((state) => state.statuses.call_options);
  const leadOptions = useSelector((state) => state.statuses.lead_options);
  const pipelineOptions = useSelector((state) => state.statuses.pipeline_options);
  const workspaceUsers = useSelector((state) => state.workspaces.users.map((user) => ({ value: user.id, label: user.name })));
  const campaignsOptions = useSelector((state) => state.campaigns.campaignsOptions);

  useEffect(() =>
  {
    if (currentWorkspace) {
      dispatch(getProfile({ id: params.id }));
      dispatch(getStatusesOptions());
      dispatch(getUsers({ id: currentWorkspace.id, perPage: 50, page: 1 }));
    }
  }, [currentWorkspace]);


  if (!profile) {
    return (
      <div className="vh-100">
        <Skeleton height={"15%"} />
        <Skeleton height={"7%"} count={9} />
      </div>
    );
  }

  return (
    <div id="user-profile">
      <section id="profile-info">
        <Row>
          <Col lg={{ size: 3, order: 1 }} sm={{ size: 12 }} xs={{ order: 2 }}>
            <ProfileAbout
              data={profile}
              clientOptions={clientOptions}
              leadOptions={leadOptions}
              pipelineOptions={pipelineOptions}
              workspaceUsers={workspaceUsers}
              campaignsOptions={campaignsOptions}
            />
          </Col>
          <Col lg={{ size: 9, order: 2 }} sm={{ size: 12 }} xs={{ order: 1 }}>
            <CallFollowUpList />
            <NoteList profileId={params.id} />
            <CallsList profileId={params.id} callOptions={callOptions} />
          </Col>
        </Row>
      </section>
    </div>
  );
};
