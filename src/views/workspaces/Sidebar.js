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

  const [avatarFile, setAvatarFile] = useState(null);
  // prettier-ignore
  const [avatar, setAvatar] = useState(workspace && workspace.logo ? workspace.logo : require("@src/assets/images/avatars/avatar-blank.png").default);

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

      const payload = { name };
      if (avatarFile) {
        payload.logo = avatarFile;
      }

      if (workspace) {
        payload.id = workspace.id;
        dispatch(updateWorkspace(payload)).then((result) => {
          setFormSubmissionLoader(false);
          if (result.payload.data.workspace) {
            setName("");
            refreshTable();
            toggleSidebar();
          }
        });
      } else {
        dispatch(addWorkspace(payload)).then((result) => {
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

  const handleImgReset = () => {
    //prettier-ignore
    setAvatar(workspace.logo ? workspace.logo : require("@src/assets/images/avatars/avatar-blank.png").default);
    setAvatarFile(null);
  };

  const onChange = (e) => {
    if (!e.target.files.length) {
      console.log("return");
      return;
    }
    const reader = new FileReader(),
      files = e.target.files;

    reader.onload = function () {
      setAvatar(reader.result);
    };
    setAvatarFile(files[0]);
    reader.readAsDataURL(files[0]);
  };

  return (
    <Sidebar
      size="lg"
      open={open}
      title={workspace ? "Edit Workspace" : "New Workspace"}
      headerClassName="mb-1"
      contentClassName="pt-0"
      toggleSidebar={toggleSidebar}
      onClosed={handleSidebarClosed}
    >
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
              <Input type="file" onChange={onChange} hidden accept="image/*" />
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
            <p className="mb-0">Allowed JPG, GIF or PNG. Max size of 800kB</p>
          </div>
        </div>
      </div>

      <Form>
        <div className="mb-1 mt-2">
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
