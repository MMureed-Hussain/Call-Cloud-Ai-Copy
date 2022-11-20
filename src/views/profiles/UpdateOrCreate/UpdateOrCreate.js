/* eslint-disable */
import React, { useState, useEffect } from "react";
import {
  Card,
  Form,
  Input,
  Label,
  Col,
  Row,
  FormGroup,
  CardBody,
  Button,
  CardTitle,
  CardHeader,
  FormFeedback
} from "reactstrap";
import Cleave from 'cleave.js/react'
import 'cleave.js/dist/addons/cleave-phone.us'
import { useDispatch, useSelector } from "react-redux";
import { createProfile } from "../../../redux/profile";
import { Link } from "react-router-dom";

export default () => {
  // const [audioDetails, setAudioDetails] = useState([
  //   {
  //     url: null,
  //     blob: null,
  //     chunks: [],
  //     duration: {
  //       h: 0,
  //       m: 0,
  //       s: 0,
  //     },
  //   }
  // ]);

  const [phone, setPhone] = useState("");
  const [profileName, setProfileName] = useState("");
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.profile.loading);
  const errors = useSelector((state) => state.profile.errors);
  const currentWorkspace = useSelector((state) => state.workspaces.currentWorkspace);


  useEffect(() => {
    return () => {
      //todo remove event listeners
    };
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(createProfile({
      name: profileName,
      phone,
      workspace_id: currentWorkspace.id
    }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle tag='h4'>Create Profile</CardTitle>
      </CardHeader>
      <Form onSubmit={handleSubmit}>
        <CardBody>
          <Row>
            <Col md="6" sm="12">
              <FormGroup>
                <Label className="form-label" for="title">
                  Profile Name<span className="text-danger">*</span>
                </Label>
                <Input
                  id="profile"
                  placeholder="Enter profile name"
                  value={profileName}
                  className={errors.has('name') ? 'is-invalid form-control' : 'form-control'}
                  onChange={(e) => {
                    setProfileName(e.target.value);
                  }}
                />
                {errors.has('name') && <FormFeedback>{errors.get('name')}</FormFeedback>}
              </FormGroup>
            </Col>
            <Col md="6" sm="12">
              <FormGroup>
                <Label className="form-label" for="phone-number">
                  Phone Number<span className="text-danger">*</span>
                </Label>
                <Cleave className={errors.has('phone') ? 'is-invalid form-control' : 'form-control'}
                  value={phone}
                  placeholder='1 234 567 8900'
                  options={{ phone: true, phoneRegionCode: 'US' }}
                  onChange={(e) => {
                    setPhone(e.target.value);
                  }}
                  id='phone-number' />
                {errors.has('phone') && <FormFeedback>{errors.get('phone')}</FormFeedback>}
              </FormGroup>
            </Col>
            <Col sm='12'>
              <div className='d-flex'>
                <Button className='me-1' color='primary' disabled={loading} type='submit'>
                  Submit
                </Button>
                <Link to={"/profiles"}>
                  <Button
                    color="secondary"
                    type="reset"
                  >
                    Cancel
                  </Button>
                </Link>
              </div>
            </Col>
          </Row>
        </CardBody>
      </Form>
    </Card>
  );
};
