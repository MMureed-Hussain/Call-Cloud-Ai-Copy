/* eslint-disable */
import { useState, useMemo } from "react";
import Sidebar from "@components/sidebar";
import {
    Button,
    Label,
    Form,
    FormFeedback,
    Spinner,
    FormGroup,
} from "reactstrap";

// ** Store & Actions
import { useDispatch, useSelector } from "react-redux";
import { clonePipelines, setErrors } from "../../../redux/pipelines";
import Select from "react-select"
import { selectThemeColors } from '@utils'

export default ({ open, toggleSidebar }) => {
    const [formSubmissionLoader, setFormSubmissionLoader] = useState(false);
    const [selectedWorkspace, setSelectedWorkspace] = useState(null);
    //store
    const dispatch = useDispatch();
    const errors = useSelector((state) => state.pipelines.errors);
    const currentWorkspace = useSelector(state => state.workspaces.currentWorkspace);
    const workspaces = useSelector( state => state.workspaces.workspaces);

    const workspaceOptions = useMemo(() => {
        return workspaces.filter(w => w.id !== currentWorkspace.id).map(w => ({ value: w.id, label: w.name }));
    }, [workspaces]);

    const handleSubmit = (event) => {
        event.preventDefault();
        setFormSubmissionLoader(true);
        dispatch(setErrors({}))
        dispatch(clonePipelines({
            workspace: selectedWorkspace?.value,
            current_workspace: currentWorkspace.id
        })).then(res => {
            setFormSubmissionLoader(false);
            toggleSidebar();
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
                <FormGroup>
                    <Label className="form-label" for="title">
                        Workspace<span className="text-danger">*</span>
                    </Label>
                    <Select
                        value={selectedWorkspace}
                        theme={selectThemeColors}
                        classNamePrefix="select"
                        className={
                            errors.has("workspace")
                                ? "is-invalid react-select"
                                : "react-select"
                        }
                        placeholder="Select workspace"
                        options={workspaceOptions}
                        onChange={setSelectedWorkspace}
                    />
                    {errors.has("workspace") && (
                        <FormFeedback>{errors.get("workspace")}</FormFeedback>
                    )}
                </FormGroup>
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
