// ** React Imports
import { Fragment, useState } from "react";
// ** Axios Imports
import axios from "axios";
axios.defaults.withCredentials = true;
// ** Third Party Components
// import Select from "react-select";
// import Cleave from "cleave.js/react";
// import { useForm, Controller } from "react-hook-form";
// import "cleave.js/dist/addons/cleave-phone.us";
import AsyncSelect from "react-select/async";
import Select from "react-select";
import AsyncCreatableSelect from "react-select/async-creatable";
import { CountryRegionData } from "react-country-region-selector";
// console.log("CountryRegionData", CountryRegionData);

const countryOptions = CountryRegionData.map((country) => {
  return {
    id: country[1],
    label: country[0],
    value: country[1],
  };
});
// ** Reactstrap Imports
import {
  Row,
  Col,
  Form,
  Card,
  Input,
  Label,
  Button,
  CardBody,
  CardTitle,
  CardHeader,
  FormFeedback,
} from "reactstrap";

// ** Utils
import { selectThemeColors } from "@utils";

// ** Demo Components
import DeleteAccount from "./DeleteAccount";

import { useDispatch } from "react-redux";
import { updateProfile } from "@store/auth";
import toast from "react-hot-toast";

const AccountTabs = ({ data }) => {
  const dispatch = useDispatch();
  // ** Hooks
  // const defaultValues = {
  //   name: data.name,
  //   email: data.email,
  // };
  // const {
  //   control,
  //   // setError,
  //   handleSubmit,
  //   formState: { errors },
  // } = useForm({ defaultValues });

  // ** States
  //prettier-ignore
  const [avatar, setAvatar] = useState(data.avatar ? data.avatar : require("@src/assets/images/avatars/avatar-blank.png").default);

  const [firstName, setFirstName] = useState(() => {
    return data.firstName ? data.firstName : "";
  });
  const [firstNameError, setFirstNameError] = useState(false);

  const [lastName, setLastName] = useState(() => {
    return data.lastName ? data.lastName : "";
  });
  const [lastNameError, setLastNameError] = useState(false);

  const [email, setEmail] = useState(data.email);
  const [emailError, setEmailError] = useState(false);

  const [city, setCity] = useState(() => {
    return data.city ? data.city : "";
  });
  const [cityError, setCityError] = useState(false);

  const [education, setEducation] = useState(() => {
    return data.education ? data.education : "";
  });
  const [educationError, setEducationError] = useState(false);
  const [isStudent, setIsStudent] = useState(() => {
    return data.isStudent ? data.isStudent : false;
  });

  const [avatarFile, setAvatarFile] = useState(null);

  const [industry, setIndustry] = useState(() => {
    if (data.industry) {
      return {
        label: data.industry.industry,
        value: data.industry.industry,
        id: data.industry.id,
      };
    } else {
      return null;
    }
  });
  const [industryError, setIndustryError] = useState(false);
  const [industryQuery, setIndustryQuery] = useState("");

  const [company, setCompany] = useState(() => {
    if (data.company) {
      return {
        label: data.company.company,
        value: data.company.company,
        id: data.company.id,
      };
    } else {
      return null;
    }
  });
  const [companyError, setCompanyError] = useState(false);
  const [companyQuery, setCompanyQuery] = useState("");

  const [role, setRole] = useState(() => {
    if (data.role) {
      return {
        label: data.role.role,
        value: data.role.role,
        id: data.role.id,
      };
    } else {
      return null;
    }
  });
  const [roleError, setRoleError] = useState(false);
  const [roleQuery, setRoleQuery] = useState("");

  const [specialities, setSpecialities] = useState(() => {
    if (data.specialities.length) {
      const specialitiesList = data.specialities.map((speciality) => {
        return {
          label: speciality.speciality,
          value: speciality.speciality,
          id: speciality.id,
        };
      });

      return specialitiesList;
    } else {
      return [];
    }
  });
  const [specialitiesError, setSpecialitiesError] = useState(false);
  const [specialitiesQuery, setSpecialitiesQuery] = useState("");

  const [title, setTitle] = useState(() => {
    return data.title ? data.title : "";
  });
  const [titleError, setTitleError] = useState(false);

  const [description, setDescription] = useState(data.description);
  const [descriptionError, setDescriptionError] = useState(false);

  const loadIndustriesOptions = async () => {
    const res = await axios.get(
      `${process.env.REACT_APP_API_ENDPOINT}/api/industries?q=${industryQuery}`
    );
    const industries = res.data.map((industry) => {
      return {
        id: industry.id,
        value: industry.industry,
        label: industry.industry,
      };
    });
    return industries;
  };

  const handleIndustryInputChange = (newValue) => {
    setIndustryQuery(newValue);
  };

  const loadCompaniesOptions = async () => {
    const res = await axios.get(
      `${process.env.REACT_APP_API_ENDPOINT}/api/companies?q=${companyQuery}`
    );
    const companies = res.data.map((company) => {
      return {
        id: company.id,
        value: company.company,
        label: company.company,
      };
    });
    return companies;
  };

  const handleCompanyInputChange = (newValue) => {
    setCompanyQuery(newValue);
  };

  const loadSpecialitiesOptions = async () => {
    const res = await axios.get(
      `${process.env.REACT_APP_API_ENDPOINT}/api/specialities?q=${specialitiesQuery}`
    );
    const specialities = res.data.map((speciality) => {
      return {
        id: speciality.id,
        value: speciality.speciality,
        label: speciality.speciality,
      };
    });
    return specialities;
  };

  const handleSpecialitiesInputChange = (newValue) => {
    setSpecialitiesQuery(newValue);
  };

  const loadRoleOptions = async () => {
    const res = await axios.get(
      `${process.env.REACT_APP_API_ENDPOINT}/api/roles?q=${roleQuery}`
    );
    const roles = res.data.map((role) => {
      return {
        id: role.id,
        value: role.role,
        label: role.role,
      };
    });
    return roles;
  };

  const handleRoleInputChange = (newValue) => {
    setRoleQuery(newValue);
  };

  const [regionOptions, setRegionOptions] = useState(() => {
    if (data.country && data.region) {
      const selectedCountry = CountryRegionData.filter((country) => {
        return country[1] === data.country;
      });

      if (!selectedCountry.length) return [];

      return selectedCountry[0][2].split("|").map((region) => {
        return {
          id: region.split("~")[1],
          value: region.split("~")[0],
          label: region.split("~")[0],
        };
      });
    } else {
      return [];
    }
  });

  const [country, setCountry] = useState(() => {
    if (data.country) {
      const selectedCountry = CountryRegionData.filter((country) => {
        return country[1] === data.country;
      });

      if (selectedCountry.length) {
        return {
          id: data.country,
          label: selectedCountry[0][0],
          value: data.country,
        };
      } else {
        return null;
      }
    } else {
      return null;
    }
  });
  const [countryError, setCountryError] = useState(false);

  const [region, setRegion] = useState(() => {
    if (data.country) {
      const selectedCountry = CountryRegionData.filter((country) => {
        return country[1] === data.country;
      });

      const selectedRegion = selectedCountry[0][2]
        .split("|")
        .map((region) => {
          return {
            id: region.split("~")[1],
            value: region.split("~")[0],
            label: region.split("~")[0],
          };
        })
        .filter((region) => {
          return data.region === region.id;
        });

      if (selectedRegion[0]) {
        return selectedRegion[0];
      } else {
        return null;
      }
    } else {
      return null;
    }
  });
  const [regionError, setRegionError] = useState(false);

  const onChange = (e) => {
    const reader = new FileReader(),
      files = e.target.files;
    reader.onload = function () {
      setAvatar(reader.result);
    };
    setAvatarFile(files[0]);
    reader.readAsDataURL(files[0]);
  };

  const onSubmit = (e) => {
    let valid = true;

    if (!title) {
      setTitleError(true);
      valid = false;
    } else {
      setTitleError(false);
    }

    if (!firstName) {
      setFirstNameError(true);
      valid = false;
    } else {
      setFirstNameError(false);
    }

    if (!lastName) {
      setLastNameError(true);
      valid = false;
    } else {
      setLastNameError(false);
    }

    if (!description) {
      setDescriptionError(true);
      valid = false;
    } else {
      setDescriptionError(false);
    }

    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      setEmailError(true);
      valid = false;
    } else {
      setEmailError(false);
    }

    if (!industry) {
      valid = false;
      setIndustryError(true);
    } else {
      setIndustryError(false);
    }

    if (!company) {
      valid = false;
      setCompanyError(true);
    } else {
      setCompanyError(false);
    }

    if (!role) {
      valid = false;
      setRoleError(true);
    } else {
      setRoleError(false);
    }

    if (!country) {
      valid = false;
      setCountryError(true);
    } else {
      setCountryError(false);
    }

    if (!region) {
      valid = false;
      setRegionError(true);
    } else {
      setRegionError(false);
    }

    if (!city) {
      setCityError(true);
      valid = false;
    } else {
      setCityError(false);
    }

    if (!education && isStudent) {
      setEducationError(true);
      valid = false;
    } else {
      setEducationError(false);
    }

    if (!specialities.length) {
      setSpecialitiesError(true);
      valid = false;
    } else {
      setSpecialitiesError(false);
    }

    if (valid) {
      const payload = {
        email,
        title,
        firstName,
        lastName,
        industry: industry.id,
        description,
        country: country.id,
        region: region.id,
        city,
        specialities: JSON.stringify(specialities),
      };

      if (avatarFile) {
        payload.avatar = avatarFile;
      }

      if (isStudent) {
        payload.isStudent = isStudent;
        payload.education = education;
      }

      payload.company = company.value;
      if (company.id) {
        payload.companyId = company.id;
      }

      payload.role = role.value;
      if (role.id) {
        payload.roleId = role.id;
      }

      console.log("form data ==>", payload);

      dispatch(updateProfile(payload));
    }
    e.preventDefault();
  };

  const handleImgReset = () => {
    //prettier-ignore
    setAvatar(data.avatar ? data.avatar : require("@src/assets/images/avatars/avatar-blank.png").default);
    setAvatarFile(null);
  };

  return (
    <Fragment>
      <Card>
        <CardHeader className="border-bottom">
          <CardTitle tag="h4">Profile Details</CardTitle>
        </CardHeader>
        <CardBody className="py-2 my-25">
          <div className="d-flex">
            <div className="me-25">
              <img
                className="rounded me-50"
                src={avatar}
                alt="Generic placeholder image"
                height="100"
                width="100"
              />
            </div>
            <div className="d-flex align-items-end mt-75 ms-1">
              <div>
                <Button
                  tag={Label}
                  className="mb-75 me-75"
                  size="sm"
                  color="primary"
                >
                  Upload
                  <Input
                    type="file"
                    onChange={onChange}
                    hidden
                    accept="image/*"
                  />
                </Button>
                <Button
                  className="mb-75"
                  color="secondary"
                  size="sm"
                  outline
                  onClick={handleImgReset}
                >
                  Reset
                </Button>
                <p className="mb-0">
                  Allowed JPG, GIF or PNG. Max size of 800kB
                </p>
              </div>
            </div>
          </div>
          <Form className="mt-2 pt-50">
            <Row>
              <Col sm="6" className="mb-1">
                <Label className="form-label" for="Title">
                  Title
                </Label>
                <Input
                  id="title"
                  placeholder="Mr"
                  invalid={titleError}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />

                <FormFeedback>Please enter a valid Title</FormFeedback>
              </Col>

              <Col sm="6" className="mb-1">
                <Label className="form-label" for="firstName">
                  First Name
                </Label>
                <Input
                  id="firstname"
                  placeholder="John"
                  invalid={firstNameError}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />

                <FormFeedback>Please enter a valid First Name</FormFeedback>
              </Col>

              <Col sm="6" className="mb-1">
                <Label className="form-label" for="lastName">
                  Last Name
                </Label>
                <Input
                  id="lastname"
                  placeholder="Doe"
                  invalid={lastNameError}
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />

                <FormFeedback>Please enter a valid Last Name</FormFeedback>
              </Col>

              <Col sm="6" className="mb-1">
                <Label className="form-label" for="emailInput">
                  E-mail
                </Label>
                <Input
                  id="emailInput"
                  type="email"
                  name="email"
                  invalid={emailError}
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <FormFeedback>Please enter a valid Email</FormFeedback>
              </Col>

              <Col sm="6" className="mb-1">
                <Label className="form-label" for="industryInput">
                  Industry
                </Label>
                <AsyncSelect
                  defaultOptions
                  isClearable={false}
                  value={industry}
                  name="industry"
                  className="react-select"
                  id="industryInput"
                  classNamePrefix="select"
                  onChange={(industry) => {
                    setIndustry(industry);
                  }}
                  theme={selectThemeColors}
                  loadOptions={loadIndustriesOptions}
                  onInputChange={handleIndustryInputChange}
                  noOptionsMessage={(input) => {
                    return `No match found for ${input.inputValue}!`;
                  }}
                />

                {industryError && (
                  <div
                    className="invalid-feedback"
                    style={{ display: "block" }}
                  >
                    Please select Industry
                  </div>
                )}
              </Col>

              <Col sm="6" className="mb-1">
                <Label className="form-label" for="companyInput">
                  Current Company
                </Label>
                <AsyncCreatableSelect
                  defaultOptions
                  isClearable={false}
                  value={company}
                  name="company"
                  className="react-select"
                  id="companyInput"
                  classNamePrefix="select"
                  onChange={(company) => {
                    console.log("selected company", company);
                    setCompany(company);
                  }}
                  theme={selectThemeColors}
                  loadOptions={loadCompaniesOptions}
                  onInputChange={handleCompanyInputChange}
                />

                {companyError && (
                  <div
                    className="invalid-feedback"
                    style={{ display: "block" }}
                  >
                    Please add current Company!
                  </div>
                )}
              </Col>

              <Col sm="6" className="mb-1">
                <Label className="form-label" for="roleInput">
                  Current Role
                </Label>
                <AsyncCreatableSelect
                  defaultOptions
                  isClearable={false}
                  value={role}
                  name="role"
                  className="react-select"
                  id="roleInput"
                  classNamePrefix="select"
                  onChange={(role) => {
                    // prettier-ignore
                    role.value = role.value.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
                    // prettier-ignore
                    role.label = role.label.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
                    console.log("selected role", role);
                    setRole(role);
                  }}
                  theme={selectThemeColors}
                  loadOptions={loadRoleOptions}
                  onInputChange={handleRoleInputChange}
                />

                {roleError && (
                  <div
                    className="invalid-feedback"
                    style={{ display: "block" }}
                  >
                    Please add current Role!
                  </div>
                )}
              </Col>

              <Col sm="6" className="mb-1">
                <Label className="form-label" for="country">
                  Country
                </Label>
                <Select
                  value={country}
                  theme={selectThemeColors}
                  className="react-select"
                  id="country"
                  classNamePrefix="select"
                  // defaultValue={colourOptions[0]}
                  options={countryOptions}
                  isClearable={false}
                  onChange={(selected) => {
                    setCountry(selected);
                    setRegion(null);

                    const selectedCountry = CountryRegionData.filter(
                      (country) => {
                        return country[1] === selected.id;
                      }
                    );

                    const regions = selectedCountry[0][2]
                      .split("|")
                      .map((region) => {
                        return {
                          id: region.split("~")[1],
                          value: region.split("~")[1],
                          label: region.split("~")[0],
                        };
                      });
                    setRegionOptions(regions);
                  }}
                />
                {countryError && (
                  <div
                    className="invalid-feedback"
                    style={{ display: "block" }}
                  >
                    Please select country!
                  </div>
                )}
              </Col>

              <Col sm="6" className="mb-1">
                <Label className="form-label" for="region">
                  Region
                </Label>
                <Select
                  theme={selectThemeColors}
                  className="react-select"
                  id="region"
                  classNamePrefix="select"
                  // defaultValue={colourOptions[0]}
                  options={regionOptions}
                  value={region}
                  isClearable={false}
                  noOptionsMessage={() => "Please select country first!"}
                  onChange={(selected) => {
                    console.log(selected);
                    setRegion(selected);
                  }}
                />
                {regionError && (
                  <div
                    className="invalid-feedback"
                    style={{ display: "block" }}
                  >
                    Please select region!
                  </div>
                )}
              </Col>

              <Col sm="6" className="mb-1">
                <Label className="form-label" for="city">
                  City
                </Label>
                <Input
                  id="city"
                  placeholder="Ottawa"
                  invalid={cityError}
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />

                <FormFeedback>Please enter a valid City</FormFeedback>
              </Col>

              <Col sm="6" className="mb-1">
                <Label className="form-label" for="specialitiesInput">
                  Specialities
                </Label>
                <AsyncCreatableSelect
                  defaultOptions
                  isClearable={false}
                  isMulti={true}
                  value={specialities}
                  name="specialities"
                  className="react-select"
                  id="specialitiesInput"
                  classNamePrefix="select"
                  onChange={(specialities) => {
                    console.log(specialities);
                    if (specialities.length > 10) {
                      toast.error("Maximum 10 specialities allowed!");
                      return;
                    }
                    const formattedSpecialities = specialities.map((s) => {
                      if (s.id) {
                        return s;
                      }
                      s.value = s.value.replace(
                        /(^\w{1})|(\s+\w{1})/g,
                        (letter) => letter.toUpperCase()
                      );
                      s.label = s.label.replace(
                        /(^\w{1})|(\s+\w{1})/g,
                        (letter) => letter.toUpperCase()
                      );
                      return s;
                    });
                    setSpecialities(formattedSpecialities);
                    setSpecialitiesError(false);
                  }}
                  theme={selectThemeColors}
                  loadOptions={loadSpecialitiesOptions}
                  onInputChange={handleSpecialitiesInputChange}
                />

                {specialitiesError && (
                  <div
                    className="invalid-feedback"
                    style={{ display: "block" }}
                  >
                    Please add specialities!
                  </div>
                )}
              </Col>

              <Col sm="6" className="mb-1">
                <div className="form-floating mt-2">
                  <Input
                    invalid={descriptionError}
                    value={description}
                    type="textarea"
                    name="description"
                    id="description-textarea"
                    placeholder="Description"
                    style={{ minHeight: "100px" }}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                  <Label className="form-label" for="description-textarea">
                    Description
                  </Label>
                  <FormFeedback>Please add description!</FormFeedback>
                </div>
              </Col>

              <Col sm="6" className="mb-1">
                <div className="form-check form-check-primary">
                  <Input
                    type="checkbox"
                    id="is-student-checkbox"
                    checked={isStudent}
                    onChange={(e) => setIsStudent(e.target.checked)}
                  />
                  <Label className="form-check-label" for="is-student-checkbox">
                    I'm a student
                  </Label>
                </div>
              </Col>

              <Col
                sm="6"
                className="mb-1"
                style={{ display: isStudent ? "block" : "none" }}
              >
                <Label className="form-label" for="education">
                  Education establishment
                </Label>
                <Input
                  id="education"
                  placeholder="ME (Master of engineering)"
                  invalid={educationError}
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                />

                <FormFeedback>
                  Please enter an Education establishment
                </FormFeedback>
              </Col>

              <Col className="mt-2" sm="12">
                <Button
                  onClick={(e) => onSubmit(e)}
                  className="me-1"
                  color="primary"
                >
                  Save changes
                </Button>
                <Button color="secondary" outline>
                  Discard
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
