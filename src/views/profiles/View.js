/* eslint-disable */
import ProfileAbout from "./components/ProfileAbout";
import { Row, Col } from 'reactstrap';
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useParams } from "react-router-dom"
import { getProfile } from "../../redux/profiles";
import Skeleton from "react-loading-skeleton";
import CallsList from "./CallsList";
import CallFollowUpList from "./CallFollowUpList";

export default () => {
    const params = useParams();
    const dispatch = useDispatch();
    //selectors
    const currentWorkspace = useSelector((state) => state.workspaces.currentWorkspace);
    const profile = useSelector((state) => state.profiles.selectedProfile);

    useEffect(() => {
        if (currentWorkspace) {
            dispatch(getProfile({
                params: { include_calls: "false" },
                id: params.id
            }))
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
        <div id='user-profile'>
            <section id='profile-info'>
                <Row>
                    <Col lg={{ size: 3, order: 1 }} sm={{ size: 12 }} xs={{ order: 2 }}>
                        <ProfileAbout data={profile} />
                    </Col>
                    <Col lg={{ size: 9, order: 2 }} sm={{ size: 12 }} xs={{ order: 1 }}>
                        <CallFollowUpList />
                        <CallsList profileId={params.id}/>
                    </Col>
                </Row>
            </section>
        </div>   
    )

}