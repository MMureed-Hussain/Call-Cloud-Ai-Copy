/* eslint-disable */
import { useState, useMemo } from "react";
import Sidebar from "@components/sidebar";
import {
    Button,
    Label,
    Form,
    Spinner,
    FormGroup,
} from "reactstrap";

// ** Store & Actions
import { useSelector } from "react-redux";
import Select from "react-select"
import { selectThemeColors } from '@utils'

export default ({ open, toggleSidebar, targetAction }) => {
    const [formSubmissionLoader, setFormSubmissionLoader] = useState(false);
    const [selectedWorkspace, setSelectedWorkspace] = useState(null);
    //store
    const currentWorkspace = useSelector(state => state.workspaces.currentWorkspace);
    const workspaces = useSelector( state => state.workspaces.workspaces);

    const workspaceOptions = useMemo(() => {
        return workspaces.filter(w => w.id !== currentWorkspace.id).map(w => ({ value: w.id, label: w.name }));
    }, [workspaces]);

    const handleSubmit = (event) => {
        event.preventDefault();
        setFormSubmissionLoader(true);
        targetAction({
            workspace: selectedWorkspace?.value,
            current_workspace: currentWorkspace.id
        }).then(res => {
            setFormSubmissionLoader(false);
            if (res) {
                toggleSidebar();
            }
        })
    };

    return (
        <Sidebar
            size="lg"
            open={open}
            title={"Clone pipelines"}
            headerClassName="mb-1"
            contentClassName="pt-0"
            toggleSidebar={toggleSidebar}
        >
            <Form onSubmit={handleSubmit}>
                <div className="mb-1">
                    <Label className="form-label" for="title">
                        Workspace<span className="text-danger">*</span>
                    </Label>
                    <Select
                        value={selectedWorkspace}
                        theme={selectThemeColors}
                        classNamePrefix="select"
                        className="react-select"
                        placeholder="Select workspace"
                        options={workspaceOptions}
                        onChange={setSelectedWorkspace}
                    />
                </div>
                <Button className="me-1" color="primary">
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
