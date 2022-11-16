import { useState } from 'react'
import { Card, Form, Input, Label, FormFeedback, Col, FormGroup, CardBody } from 'reactstrap';

export default () => {
    const [audioDetails, setAudioDetails] = useState({
        url: null,
        blob: null,
        chunks: null,
        duration: {
            h: 0,
            m: 0,
            s: 0
        }
    });

    const [phone, setPhone] = useState("");
    const [note, setNote] = useState("");
    const [tags, setTags] = useState("");

    const recordAudio = () => {
        return new Promise(resolve => {
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(stream => {
                    const mediaRecorder = new MediaRecorder(stream);
                    const audioChunks = [];

                    mediaRecorder.addEventListener("dataavailable", event => {
                        audioChunks.push(event.data);
                    });

                    const start = () => {
                        mediaRecorder.start();
                    };
                    const stop = () => {
                        return new Promise(resolve => {
                            mediaRecorder.addEventListener("stop", () => {
                                const audioBlob = new Blob(audioChunks);
                                const audioUrl = URL.createObjectURL(audioBlob);
                                const audio = new Audio(audioUrl);
                                const play = () => {
                                    audio.play();
                                };
                                resolve({ audioBlob, audioUrl, play });
                            });

                            mediaRecorder.stop();
                        });
                    };
                    resolve({ start, stop });
                });
        });
    };

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
                        <FormFeedback>Please enter a valid Title</FormFeedback>
                    </FormGroup>
                    </CardBody>
                </Form>
            </Col>
        </Card>
    )
} 