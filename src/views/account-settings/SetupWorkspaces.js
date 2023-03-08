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
  Badge,
} from "reactstrap";
// ** Config
import themeConfig from "@configs/themeConfig";
import { useState, Fragment } from "react";

import { useSelector, useDispatch } from "react-redux";

import { addMultipleWorkspaces, getData } from "@store/workspaces";

import { Link } from "react-router-dom";

const SetupWorkspaces = () => {
  const [formSubmissionLoader, setFormSubmissionLoader] = useState(false);
  const [newWorkspaces, setNewWorkspaces] = useState([
    {
      name: "",
      error: false,
    },
  ]);

  const workspaceStore = useSelector((state) => state.workspaces);
  const dispatch = useDispatch();

  const refreshCount = () => {
    dispatch(
      getData({
        sort: "disc",
        sortColumn: "id",
        q: "",
        page: 1,
        perPage: 50,
      })
    );
  };

  const onSubmit = () => {
    let valid = true;

    const tempNewWorkspaces = newWorkspaces.map((workspace) => {
      if (!workspace.name) {
        workspace.error = true;
        valid = false;
      } else {
        workspace.error = false;
      }
      return workspace;
    });

    if (valid) {
      setFormSubmissionLoader(true);
      const names = newWorkspaces.map((workspace) => workspace.name);
      dispatch(addMultipleWorkspaces({ names })).then((result) => {
        setFormSubmissionLoader(false);
        if (result.payload.data.workspaces.length) {
          setNewWorkspaces([
            {
              name: "",
              error: false,
            },
          ]);
          refreshCount();
        }
      });
      return true;
    } else {
      setNewWorkspaces(tempNewWorkspaces);
      return false;
    }
  };

  return (
    <Row>
      <Col className="mx-auto" md={8}>
        <div className="height-100 d-flex justify-content-center align-items-center">
          <img height={22} src={themeConfig.app.appLogoImage} alt="logo" />
          <h2 className="brand-text text-primary ms-1 mb-0">CallCloud</h2>
        </div>

        <Fragment>
          <Card>
            <CardHeader className="border-bottom">
              <CardTitle tag="h4">Add a few workspaces</CardTitle>
            </CardHeader>
            <CardBody className="py-2 my-25">
              <h2>
                Current {workspaceStore.total > 1 ? "Workspaces" : "Workspace"}:{" "}
                {workspaceStore.total}
              </h2>

              {workspaceStore.workspaces.map((workspace) => {
                return (
                  <Badge
                    key={workspace.id}
                    color="primary"
                    className="m-1"
                    pill
                  >
                    {workspace.name}
                  </Badge>
                );
              })}

              <Form className="mt-2 pt-50">
                <Row>
                  {newWorkspaces.map((newWorkspace, index) => {
                    return (
                      <Col sm="7" key={index} className="mb-1">
                        <Label className="form-label" for={`name-${index}`}>
                          Name
                        </Label>
                        <div className="d-flex align-items-center justify-content-around">
                          <div className="flex-grow-1">
                            <Input
                              id={`name-${index}`}
                              placeholder="Some Workspace"
                              invalid={newWorkspace.error}
                              value={newWorkspace.name}
                              onChange={(e) => {
                                const name = e.target.value.replace(
                                  /(^\w{1})|(\s+\w{1})/g,
                                  (letter) => letter.toUpperCase()
                                );
                                // setName(name);
                                const tempNewWorkspaces = newWorkspaces.map(
                                  (newWorkspace, i) => {
                                    if (i === index) {
                                      newWorkspace.name = name;
                                    }
                                    return newWorkspace;
                                  }
                                );

                                setNewWorkspaces(tempNewWorkspaces);
                              }}
                            />
                          </div>
                          <div className="ms-2">
                            {index === newWorkspaces.length - 1 ? (
                              <Button
                                onClick={() => {
                                  const tempNewWorkspaces = [...newWorkspaces];
                                  tempNewWorkspaces.push({
                                    name: "",
                                    error: false,
                                  });
                                  setNewWorkspaces(tempNewWorkspaces);
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
                                  const tempNewWorkspaces =
                                    newWorkspaces.filter((newWorkspace, i) => {
                                      return i !== index;
                                    });

                                  setNewWorkspaces(tempNewWorkspaces);
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
                        </div>
                        {newWorkspace.error && (
                          <FormFeedback style={{ display: "block" }}>
                            Please enter a valid Name
                          </FormFeedback>
                        )}
                      </Col>
                    );
                  })}

                  <Col className="mt-2" sm="12">
                    <Link to="/invite-users">
                      <Button className="me-1" color="secondary" outline>
                        Next
                      </Button>
                    </Link>

                    <Button onClick={(e) => onSubmit(e)} color="primary">
                      {
                        // prettier-ignore
                        newWorkspaces.length > 1 ? "Create Workspaces" : "Create Workspace"
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
                </Row>
              </Form>
            </CardBody>
          </Card>
        </Fragment>
      </Col>
    </Row>
  );
};

export default SetupWorkspaces;
