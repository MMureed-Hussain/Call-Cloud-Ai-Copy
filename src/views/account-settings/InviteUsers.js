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
  Spinner,
} from "reactstrap";
// ** Config
import themeConfig from "@configs/themeConfig";
import { useState, Fragment } from "react";

import { useDispatch } from "react-redux";

import { inviteMultipleMembers } from "@store/workspaces";
import AsyncSelect from "react-select/async";
import { selectThemeColors } from "@utils";
import { Link } from "react-router-dom";

import Avatar from "@components/avatar";

import axios from "axios";

axios.defaults.withCredentials = true;

const InviteUsers = () => {
  const [formSubmissionLoader, setFormSubmissionLoader] = useState(false);
  const dispatch = useDispatch();
  const [workspaceQuery, setWorkspaceQuery] = useState("");
  const [invitations, setInvitations] = useState([
    {
      email: "",
      workspace: null,
      emailError: false,
      workspaceError: false,
    },
  ]);

  const onSubmit = () => {
    let valid = true;

    const payload = invitations.map((invitation) => {
      if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(invitation.email)) {
        invitation.emailError = true;
        valid = false;
      } else {
        invitation.emailError = false;
      }

      if (!invitation.workspace) {
        invitation.workspaceError = true;
        valid = false;
      } else {
        invitation.workspaceError = false;
      }

      return invitation;
    });

    if (valid) {
      setInvitations(payload);
      const invitationArray = payload.map((invitation) => {
        return { email: invitation.email, workspace: invitation.workspace.id };
      });

      setFormSubmissionLoader(true);
      dispatch(inviteMultipleMembers({ invitations: invitationArray })).then(
        () => {
          setFormSubmissionLoader(false);
          setInvitations([
            {
              email: "",
              workspace: null,
              emailError: false,
              workspaceError: false,
            },
          ]);
        }
      );
    } else {
      setInvitations(payload);
    }
  };

  const loadWorkspacesOptions = async () => {
    const res = await axios.post(
      `${process.env.REACT_APP_API_ENDPOINT}/api/workspaces`,
      {
        q: workspaceQuery,
        perPage: 10,
        page: 1,
      }
    );
    const workspaces = res.data.workspaces.map((workspace) => {
      return {
        id: workspace.id,
        value: workspace.name,
        label: workspace.name,
        logo: workspace.logo,
      };
    });
    return workspaces;
  };

  const handleWorkspaceInputChange = (newValue) => {
    setWorkspaceQuery(newValue);
  };

  const formatOptionLabel = (workspace) => {
    return (
      <div className="d-flex align-items-center">
        {workspace.logo && workspace.logo.length ? (
          <Avatar className="me-1" img={workspace.logo} size="sm" />
        ) : (
          <Avatar
            initials
            className="me-1"
            color={"light-primary"}
            content={workspace.label}
            imgWidth="24"
            imgHeight="24"
            size="sm"
          />
        )}
        {workspace.label}
      </div>
    );
  };

  return (
    <Row>
      <Col className="mx-auto vh-100" md={8}>
        <div className="height-100 d-flex justify-content-center align-items-center">
          <img height={22} src={themeConfig.app.appLogoImage} alt="logo" />
          <h2 className="brand-text text-primary ms-1 mb-0">CallCloud</h2>
        </div>

        <Fragment>
          <Card>
            <CardHeader className="border-bottom">
              <CardTitle tag="h4">Invite users to workspaces</CardTitle>
            </CardHeader>
            <CardBody className="py-2 my-25">
              <Form className="mt-2 pt-50">
                {invitations.map((invitation, index) => {
                  return (
                    <Row key={index}>
                      <Col sm="4" className="mb-1">
                        <Label className="form-label" for={`email-${index}`}>
                          Email
                        </Label>
                        <Input
                          id={`email-${index}`}
                          placeholder="john@gmail.com"
                          invalid={invitation.emailError}
                          value={invitation.email}
                          onChange={(e) => {
                            const tempInvitations = invitations.map(
                              (invitation, i) => {
                                if (i === index) {
                                  invitation.email = e.target.value;
                                }
                                return invitation;
                              }
                            );

                            setInvitations(tempInvitations);
                          }}
                        />

                        <FormFeedback>Please enter a valid Email</FormFeedback>
                      </Col>

                      <Col sm="4" className="mb-1">
                        <Label className="form-label" for="workspace">
                          Workspace
                        </Label>
                        <AsyncSelect
                          formatOptionLabel={formatOptionLabel}
                          defaultOptions
                          isClearable={false}
                          // prettier-ignore
                          value={invitation.workspace}
                          name="workspace"
                          className="react-select"
                          id="workspaceInput"
                          placeholder="Type to find"
                          classNamePrefix="select"
                          onChange={(workspace) => {
                            const tempInvitations = invitations.map(
                              (invitation, i) => {
                                if (i === index) {
                                  invitation.workspace = workspace;
                                }
                                return invitation;
                              }
                            );

                            setInvitations(tempInvitations);
                          }}
                          theme={selectThemeColors}
                          loadOptions={loadWorkspacesOptions}
                          onInputChange={handleWorkspaceInputChange}
                          noOptionsMessage={(input) => {
                            // prettier-ignore
                            return input.inputValue.length ? `No match found for ${input.inputValue}!` : ``;
                          }}
                        />
                        {invitation.workspaceError && (
                          <FormFeedback style={{ display: "block" }}>
                            Please select Workspace
                          </FormFeedback>
                        )}
                      </Col>
                      <Col
                        sm="2"
                        md="ms-2"
                        className="d-flex align-items-center"
                      >
                        <div className="">
                          {index === invitations.length - 1 ? (
                            <Button
                              onClick={() => {
                                const tempInvitations = [...invitations];
                                tempInvitations.push({
                                  email: "",
                                  emailError: false,
                                  workspace: null,
                                  workspaceError: false,
                                });
                                setInvitations(tempInvitations);
                              }}
                              className="me-1"
                              color="primary"
                              size="sm"
                            >
                              Add More
                            </Button>
                          ) : (
                            <Button
                              onClick={() => {
                                const tempInvitations = invitations.filter(
                                  (invitation, i) => {
                                    return i !== index;
                                  }
                                );

                                setInvitations(tempInvitations);
                              }}
                              className="me-1"
                              color="secondary"
                              size="sm"
                              outline
                            >
                              &nbsp;Remove&nbsp;
                            </Button>
                          )}
                        </div>
                      </Col>
                    </Row>
                  );
                })}

                <Col className="mt-2" sm="12">
                  <Link to="/dashboard">
                    <Button className="me-1" color="secondary" outline>
                      Go to Dashboard
                    </Button>
                  </Link>

                  <Button onClick={(e) => onSubmit(e)} color="primary">
                    {
                      // prettier-ignore
                      invitations.length > 1 ? "Send Invitations" : "Send Invitation"
                    }
                    {formSubmissionLoader && (
                      <Spinner
                        style={{ marginLeft: "5px" }}
                        size={"sm"}
                        color="white"
                      />
                    )}
                  </Button>
                </Col>
              </Form>
            </CardBody>
          </Card>
        </Fragment>
      </Col>
    </Row>
  );
};

export default InviteUsers;
