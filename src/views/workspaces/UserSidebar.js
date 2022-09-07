// ** React Import
import { useState } from "react";

// ** Custom Components
import Sidebar from "@components/sidebar";

// ** Utils
// import { selectThemeColors } from "@utils";

// ** Third Party Components

// ** Reactstrap Imports
import { Button, Label, Form, Input, FormFeedback, Spinner } from "reactstrap";

// ** Store & Actions
import { inviteMember } from "@store/workspaces";
import { useDispatch } from "react-redux";

const SidebarUser = ({
  open,
  toggleSidebar,
  refreshTable,
  user = null,
  workspaceId,
}) => {
  // ** States
  console.log(workspaceId);
  const [email, setEmail] = useState(() => {
    return user ? user.email : "";
  });
  const [emailError, setEmailError] = useState(false);
  const [formSubmissionLoader, setFormSubmissionLoader] = useState(false);

  // const [plan, setPlan] = useState("basic");
  // const [role, setRole] = useState("subscriber");

  // ** Store Vars
  const dispatch = useDispatch();

  // ** Function to handle form submit
  const onSubmit = (e) => {
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
        // dispatch(inviteMember({ email, id: workspace.id })).then((result) => {
        //   setFormSubmissionLoader(false);
        //   if (result.payload.data.workspace) {
        //     setName("");
        //     refreshTable();
        //     toggleSidebar();
        //   }
        // });
      } else {
        dispatch(inviteMember({ email, id: workspaceId })).then((result) => {
          setFormSubmissionLoader(false);
          if (result.payload.data.user) {
            setEmail("");
            refreshTable();
            toggleSidebar();
          }
        });
      }
    }
  };

  const handleSidebarClosed = () => {
    setEmail("");
    setEmailError(false);
  };

  return (
    <Sidebar
      size="lg"
      open={open}
      title="New Workspace"
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
            onChange={(e) => setEmail(e.target.value)}
          />

          <FormFeedback>Please enter a valid Email</FormFeedback>
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

export default SidebarUser;
