import React, { useState, useEffect } from "react"
import {
    Card,
    Form,
    Input,
    Label,
    Col,
    FormGroup,
    CardBody,
    Button
} from "reactstrap";
import Recorder from "./components/Recorder";

export default () => {
    const [audioDetails, setAudioDetails] = useState({
        url: null,
        blob: null,
        chunks: [],
        duration: {
            h: 0,
            m: 0,
            s: 0
        }
    });
    const [phone, setPhone] = useState("");
    const [note, setNote] = useState("");
    //   const [tags, setTags] = useState("");

    useEffect(() => {
        return () => {
            //todo remove event listeners
        }
    }, [audioDetails])

    return (
        <Card>
            <Col md="8" sm="12">
                <Form>
                    <CardBody>
                        <FormGroup>
                            <Label className="form-label" for="title">
                                Phone Number<span className="text-danger">*</span>
                            </Label>
                            <Input
                                id="phone"
                                placeholder="Enter phone number"
                                value={phone}
                                onChange={(e) => {
                                    setPhone(e.target.value);
                                }}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label className="form-label" for="title">
                                Note<span className="text-danger">*</span>
                            </Label>
                            <Input
                                id="note"
                                placeholder="Enter note"
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label className="form-label" for="title">
                                Voice<span className="text-danger">*</span>
                            </Label>
                            <Recorder audioDetails={audioDetails} setAudioDetails={setAudioDetails} />
                        </FormGroup>
                    </CardBody>
                </Form>
            </Col>
        </Card>
    );
};
