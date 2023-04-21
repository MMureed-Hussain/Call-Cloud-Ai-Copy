/* eslint-disable */
import { Fragment, useState, useEffect } from "react";
import axios from "axios";
axios.defaults.withCredentials = true;
import AsyncSelect from "react-select/async";
import Select from "react-select";
import { Row, Col, Form, Card, Input, Label, Button, CardBody, CardTitle, CardHeader, FormFeedback, Spinner } from "reactstrap";
import { selectThemeColors, companySizeOptions } from "@utils";
import ReactFlagsSelect from "react-flags-select";
import DeleteAccount from "./DeleteAccount";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile, getTimezones, getIndustryOptions } from "@store/auth";


const AccountTabs = ({ data }) =>
{
  const dispatch = useDispatch();
  const [formSubmissionLoader, setFormSubmissionLoader] = useState(false);
  const timezonesList = useSelector((state) => state.auth.timezonesList);
  const industriesOptions = useSelector((state) => state.auth.industriesOptions);
  const [avatar, setAvatar] = useState(data?.avatar ?? require("@src/assets/images/avatars/avatar-blank.png"));

  const [inputs, setInputs] = useState({
    avatar: null,
    firstName: data?.firstName ?? null,
    lastName: data?.lastName ?? null,
    country: data?.country ?? null,
    region: data?.region ?? null,
    city: data?.city ?? null,
    timezone: data?.timezone ?? null,
    companySize: data?.companySize ?? null,
    companyName: data?.companyName ?? null,
    industry: data?.industry?.id ?? null,
  });

  useEffect(() =>
  {
    if (!timezonesList.length) {
      dispatch(getTimezones());
    }

    if (!industriesOptions.length) {
      dispatch(getIndustryOptions());
    }

  }, [timezonesList, industriesOptions]);


  const submit = (e) =>
  {
    e.preventDefault();
    dispatch(updateProfile(inputs));
  }


  const handleImgReset = () =>
  {
    setInputs({ ...inputs, avatar: null });
    setAvatar(data?.avatar ?? require("@src/assets/images/avatars/avatar-blank.png"));

  };


  const handleSelectChange = (e, name) => 
  {
    let target = {
      name,
      type: 'input',
      value: e.value,
    };

    handleChange({ target });
  }


  const handleChange = (e) =>
  {
    let key = e.target.name;
    let value = e.target.type == 'file' ? e.target.files[0] : e.target.value;
    setInputs({ ...inputs, [key]: value });

    if (key == 'avatar') {

      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => setAvatar(reader.result)
      reader.readAsDataURL(file);
    }
  }

  const handleSelected = (options, selected) =>
  {
    let list = [{ value: null, label: 'None Selected' }, ...options];
    return list.filter(op => op.value == selected);
  }

  const trimInput = (st) => st.replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase())

  return (
    <Fragment>
      <Card>
        <CardHeader className="border-bottom">
          <CardTitle tag="h4">
            {
              // prettier-ignore
              data.profileCompleted ? "Profile Details" : "Let’s complete your profile."
            }
          </CardTitle>
        </CardHeader>
        <CardBody className="py-2 my-25">
          <div className="d-flex">
            <div className="me-25">
              <img
                className="me-50"
                src={avatar}
                style={{ borderRadius: "100%" }}
                alt="Generic placeholder image"
                height="100"
                width="100"
              />
            </div>
            <div className="d-flex align-items-end mt-75 ms-1">
              <div>
                <Button tag={Label} className="mb-75 me-75" size="sm" color="primary"> Upload
                  <Input type="file" name="avatar" onChange={e => handleChange(e)} hidden accept="image/*" />
                </Button>
                {inputs.avatar && <Button className="mb-75" color="secondary" size="sm" outline onClick={handleImgReset}> Reset </Button>}
                <p className="mb-0">
                  Allowed JPG, GIF or PNG. Max size of 800kB
                </p>
              </div>
            </div>
          </div>
          <Form onSubmit={submit} className="mt-2 pt-50">
            <Row>
              {data.role === "company" && (
                <>

                  <Col sm="6" className="mb-1">
                    <Label className="form-label" for="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      name="companyName"
                      placeholder="Some Company"
                      invalid={!Boolean(inputs.companyName)}
                      value={inputs.companyName}
                      onChange={e => handleChange(e)}
                    />

                    {!Boolean(inputs.companyName) && <FormFeedback> Please enter a valid Company Name</FormFeedback>}

                  </Col>
                  <Col sm="6" className="mb-1">
                    <Label className="form-label" for="industryInput">Industry</Label>

                    <Select
                      isClearable={false}
                      theme={selectThemeColors}
                      className="react-select"
                      classNamePrefix="select"
                      options={industriesOptions}
                      onChange={(e) => handleSelectChange(e, 'industry')}
                      value={handleSelected(industriesOptions, inputs?.industry)}
                    />
                    {!Boolean(inputs.industry) && <div className="invalid-feedback" style={{ display: "block" }}> Please select industry type! </div>}

                  </Col>

                  <Col sm="6" className="mb-1">
                    <Label className="form-label" for="companySize"> Company Size </Label>
                    <Select
                      isClearable={false}
                      theme={selectThemeColors}
                      className="react-select"
                      classNamePrefix="select"
                      options={companySizeOptions}
                      onChange={(e) => handleSelectChange(e, 'companySize')}
                      value={handleSelected(companySizeOptions, inputs?.companySize)}
                    />
                    {!Boolean(inputs.companySize) && <div className="invalid-feedback" style={{ display: "block" }}> Please select Company Size! </div>}
                  </Col>
                </>
              )}

              <Col sm="6" className="mb-1">
                <Label className="form-label" for="firstName"> First Name </Label>
                <Input
                  id="firstname"
                  name="firstName"
                  placeholder="John"
                  invalid={!Boolean(inputs.firstName)}
                  value={inputs.firstName}
                  onChange={(e) => handleChange(e)}
                />

                {!Boolean(inputs.firstName) && <FormFeedback>Please enter a valid First Name</FormFeedback>}
              </Col>

              <Col sm="6" className="mb-1">
                <Label className="form-label" for="lastName"> Last Name </Label>
                <Input
                  id="lastname"
                  name="lastName"
                  placeholder="Doe"
                  invalid={!Boolean(inputs.lastName)}
                  value={inputs.lastName}
                  onChange={(e) => handleChange(e)}
                />

                {!Boolean(inputs.lastName) && <FormFeedback>Please enter a valid Last Name</FormFeedback>}
              </Col>

              <Col sm="6" className="mb-1">
                <Label className="form-label" for="country"> Country </Label>
                <ReactFlagsSelect
                  id="flags-select"
                  searchable
                  className={`${Boolean(inputs.country) && 'invalid'}`}
                  selected={inputs.country}
                  onSelect={code => handleSelectChange({ value: code }, 'country')}
                />

                {!Boolean(inputs.country) && <div className="invalid-feedback" style={{ display: "block" }}> Please select country! </div>}
              </Col>

              <Col sm="6" className="mb-1">
                <Label className="form-label" for="region"> Region  </Label>
                <Input
                  name="region"
                  placeholder="Ottawa"
                  invalid={!Boolean(inputs.region)}
                  value={inputs.region}
                  onChange={(e) => handleChange(e)}
                />

                {!Boolean(inputs.region) && <div className="invalid-feedback" style={{ display: "block" }}> Please select region! </div>}
              </Col>
              <Col sm="6" className="mb-1">
                <Label className="form-label" for="city"> City </Label>
                <Input
                  name="city"
                  placeholder="Ottawa"
                  invalid={!Boolean(inputs.city)}
                  value={inputs.city}
                  onChange={e => handleChange(e)}
                />

                {!Boolean(inputs.city) && <FormFeedback>Please enter a valid City</FormFeedback>}
              </Col>

              <Col sm="6" className="mb-1">
                <Label className="form-label" for="timezoneInput"> Timezone </Label>
                <Select
                  classNamePrefix="select"
                  options={[{ value: null, label: 'None Selected' }, ...timezonesList]}
                  onChange={(e) => handleSelectChange(e, 'timezone')}
                  placeholder="select a timezone"
                  className="mb-2"
                  value={handleSelected(timezonesList, inputs?.timezone)}
                />

                {!Boolean(inputs.timezone) && <div className="invalid-feedback" style={{ display: "block" }}> Please select Timezone </div>}
              </Col>

              <Col className="mt-2 d-flex" sm="12">
                <Button type="submit" className="me-1" color="primary"> Save changes
                  {formSubmissionLoader && <Spinner style={{ marginLeft: "5px" }} size={"sm"} color="white" />}
                </Button>
              </Col>
            </Row>
          </Form>
        </CardBody>
      </Card>
      <DeleteAccount />
    </Fragment>
  );
};

export default AccountTabs;
