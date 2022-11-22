/* eslint-disable */
import ProfileAbout from "./components/ProfileAbout";
import { Row, Col } from 'reactstrap';
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useParams } from "react-router-dom"
import { getProfile } from "../../redux/profiles";
import Skeleton from "react-loading-skeleton";

export default () => {
    const params = useParams();
    const dispatch = useDispatch();
    //selectors
    const currentWorkspace = useSelector((state) => state.workspaces.currentWorkspace);
    const loading = useSelector((state) => state.profiles.loading);
    const profile = useSelector((state) => state.profiles.selectedProfile);

    useEffect(() => {
        if (currentWorkspace) {
            dispatch(getProfile({
                workspace_id: currentWorkspace.id,
                id: params.id
            }))
        }
    }, [currentWorkspace]);

   
    if (loading) {
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
                    <Col lg={{ size: 4, order: 1 }} sm={{ size: 12 }} xs={{ order: 2 }}>
                        <ProfileAbout data={profile} />
                    </Col>
                    {/* <Col lg={{ size: 8, order: 2 }} sm={{ size: 12 }} xs={{ order: 1 }}>
                        <ProfilePosts data={data.post} />
                    </Col> */}
                </Row>
            </section>
        </div>
    )

}