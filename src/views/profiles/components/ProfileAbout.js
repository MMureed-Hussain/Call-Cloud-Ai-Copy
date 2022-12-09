/* eslint-disable */
import { Card, CardBody, CardText, Badge } from 'reactstrap';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPipelines } from '../../../redux/pipelines';
import Select from "react-select"
import { selectThemeColors } from '@utils'
import { updateProfile } from '../../../redux/profiles';

const ProfileAbout = ({ data }) => {
    const dispatch = useDispatch();
    const [pipeline, setPipeline] = useState(data.pipeline ? {value: data.pipeline.id, label: data.pipeline.name} : null);
    const pipelines = useSelector(state => state.pipelines.pipelines)
  
    const pipelinesOptions = useMemo(() => {
        return pipelines.map((p) => ({ value: p.id, label: p.name }));
    }, [pipelines]);
  
    useEffect(() => {
        dispatch(getPipelines(data.workspace_id));
    }, [])
   
    useEffect(() => {
        if (pipeline && pipeline.id !== data.pipeline_id) {
            dispatch(updateProfile({
                payload:{
                    pipeline: pipeline.value,
                    name: data.name,
                    phone: data.phone
                },
                id: data.id
            }))
        }
    }, [pipeline])

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
                    <Select
                        value={pipeline}
                        theme={selectThemeColors}
                        classNamePrefix="select"
                        className="react-select"
                        placeholder="Select pipeline"
                        options={pipelinesOptions}
                        onChange={setPipeline}
                    />
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
