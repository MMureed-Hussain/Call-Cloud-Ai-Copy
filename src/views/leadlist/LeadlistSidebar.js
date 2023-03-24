// ** React Import
import { useState, useEffect } from "react";

// ** Custom Components
import Sidebar from "@components/sidebar";
// ** Utils
import Creatable from "react-select/creatable";
import { postHeader, inviteLeadlist, updateLeadlistInWorkspace } from "@store/workspaces";

// ** Third Party Components

// ** Reactstrap Imports
import {
  Button,
  Label,
  Form,
  Input,
  FormFeedback,
  Spinner,
  FormGroup,
  InputGroup,
  Progress,
} from "reactstrap";
// ** Store & Actions
import { useDispatch } from "react-redux";

const SidebarLeadlist = ({
  open,
  toggleSidebar,
  refreshTable,
  leadlist,
  workspaceId,
}) => {
  // ** States
  const [leadName, setLeadName] = useState(leadlist ? leadlist.leadlist_name : "");
  const [fileHeaders, setFileHeaders] = useState();
  const [csvFile, setCsvFile] = useState("");
  const [progressBar, setProgressBar] = useState();
  const [buttonLoader, setButtonLoader] = useState(false);

  const [leadNameError, setLeadNameError] = useState(false);
  const [formSubmissionLoader, setFormSubmissionLoader] = useState(false);

  const inputHeaders = [];
  //select options
  const keyOptions = [
    {
      label: "Name",
      value: "Name",
      disabled: false,
    },
    {
      label: "Phone",
      value: "Phone",
      disabled: false,
    },
    {
      label: "Wesbite",
      value: "Website",
      disabled: false,
    },
    {
      label: "City",
      value: "City",
      disabled: false,
    },
    {
      label: "Country",
      value: "Country",
      disabled: false,
    },
  ];

  // ** Store Vars
  const dispatch = useDispatch();

  // ** Function to handle form submit
  const handleFileSave = (e) => {
    setProgressBar(50);
    e.preventDefault();
    let valid = true;
    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(leadName)) {
      valid = false;
      // setLeadNameError(true);
    } else {
      setLeadNameError(false);
    }

    if (!valid && csvFile) {
      setFormSubmissionLoader(true);
      if (leadlist) {
        dispatch(
          updateLeadlistInWorkspace({ 
            lead_name: leadName, 
            csvFile,
            leadlist_id: leadlist.id,
            workspace_id: workspaceId,
          }
          )
          ).then((result) => {
            setFormSubmissionLoader(false);
            if (!result.payload) {
              setCsvFile("");
              setProgressBar();
            } else {
              setLeadName("");
              setFileHeaders("");
              refreshTable();
              toggleSidebar();
            }
        });
      } else {
        dispatch(
          inviteLeadlist({ 
            leadName, csvFile, id: workspaceId })).then(
          (result) => {
            setProgressBar(100);
            setButtonLoader(false);
            setFileHeaders(result.payload.data.data);
            setFormSubmissionLoader(false);
            if (result.payload.data.data.lead_name) {
            setLeadName("");
            setFileHeaders("");
            refreshTable();
            toggleSidebar();
            }
          }
        );
      }
    }
  };
  // Create select option
  const createOption = (label) => ({
    label,
    value: label,
    disabled: false,
  });
  // populate new option into keyOptions
  const handleCreateOption = (value) => {
    const newOption = createOption(value);

    keyOptions.push(newOption);
  };
  //close sidebar
  const handleSidebarClosed = () => {
    setLeadName("");
    setFileHeaders("");
    setLeadNameError(false);
  };
  //submit mapped headers
  const handleHeadersSubmit = () => {
    toggleSidebar();
    dispatch(postHeader({ data: inputHeaders }));
  };
  //populate inputHeaders
  useEffect(() => {
    if (fileHeaders) {
      fileHeaders.map((data) => {
        inputHeaders.push({
          internal_header: data.header,
          id: data.id,
          external_header: data.header,
        });
      });
    }
  }, [fileHeaders]);

  return (
    <Sidebar
      size="lg"
      open={open}
      title="New Lead List"
      headerClassName="mb-1"
      contentClassName="pt-0"
      toggleSidebar={toggleSidebar}
      onClosed={handleSidebarClosed}
    >
      <div className="mb-1">
        <Label className="form-label" for="leadlistName">
          Leadlist Name
          <span className="text-danger">*</span>
        </Label>

        <Input
          id="leadlistName"
          placeholder=" Please enter Leadlist Name"
          invalid={leadNameError}
          value={leadName}
          required
          // disabled={leadlist}
          onChange={(e) => setLeadName(e.target.value)}
        />

        <FormFeedback>Please enter Leadlist Name</FormFeedback>
      </div>
      <div className="mb-1">
        <Label className="form-label" for="file">
          File
        </Label>

        <Input
          type={"file"}
          accept={".csv"}
          id={"csvInput"}
          placeholder=""
          name="file"
          onChange={(e) => {
            setCsvFile(e.target.files[0]);
            setButtonLoader(true);
          }}
        />
        <div>
          {progressBar && (
            <Progress className="mt-1" striped value={progressBar} />
          )}
          {buttonLoader && (
            <Button
              type="submit"
              className="me-1 mt-1"
              color="primary"
              onClick={(e) => {
                handleFileSave(e);
              }}
            >
              Upload
            </Button>
          )}
        </div>
      </div>

      <div className="d-flex justify-content-between">
        <div className="mb-1 w-100">
          {fileHeaders && (
            <div className="w-100">
              <Label
                className="form-label"
                style={{ width: "50%" }}
                for="Cfeild"
              >
                Internal Headers
              </Label>
              <Label className="form-label" for="feild">
                External Headers
              </Label>
            </div>
          )}
          <div className="mb-1">
            <Form onSubmit={handleHeadersSubmit}>
              <div>
                {fileHeaders?.map((fields, index) => (
                  <FormGroup key={index}>
                    <div className="d-flex flex-row">
                      <Input
                        disabled={true}
                        value={fields.header}
                        className="w-40 "
                        style={{ width: "45%", marginRight: "10px" }}
                      ></Input>

                      <div style={{ width: "45%" }}>
                        <Creatable
                          name={fields.header}
                          isClearable={false}
                          options={keyOptions}
                          className="react-select w-40 pl-3"
                          classNamePrefix="select"
                          isOptionDisabled={(option) => option.disabled}
                          placeholder="Create Option"
                          onCreateOption={handleCreateOption}
                          onChange={(e) => {
                            const index = inputHeaders.findIndex(
                              (x) => x.id === fields.id
                            );
                            const key = keyOptions.findIndex(
                              (x) => x.value === e.value
                            );
                            let prevKey;
                            const prev = inputHeaders[index].external_header;
                            if (prev.length > 0) {
                              prevKey = keyOptions.findIndex((x) => x.value === prev);
                              if (prevKey >= 0) {
                                keyOptions[prevKey].disabled = false;
                              }
                              inputHeaders[index].external_header = e.value;
                              keyOptions[key].disabled = true;
                            } else {
                              inputHeaders[index].external_header = e.value;
                              keyOptions[key].disabled = true;
                            }
                          }}
                        />
                      </div>
                    </div>
                  </FormGroup>
                ))}
              </div>
              {fileHeaders && (
                <Button type="submit" className="me-1" color="primary">
                  Submit
                  {formSubmissionLoader && (
                    <Spinner
                      style={{ marginLeft: "5px" }}
                      size={"sm"}
                      color="white"
                    />
                  )}
                </Button>
              )}
              <Button
                type="reset"
                color="secondary"
                outline
                onClick={toggleSidebar}
              >
                Cancel
              </Button>
            </Form>
          </div>
        </div>
      </div>
    </Sidebar>
  );
};
export default SidebarLeadlist;
