// ** React Import
import { useState } from "react";

// ** Custom Components
import Sidebar from "@components/sidebar";

// ** Utils
// import { selectThemeColors } from "@utils";

// ** Third Party Components

// ** Reactstrap Imports
import {
  Button,
  Label,
  FormText,
  Form,
  Input,
  FormFeedback,
  Spinner,
} from "reactstrap";

// ** Store & Actions
import { addWorkspace, updateWorkspace } from "@store/workspaces";
import { useDispatch } from "react-redux";

const SidebarWorkspace = ({
  open,
  toggleSidebar,
  refreshTable,
  workspace = null,
}) => {
  // ** States
  console.log("workspace", workspace);
  const [name, setName] = useState(() => {
    return workspace ? workspace.name : "";
  });
  const [nameError, setNameError] = useState(false);
  const [formSubmissionLoader, setFormSubmissionLoader] = useState(false);

  // const [plan, setPlan] = useState("basic");
  // const [role, setRole] = useState("subscriber");

  // ** Store Vars
  const dispatch = useDispatch();

  // ** Function to handle form submit
  const onSubmit = (e) => {
    e.preventDefault();

    let valid = true;

    if (!name) {
      valid = false;
      setNameError(true);
    } else {
      setNameError(false);
    }

    if (valid) {
      setFormSubmissionLoader(true);

      if (workspace) {
        dispatch(updateWorkspace({ name, id: workspace.id })).then((result) => {
          setFormSubmissionLoader(false);
          if (result.payload.data.workspace) {
            setName("");
            refreshTable();
            toggleSidebar();
          }
        });
      } else {
        dispatch(addWorkspace({ name })).then((result) => {
          setFormSubmissionLoader(false);
          if (result.payload.data.workspace) {
            setName("");
            refreshTable();
            toggleSidebar();
          }
        });
      }
    }
  };

  const handleSidebarClosed = () => {
    setName("");
    setNameError(false);
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
          <Label className="form-label" for="name">
            Name <span className="text-danger">*</span>
          </Label>

          <Input
            id="name"
            placeholder="ClickMage"
            invalid={nameError}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <FormFeedback>Please enter a valid Workspace Name</FormFeedback>
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

export default SidebarWorkspace;
