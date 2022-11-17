import { useState } from "react";
import {
  Card,
  Form,
  Input,
  Label,
  FormFeedback,
  Col,
  FormGroup,
  CardBody,
  Button,
} from "reactstrap";

export default () => {
  // const [audioDetails, setAudioDetails] = useState({
  //     url: null,
  //     blob: null,
  //     chunks: null,
  //     duration: {
  //         h: 0,
  //         m: 0,
  //         s: 0
  //     }
  // });

  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  // const [tags, setTags] = useState("");

  const recordAudio = () => {
    return new Promise((resolve) => {
      navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);
        const audioChunks = [];

        mediaRecorder.addEventListener("dataavailable", (event) => {
          audioChunks.push(event.data);
        });

        const start = () => {
          mediaRecorder.start();
        };
        const stop = () => {
          return new Promise((resolve) => {
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
              <Label className="form-label" for="title">
                Note<span className="text-danger">*</span>
              </Label>
              <Input
                id="note"
                placeholder="Enter note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
              <Label className="form-label" for="title">
                Voice<span className="text-danger">*</span>
              </Label>
              <br />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-mic"
                viewBox="0 0 16 16"
                onClick={recordAudio}
                cursor="pointer"
              >
                <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5z" />
                <path d="M10 8a2 2 0 1 1-4 0V3a2 2 0 1 1 4 0v5zM8 0a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V3a3 3 0 0 0-3-3z" />
              </svg>
              <FormFeedback>Please enter a valid Title</FormFeedback>
            </FormGroup>
          </CardBody>
        </Form>
      </Col>
    </Card>
  );
};
