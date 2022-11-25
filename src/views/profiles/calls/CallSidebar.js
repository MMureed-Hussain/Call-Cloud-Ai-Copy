/* eslint-disable */
import { useState } from "react";
import Sidebar from "@components/sidebar";
import { Button, Label, Form, Input, FormFeedback, Spinner, FormGroup } from "reactstrap";

// ** Store & Actions
import { useDispatch, useSelector } from "react-redux";
import Recorder from '../UpdateOrCreate/components/Recorder';
import { TagsInput } from "react-tag-input-component";
import { useParams } from "react-router-dom";
import { createCall } from "../../../redux/profiles";

export default ({
    open,
    toggleSidebar,
}) => {
    // ** States
    const [audioDetails, setAudioDetails] = useState([
        {
            url: null,
            blob: null,
            chunks: [],
            duration: {
                h: 0,
                m: 0,
                s: 0,
            },
        }
    ]);
    const params = useParams();
    const [note, setNote] = useState("");
    const [tags, setTags] = useState([]);
    const [formSubmissionLoader, setFormSubmissionLoader] = useState(false);
    //store
    const dispatch = useDispatch();
    const errors = useSelector((state) => state.profiles.errors);

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append("note", note);
        formData.append("tags", tags);
        formData.append("voice", audioDetails.blob);
        formData.append("call_profile_id", params.id);
        setFormSubmissionLoader(true);
        dispatch(createCall({
            formData,
            id: params.id
        })).then(res => {
            setFormSubmissionLoader(false)
            if(res.payload.data){
                toggleSidebar();
            }
        })
    
    };

    const handleSidebarClosed = () => {
        setAudioDetails({
            url: null,
            blob: null,
            chunks: [],
            duration: {
                h: 0,
                m: 0,
                s: 0,
            },
        })
        setNote("");
        setTags([]);
    };

    return (
        <Sidebar
            size="lg"
            open={open}
            title="New Call"
            headerClassName="mb-1"
            contentClassName="pt-0"
            toggleSidebar={toggleSidebar}
            onClosed={handleSidebarClosed}
        >
            <Form onSubmit={handleSubmit} >
                <Recorder audioDetails={audioDetails} setAudioDetails={setAudioDetails}/>
                <FormGroup>
                    <Label className="form-label" for="title">
                        Tags<span className="text-danger">*</span>
                    </Label>
                    <TagsInput
                        value={tags}
                        onChange={setTags}
                        className={{
                            input: errors.has("tags")
                                ? "is-invalid form-control"
                                : "form-control"
                        }}
                        name="Tags"
                        placeHolder="Add tag"
                    />
                    {errors.has("tags") && (
                        <FormFeedback>{errors.get("tags")}</FormFeedback>
                    )}
                </FormGroup>
                <FormGroup>
                    <Label className="form-label" for="title">
                        Notes<span className="text-danger">*</span>
                    </Label>
                    <Input
                        placeholder="Enter Note here"
                        value={note}
                        className={
                            errors.has("note")
                                ? "is-invalid form-control"
                                : "form-control"
                        }
                        onChange={(e) => {
                            setNote(e.target.value);
                        }}
                    />
                    {errors.has("note") && (
                        <FormFeedback>{errors.get("note")}</FormFeedback>
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