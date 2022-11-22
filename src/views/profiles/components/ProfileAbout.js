/* eslint-disable */
import { Card, CardBody, CardText } from 'reactstrap'

const ProfileAbout = (data) => {
    return (
        <Card>
            <CardBody>
                <h5 className='mb-75'>Profile</h5>
                <CardText>{data.name}</CardText>
                <div className='mt-2'>
                    <h5 className='mb-75'>Phone:</h5>
                    <CardText>{data.phone}</CardText>
                </div>
            </CardBody>
        </Card>
    )
}

export default ProfileAbout
