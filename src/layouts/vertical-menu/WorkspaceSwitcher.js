import React, { useState } from "react";

import {
  Button,
  Popover,
  PopoverHeader,
  PopoverBody,
  Input,
  Label,
  Col,
} from "reactstrap";

import axios from "axios";
axios.defaults.withCredentials = true;

import { useSelector, useDispatch } from "react-redux";
import { storeCurrentWorkspace } from "@store/workspaces";
// import { updateProfile } from "@store/auth";
import AsyncSelect from "react-select/async";

import Avatar from "@components/avatar";

import { selectThemeColors } from "@utils";

import { useNavigate, Link } from "react-router-dom";

const WorkspaceSwitcher = () => {
  //   const [popoverOpen, setPopoverOpen] = useState(false);

  const workspaceStore = useSelector((state) => state.workspaces);
  const dispatch = useDispatch();

  const [workspaceQuery, setWorkspaceQuery] = useState("");
  const [popoverOpen, setPopoverOpen] = useState(false);

  const navigate = useNavigate();

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
    <React.Fragment>
      <div>
        <Button
          style={{ width: "100%" }}
          color="primary"
          outline
          id="controlledPopover"
        >
          {workspaceStore.currentWorkspace &&
          workspaceStore.currentWorkspace.logo &&
          workspaceStore.currentWorkspace.logo.length ? (
            <Avatar
              className="me-1"
              img={workspaceStore.currentWorkspace.logo}
              // width="32"
              // height="32"
              size="sm"
            />
          ) : (
            <Avatar
              initials
              className="me-1"
              color={"light-primary"}
              size="sm"
              content={
                // prettier-ignore
                workspaceStore.currentWorkspace ? workspaceStore.currentWorkspace.name : "No Workspace"
              }
            />
          )}
          {
            // prettier-ignore
            workspaceStore.currentWorkspace ? workspaceStore.currentWorkspace.name : "No workspace"
          }
        </Button>
        <Popover
          // width={"500px"}
          style={{ width: "276px" }}
          placement={window.innerWidth < 500 ? "bottom" : "right"}
          target="controlledPopover"
          isOpen={popoverOpen}
          toggle={() => setPopoverOpen(!popoverOpen)}
        >
          <PopoverHeader>Switch Workspace</PopoverHeader>
          <PopoverBody>
            {/* <div className="d-flex align-items-center mb-sm-0 mb-1 me-1"> */}
            <Link to="/workspaces" onClick={() => setPopoverOpen(false)}>
              <small>See all workspaces</small>
            </Link>
            <Col>
              <Label className="form-label" for="workspaceInput">
                Workspace
              </Label>
              <AsyncSelect
                formatOptionLabel={formatOptionLabel}
                defaultOptions
                isClearable={false}
                // prettier-ignore
                value={workspaceStore.currentWorkspace ? workspaceStore.currentWorkspace.name : "No workspace"}
                name="workspace"
                className="react-select"
                id="workspaceInput"
                classNamePrefix="select"
                onChange={(workspace) => {
                  console.log(workspace);
                  dispatch(
                    storeCurrentWorkspace({
                      workspace: {
                        id: workspace.id,
                        name: workspace.value,
                        logo: workspace.logo,
                      },
                    })
                  );
                  navigate(`/workspace/${workspace.id}`);
                  setPopoverOpen(false);
                }}
                theme={selectThemeColors}
                loadOptions={loadWorkspacesOptions}
                onInputChange={handleWorkspaceInputChange}
                noOptionsMessage={(input) => {
                  console.log("input", input);
                  // prettier-ignore
                  return input.inputValue.length ? `No match found for ${input.inputValue}!` : ``;
                }}
              />
            </Col>
            {/* </div> */}
          </PopoverBody>
        </Popover>
      </div>
    </React.Fragment>
  );
};

export default WorkspaceSwitcher;
