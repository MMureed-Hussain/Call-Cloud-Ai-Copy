/* eslint-disable */
import React, { useState } from "react";

import
{
  Button,
  Popover,
  UncontrolledPopover,
  PopoverHeader,
  PopoverBody,
  Input,
  Label,
  Col,
} from "reactstrap";

import axios from "axios";
axios.defaults.withCredentials = true;

import { useSelector, useDispatch } from "react-redux";
import
{
  storeCurrentWorkspace,
  markWorkspaceAsAccessedNow,
  recentlyAccessedWorkspaces,
} from "@store/workspaces";
// import { updateProfile } from "@store/auth";
import AsyncSelect from "react-select/async";

import Avatar from "@components/avatar";

import { selectThemeColors } from "@utils";

import { useNavigate, Link } from "react-router-dom";

const WorkspaceSwitcher = () =>
{
  //   const [popoverOpen, setPopoverOpen] = useState(false);

  const workspaceStore = useSelector((state) => state.workspaces);
  const authStore = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [workspaceQuery, setWorkspaceQuery] = useState("");
  const [popoverOpen, setPopoverOpen] = useState(true);

  const navigate = useNavigate();

  const loadWorkspacesOptions = async () =>
  {
    const res = await axios.post(
      `${process.env.REACT_APP_API_ENDPOINT}/api/workspaces`,
      {
        q: workspaceQuery,
        perPage: 10,
        page: 1,
      }
    );
    const workspaces = res.data.workspaces.map((workspace) =>
    {
      return {
        id: workspace.id,
        value: workspace.name,
        label: workspace.name,
        logo: workspace.logo,
      };
    });
    return workspaces;
  };

  const handleWorkspaceInputChange = (newValue) =>
  {
    setWorkspaceQuery(newValue);
  };

  const formatOptionLabel = (workspace) =>
  {
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

  const handleWorkSpaceOnChange = (workspace) =>
  {
    dispatch(
      storeCurrentWorkspace({
        workspace: {
          id: workspace.id,
          name: workspace.value,
          logo: workspace.logo,
        },
      })
    );

    dispatch(
      markWorkspaceAsAccessedNow({ id: workspace.id })
    ).then(() =>
    {
      dispatch(recentlyAccessedWorkspaces());
    });

    navigate(`/workspace/${workspace.id}/users`);
    setPopoverOpen(false);
    setTimeout(() => setPopoverOpen(true), 1000);
  }


  const handleWorkSpaceOnClick = (workspace) => 
  {
    console.log('onclick');
    dispatch(
      storeCurrentWorkspace({
        workspace: {
          id: workspace.id,
          name: workspace.name,
          logo: workspace.logo,
        },
      })
    );
    dispatch(
      markWorkspaceAsAccessedNow({ id: workspace.id })
    ).then(() =>
    {
      dispatch(recentlyAccessedWorkspaces());
    });
    setPopoverOpen(false);
    setTimeout(() => setPopoverOpen(true), 1000);
  }

  return (
    <React.Fragment>
      <div>
        <Button style={{ width: "100%", display: 'flex', justifyContent: 'left', alignItems: 'center' }} color="primary" outline id="controlledPopover">
          {workspaceStore.currentWorkspace &&
            workspaceStore.currentWorkspace.logo &&
            workspaceStore.currentWorkspace.logo.length ?
            <Avatar className="me-1" img={workspaceStore.currentWorkspace.logo} width="32" height="32" /> :
            <Avatar initials className="me-1" color={"light-primary"} width="32" height="32" content={workspaceStore.currentWorkspace ? workspaceStore.currentWorkspace.name : "No Workspace"} />
          }
          <span className="menu-item text-truncate">
            {workspaceStore.currentWorkspace ? workspaceStore.currentWorkspace.name : "No workspace"}
          </span>

        </Button>
        {popoverOpen && (
          <UncontrolledPopover
            // width={"500px"}
            style={{ width: "276px", borderRadius: "10px" }}
            placement={window.innerWidth < 500 ? "bottom" : "right"}
            target="controlledPopover"
            // isOpen={popoverOpen}
            // toggle={() => setPopoverOpen(!popoverOpen)}
            trigger="legacy"
          >
            <PopoverHeader className="popover-header d-flex align-items-center justify-content-between btn-gradient-primary disabled">
              Switch Workspace
              <Link
                className="btn btn-light text-primary btn-sm"
                to="/workspaces"
                onClick={() =>
                {
                  setPopoverOpen(false);
                  setTimeout(() => setPopoverOpen(true), 1000);
                }}
              >
                <small>See All</small>
              </Link>
            </PopoverHeader>

            <PopoverBody>
              {/* <div className="d-flex align-items-center mb-sm-0 mb-1 me-1"> */}

              <Col>
                {/* <Label className="form-label" for="workspaceInput">
                Workspace
              </Label> */}
                {authStore.user && authStore.user.role === "company" && (
                  <>
                    <Link to="/workspaces?action=create-workspace">
                      <Button
                        className="add-new-user w-100"
                        color="primary"
                        outline
                        onClick={() =>
                        {
                          setPopoverOpen(false);
                          setTimeout(() => setPopoverOpen(true), 1000);
                        }}
                      >
                        Create Workspace
                      </Button>
                    </Link>
                    <span className="divider"></span>
                  </>
                )}

                <AsyncSelect
                  formatOptionLabel={formatOptionLabel}
                  defaultOptions
                  isClearable={false}
                  // prettier-ignore
                  value={workspaceStore.currentWorkspace ? workspaceStore.currentWorkspace.name : "No workspace"}
                  name="workspace"
                  className="react-select"
                  id="workspaceInput"
                  placeholder="Type to find"
                  classNamePrefix="select"
                  onChange={workspace => handleWorkSpaceOnChange(workspace)}
                  theme={selectThemeColors}
                  loadOptions={loadWorkspacesOptions}
                  onInputChange={handleWorkspaceInputChange}
                  noOptionsMessage={(input) => input.inputValue.length ? `No match found for ${input.inputValue}!` : ``}
                />

                {
                  workspaceStore.recentlyAccessedWorkspaces &&
                  <div className="pt-2">
                    <p>Recent Workspaces</p>
                    {workspaceStore.recentlyAccessedWorkspaces.map(
                      (workspace, index) =>

                        <Link
                          key={index}
                          className="text-primary"
                          to={`/workspace/${workspace.id}/users`}
                          onClick={() => handleWorkSpaceOnClick(workspace)}
                        >
                          <div className="d-flex my-1 align-items-center">
                            {workspace.logo && workspace.logo.length ? (
                              <Avatar
                                className="me-1"
                                img={workspace.logo}
                                size="sm"
                              />
                            ) : (
                              <Avatar
                                initials
                                className="me-1"
                                color={"light-primary"}
                                content={workspace.name}
                                imgWidth="24"
                                imgHeight="24"
                                size="sm"
                              />
                            )}
                            {workspace.name}
                          </div>
                        </Link>
                    )}
                  </div>
                }
              </Col>
              {/* </div> */}
            </PopoverBody>
          </UncontrolledPopover>
        )}
      </div>
    </React.Fragment>
  );
};

export default WorkspaceSwitcher;
