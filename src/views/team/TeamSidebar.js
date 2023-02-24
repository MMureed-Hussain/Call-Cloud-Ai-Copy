// ** React Import
import { useState, useEffect } from "react";

// ** Custom Components
import Sidebar from "@components/sidebar";
// ** Reactstrap Imports
import {
  Button,
  Label,
  Form,
  Input,
  FormFeedback,
  Spinner,
  FormGroup,
  ListGroupItem,
} from "reactstrap";
import Select from "react-select";
import { ReactSortable } from "react-sortablejs";

// ** Store & Actions
import {
  updateTeamInWorkspace,
  saveTeam,
  getUsers
} from "@store/workspaces";
import { useDispatch } from "react-redux";

const TeamSidebar = ({
  open,
  toggleSidebar,
  refreshTable,
  team,
  workspaceId,
}) => {
  const [teamName, setTeamName] = useState(team ? team.team_name : "");

  const [teamUsers, setTeamUsers] = useState([]);
  

  const [selectedTeamUsers, setSelectedTeamUsers] = useState(() => {
    return team ? team.users.map((item) => ({
          value: item.enc_id,
          label: ((item) => {
            let final = 'dummy user name';
            if (item.name) {
              final = item.name;
            } else if (item.first_name && item.last_name) {
              final = `${item.first_name} ${item.last_name}`;
            } else if (item.nickname) {
              final = `${item.nickname}`;
            }
            return final;
          })(item),
        })) : [];
  });
  const [teamError, setTeamError] = useState(false);
  const [formSubmissionLoader, setFormSubmissionLoader] = useState(false);

  const dispatch = useDispatch();
  const selectStyles = {
    multiValue: (styles) => ({
      ...styles,
      backgroundColor: '#433cd8'
    })
  };
  useEffect(() => {
    if (workspaceId && teamUsers.length === 0) {
      dispatch(
        getUsers({
          id: workspaceId,
          perPage: 50,
          page: 1
        })
        ).then(res => setTeamUsers(res.payload.data.users));
      }
  }, [workspaceId]);

  // ** Function to handle form submit
  const onSubmit = (e) => {
    e.preventDefault();

    const valid = true;
    if (valid) {
      setFormSubmissionLoader(true);

      if (team) {
        dispatch(
          updateTeamInWorkspace({ 
            team_name: teamName,
            teamUsers: selectedTeamUsers.map(user => user.value),
            team_id: team.id,
            workspace_id: team.workspace_id,

          })
        ).then((result) => {
          setFormSubmissionLoader(false);
          if (result.payload.data.team) {
            setTeamName("");
            setTeamUsers([]);
            refreshTable();
            toggleSidebar();
          }
        });
      } else {
        dispatch(
          saveTeam({
          id: workspaceId,
          team_name: teamName,
          users: selectedTeamUsers.map(item => item.value)
        })).then((result) => {
          console.log(result);
            setFormSubmissionLoader(false);
            if (result.payload.data.data.team_name) {
              setTeamName("");
              setTeamUsers([]);
              refreshTable();
              toggleSidebar();
            }
          }
        );
      }
    }
  };

  const handleSidebarClosed = () => {
    setTeamName("");
    setTeamUsers([]);
    setTeamError(false);
  };

  return (
    <Sidebar
      size="lg"
      open={open}
      title="New Team"
      headerClassName="mb-1"
      contentClassName="pt-0"
      toggleSidebar={toggleSidebar}
      onClosed={handleSidebarClosed}
    >
      <Form>
        <div className="mb-1">
          <Label className="form-label" for="quene-name">
            Team Name <span className="text-danger">*</span>
          </Label>

          <Input
            id="text"
            placeholder="Enter Team Name"
            invalid={teamError}
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
          />

          <FormFeedback>Please enter a valid Team Name</FormFeedback>
        </div>

        <div className="mb-1">
          <FormGroup>
            <Label className="form-label" for="select-user">
              Select user For Team
            </Label>

            <Select
              value={selectedTeamUsers}
              isMulti
              classNamePrefix="select"
              placeholder="Select User"
              options={teamUsers.map((item) => ({
                value: item.id,
                label: item.name,
              }))}
              onChange={(data) => { 
                setSelectedTeamUsers(data);
              }}
              styles={selectStyles}
            />
          </FormGroup>
        </div>

        <Button onClick={(e) => onSubmit(e)} className="me-1" color="primary">
          Submit
          {formSubmissionLoader && (
            <Spinner style={{ marginLeft: "5px" }} size={"sm"} color="white" />
          )}
        </Button>
        <Button type="reset" color="secondary" outline onClick={toggleSidebar}>
          Cancel
        </Button>
      </Form>
    </Sidebar>
  );
};

export default TeamSidebar;
