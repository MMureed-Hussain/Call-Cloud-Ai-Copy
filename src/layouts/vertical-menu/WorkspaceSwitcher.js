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
      };
    });
    return workspaces;
  };

  const handleWorkspaceInputChange = (newValue) => {
    setWorkspaceQuery(newValue);
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
          {
            // prettier-ignore
            workspaceStore.currentWorkspace ? workspaceStore.currentWorkspace.name : "No workspace"
          }
        </Button>
        <Popover
          // width={"500px"}
          style={{ width: "276px", borderRadius:"10px" }}
          placement={window.innerWidth < 500 ? "bottom" : "right"}
          target="controlledPopover"
          isOpen={popoverOpen}
          toggle={() => setPopoverOpen(!popoverOpen)}
        >
          <PopoverHeader className="popover-header d-flex align-items-center justify-content-between btn-gradient-primary disabled">
            Switch Workspace
            <Link 
              className="btn btn-light text-primary btn-sm"
              to="/workspaces" 
              
              onClick={() => setPopoverOpen(false)}>
                
              <small>See All</small>
            </Link>
          </PopoverHeader>

          <PopoverBody>
            {/* <div className="d-flex align-items-center mb-sm-0 mb-1 me-1"> */}

            <Col>
              {/* <Label className="form-label" for="workspaceInput">
                Workspace
              </Label> */}
              <Button
                className="add-new-user w-100"
                color="primary"
                outline 
                onClick={() => {
                  setEditWorkspace(null);
                  toggleSidebar();
                }}
              >
                Create Workspace
              </Button>
              <span class="divider"></span>
              <AsyncSelect
                defaultOptions
                isClearable={false}
                // prettier-ignore
                value={workspaceStore.currentWorkspace ? workspaceStore.currentWorkspace.name : "No workspace"}
                name="workspace"
                className="react-select"
                id="workspaceInput"
                placeholder="Type to find"
                classNamePrefix="select"
                onChange={(workspace) => {
                  console.log(workspace);
                  dispatch(
                    storeCurrentWorkspace({
                      workspace: { id: workspace.id, name: workspace.value },
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
