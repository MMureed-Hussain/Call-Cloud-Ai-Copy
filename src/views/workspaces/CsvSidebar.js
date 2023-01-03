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

import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

// ** Store & Actions
import { addWorkspace, csvWorkspaceImport } from "@store/workspaces";
import { useDispatch } from "react-redux";

const SidebarWorkspace = ({
  open,
  toggleSidebar,
  refreshTable,
  workspace = null,
}) => {
  // ** States
  console.log("workspace", workspace);
  const [file, setFile] = useState("");
  // const [nameError, setNameError] = useState(false);
  // const [formSubmissionLoader, setFormSubmissionLoader] = useState(false);

  // const [plan, setPlan] = useState("basic");
  // const [role, setRole] = useState("subscriber");

  const [avatarFile, setAvatarFile] = useState(null);
  // prettier-ignore
  const [avatar, setAvatar] = useState(workspace && workspace.logo ? workspace.logo : require("@src/assets/images/avatars/workspace-logo.jpeg").default);

  // const [cropper, setCropper] = useState(null);


  // ** Store Vars
  const dispatch = useDispatch();

  const submitForm = (payload) => {
    console.log("payload", payload);
    if (workspace) {
     
      payload.id = workspace.id;

      // const file = 
      dispatch(csvWorkspaceImport({payload})).then((result) => {
        setFormSubmissionLoader(false);
        if (result.payload.data.workspace) {
          setFile("");
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
  };

  // ** Function to handle form submit
  const onSubmit = (e) => {
    e.preventDefault();

    let valid = true;

    if (!file) {
      valid = false;
      // setNameError(true);
    } else {
      // setNameError(false);
    }

    if (valid) {
      setFormSubmissionLoader(true);

      const payload = { workspace, file };
      // if (avatarFile) {
      //   cropper.getCroppedCanvas().toBlob((blob) => {
      //     payload.id = new File([blob], "");
      //     submitForm(payload);
      //   }, "image/jpeg");
      // } else {
        submitForm(payload);
      // }
    }
  };

  const handleSidebarClosed = () => {
    setFile("");
    // setNameError(false);
  };

  const handleImgReset = () => {
    //prettier-ignore
    setAvatar(workspace && workspace.logo ? workspace.logo : require("@src/assets/images/avatars/workspace-logo.jpeg").default);
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
          {!avatarFile ? (
            <img
              className="rounded me-50 img-preview"
              src={avatar}
              alt="Generic placeholder image"
              height="100"
              width="100"
            />
          ) : (
            <div className="rounded">
              {/* <Cropper
                style={{ height: "150px", width: "60%" }}
                zoomTo={0}
                initialAspectRatio={1}
                src={avatar}
                viewMode={1}
                minCropBoxHeight={10}
                minCropBoxWidth={10}
                background={false}
                responsive={true}
                autoCropArea={1}
                checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
                onInitialized={(instance) => {
                  setCropper(instance);
                }}
                guides={true}
              /> */}
            </div>
          )}
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
              <Input type="file" onChange={onChange} hidden accept=".csv" />
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
            <p className="mb-0">Allowed csv only</p>
          </div>
        </div>
      </div>

      <Form>
      

        <Button onClick={(e) => onSubmit(e)} className="me-1" color="primary">
         Save
        </Button>
        <Button type="reset" color="secondary" outline onClick={toggleSidebar}>
          Cancel
        </Button>
      </Form>
    </Sidebar>
  );
};

export default SidebarWorkspace;
