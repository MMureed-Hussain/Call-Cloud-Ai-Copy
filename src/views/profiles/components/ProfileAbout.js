/* eslint-disable */
import { Card, CardBody, CardText, Badge } from 'reactstrap';
import moment from 'moment';

const ProfileAbout = ({ data }) => {
    return (
        <Card>
            <CardBody>
                <h5 className='mb-75'>Profile</h5>
                <CardText>{data.name}</CardText>
                <div className='mt-2'>
                    <h5 className='mb-75'>Phone:</h5>
                    <CardText>{data.phone}</CardText>
                </div>
                <div className='mt-2'>
                    <h5 className='mb-75'>Pipeline:</h5>
                    {data.pipeline ? <Badge color="primary">{data.pipeline.name}</Badge> : "-"}
                </div>
                <div className='mt-2'>
                    <h5 className='mb-75'>Created At:</h5>
                    <CardText>{moment(data.created_at).format("YYYY-MM-DD HH:mm:ss")}</CardText>
                </div>
            </CardBody>
        </Card>
    )
}

export default ProfileAbout
