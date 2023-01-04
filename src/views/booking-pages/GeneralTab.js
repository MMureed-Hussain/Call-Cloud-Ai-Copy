// ** React Import
import { Fragment, useState } from "react";

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
  Card,
  CardBody,
  InputGroup,
  InputGroupText,
} from "reactstrap";

import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { Link } from "react-router-dom";
import { Check, Copy } from "react-feather";

import toast from "react-hot-toast";

import axios from "axios";
axios.defaults.withCredentials = true;

// ** Store & Actions
// import { addWorkspace, updateWorkspace } from "@store/workspaces";
// import { useDispatch } from "react-redux";

const GeneralTab = ({ workspace = null }) => {
  // ** States
  console.log("workspace", workspace);
  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState(false);
  const [intro, setIntro] = useState("");
  const [introError, setIntroError] = useState(false);
  const [link, setLink] = useState("");
  const [linkError, setLinkError] = useState(false);
  const [formSubmissionLoader, setFormSubmissionLoader] = useState(false);

  const [avatarFile, setAvatarFile] = useState(null);
  // prettier-ignore
  const [avatar, setAvatar] = useState(workspace && workspace.logo ? workspace.logo : require("@src/assets/images/avatars/workspace-logo.jpeg").default);

  const [cropper, setCropper] = useState(null);
  const [copied, setCopied] = useState(false);

  // ** Store Vars
  //   const dispatch = useDispatch();

  const submitForm = (payload) => {
    setFormSubmissionLoader(true);
    payload.workspace_id = workspace.id;
    axios
      .post(
        `${process.env.REACT_APP_API_ENDPOINT}/api/create-booking-page`,
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((res) => {
        toast.success(res.data.message);
        setFormSubmissionLoader(false);
      })
      .catch((e) => {
        toast.error(e.response.data.message);
        setFormSubmissionLoader(false);
      });

    // if (workspace) {
    //   payload.id = workspace.id;
    //   dispatch(updateWorkspace(payload)).then((result) => {
    //     setFormSubmissionLoader(false);
    //     if (result.payload.data.workspace) {
    //       setName("");
    //       refreshTable();
    //       toggleSidebar();
    //     }
    //   });
    // } else {
    //   dispatch(addWorkspace(payload)).then((result) => {
    //     setFormSubmissionLoader(false);
    //     if (result.payload.data.workspace) {
    //       setName("");
    //       refreshTable();
    //       toggleSidebar();
    //     }
    //   });
    // }
  };

  // ** Function to handle form submit
  const onSubmit = (e) => {
    e.preventDefault();

    let valid = true;

    if (!title) {
      valid = false;
      setTitleError(true);
    } else {
      setTitleError(false);
    }
    if (!intro) {
      valid = false;
      setIntroError(true);
    } else {
      setIntroError(false);
    }

    if (!link) {
      valid = false;
      setLinkError(true);
    } else {
      setLinkError(false);
    }

    if (valid) {
      const payload = { title, intro, slug: link };
      if (avatarFile) {
        cropper.getCroppedCanvas().toBlob((blob) => {
          payload.logo = new File([blob], "logo.jpeg");
          submitForm(payload);
        }, "image/jpeg");
      } else {
        submitForm(payload);
      }
    }
  };

  //   const handleSidebarClosed = () => {
  //     setName("");
  //     setNameError(false);
  //   };

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
    <Fragment>
      <Card>
        <CardBody>
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
                  <Cropper
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
                  />
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
                  <Input
                    type="file"
                    onChange={onChange}
                    hidden
                    accept="image/*"
                  />
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
                <p className="mb-0">
                  Allowed JPG, GIF or PNG. Max size of 800kB
                </p>
              </div>
            </div>
          </div>

          <Form>
            <div className="mb-1 mt-2">
              <Label className="form-label" for="title">
                Booking Page Title <span className="text-danger">*</span>
              </Label>

              <Input
                id="title"
                placeholder="30 Mins Call"
                invalid={titleError}
                value={title}
                // onChange={(e) => setName(e.target.value)}

                onChange={(e) => {
                  const title = e.target.value.replace(
                    /(^\w{1})|(\s+\w{1})/g,
                    (letter) => letter.toUpperCase()
                  );
                  setTitle(title);
                }}
              />

              <FormFeedback>Please enter a valid Title</FormFeedback>
            </div>
            <div className="mb-1 mt-2">
              <Label className="form-label" for="link">
                Booking Page Link <span className="text-danger">*</span>
              </Label>

              <InputGroup>
                <InputGroupText className="bg-info">
                  https://callcloud.ai/booking/
                </InputGroupText>
                <Input
                  id="link"
                  placeholder="john-smith"
                  //   invalid={linkError}
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                />
                <InputGroupText
                  className="bg-info"
                  title={copied ? "copied" : "copy"}
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `https://callcloud.ai/booking/${link}`
                    );
                    toast.success("Link copied successfully!");
                    setCopied(true);
                    setTimeout(() => {
                      setCopied(false);
                    }, 3000);
                  }}
                  role={"button"}
                >
                  {!copied ? <Copy size={14} /> : <Check size={14} />}
                </InputGroupText>
              </InputGroup>
              {linkError && (
                <FormFeedback className="d-block">
                  Please enter a valid Link
                </FormFeedback>
              )}
            </div>
            <div className="mb-1 mt-2">
              <Label className="form-label" for="intro">
                Booking Page Intro <span className="text-danger">*</span>
              </Label>

              <Input
                id="intro"
                type="textarea"
                placeholder="Arrange 30 mins call"
                invalid={introError}
                value={intro}
                onChange={(e) => setIntro(e.target.value)}
              />

              <FormFeedback>Please enter a valid Intro</FormFeedback>
            </div>

            <Button
              onClick={(e) => onSubmit(e)}
              className="me-1"
              color="primary"
            >
              Add Booking Page
              {formSubmissionLoader && (
                <Spinner
                  style={{ marginLeft: "5px" }}
                  size={"sm"}
                  color="white"
                />
              )}
            </Button>
            <Link to={"/booking-pages"}>
              <Button type="reset" color="secondary" outline>
                Cancel
              </Button>
            </Link>
          </Form>
        </CardBody>
      </Card>
    </Fragment>
  );
};

export default GeneralTab;
