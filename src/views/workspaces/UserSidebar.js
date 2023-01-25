// ** React Import
/* eslint-disable */
import { useState } from "react";

// ** Custom Components
import Sidebar from "@components/sidebar";
import Select from "react-select";
// ** Utils
// import { selectThemeColors } from "@utils";

// ** Third Party Components

// ** Reactstrap Imports
import { FormGroup, Button, Label, Form, Input, FormFeedback, Spinner } from "reactstrap";

// ** Store & Actions
import { inviteMember, updateMemberInWorkspace } from "@store/workspaces";
import { useDispatch } from "react-redux";

const SidebarUser = ({
  open,
  toggleSidebar,
  refreshTable,
  user = null,
  workspaceId,
  auth
}) =>
{
  // ** States
  const [email, setEmail] = useState(() =>
  {
    return user ? user.email : "";
  });

  const [nickname, setNickname] = useState(() =>
  {
    return user ? user.nickname : "";
  });
  const [emailError, setEmailError] = useState(false);
  const [formSubmissionLoader, setFormSubmissionLoader] = useState(false);

  // const [plan, setPlan] = useState("basic");  
  const [role, setRole] = useState(user ? user.userRole : 'member');
  const roleList = [{ value: 'admin', label: 'Admin' }, { value: 'manager', label: 'Manager' }, { value: 'member', label: 'Member' }];
  // ** Store Vars
  const dispatch = useDispatch();

  // ** Function to handle form submit
  const onSubmit = (e) =>
  {
    e.preventDefault();

    let valid = true;

    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      valid = false;
      setEmailError(true);
    } else {
      setEmailError(false);
    }

    if (valid) {
      setFormSubmissionLoader(true);

      if (user) {
        dispatch(
          updateMemberInWorkspace({ nickname, id: user.invitationId, role })
        ).then((result) =>
        {
          setFormSubmissionLoader(false);
          if (result.payload.data.user) {
            setEmail("");
            setNickname("");
            refreshTable();
            toggleSidebar();
          }
        });
      } else {
        dispatch(inviteMember({ email, nickname, id: workspaceId, role })).then(
          (result) =>
          {
            setFormSubmissionLoader(false);
            if (result.payload.data.user) {
              setEmail("");
              setNickname("");
              refreshTable();
              toggleSidebar();
            }
          }
        );
      }
    }
  };

  const handleSidebarClosed = () =>
  {
    setEmail("");
    setNickname("");
    setEmailError(false);
  };

  return (
    <Sidebar
      size="lg"
      open={open}
      title="New User"
      headerClassName="mb-1"
      contentClassName="pt-0"
      toggleSidebar={toggleSidebar}
      onClosed={handleSidebarClosed}
    >
      <Form>
        <div className="mb-1">
          <Label className="form-label" for="email">
            Email <span className="text-danger">*</span>
          </Label>

          <Input
            id="email"
            placeholder="john@gmail.com"
            invalid={emailError}
            value={email}
            disabled={user}
            onChange={(e) => setEmail(e.target.value)}
          />

          <FormFeedback>Please enter a valid Email</FormFeedback>
        </div>

        <div className="mb-1">
          <Label className="form-label" for="nickname">
            Nickname
          </Label>

          <Input
            id="nickname"
            placeholder="john"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        </div>

        {
          (role == 'admin' || auth.user.role == 'company') &&

          <FormGroup>
            <Label className="form-label" for="timezoneInput"> User Role </Label>
            <Select
              defaultValue={{ value: role, label: role.toUpperCase() }}
              className="react-select"
              classNamePrefix="select"
              onChange={e => setRole(e.value)}
              options={roleList}
            />

          </FormGroup>
        }

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

export default SidebarUser;
