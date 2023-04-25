/* eslint-disable */
import { useEffect, useState, useMemo } from "react";
import Sidebar from "@components/sidebar";
import { Button, Label, Form, Input, FormFeedback, Spinner } from "reactstrap";
import Select from "react-select";
import { selectThemeColors } from "@utils";
// ** Store & Actions
import { useDispatch, useSelector } from "react-redux";
import Recorder from "./Recorder";
import { useParams } from "react-router-dom";
import { createCall, updateCall } from "../../../redux/profiles";
import TagInput from "./TagInput";
import { sendCallRecordingStatus } from "@store/notifications";
export default ({ open, toggleSidebar, call, callOptions }) =>
{
	// ** States
	const dispatch = useDispatch();
	const params = useParams();
	const [notes, setNotes] = useState("");
	const [tags, setTags] = useState([]);
	const [formSubmissionLoader, setFormSubmissionLoader] = useState(false);
	const [callStatus, setCallStatus] = useState(null);
	const errors = useSelector((state) => state.profiles.errors);
	const currentWorkspace = useSelector((state) => state.workspaces.currentWorkspace);
	const [audioDetails, setAudioDetails] = useState({
		url: null,
		blob: null,
		chunks: [],
		duration: {
			h: 0,
			m: 0,
			s: 0,
		},
	});

	useEffect(() =>
	{
		if (call) {
			setNotes(call.notes);
			setAudioDetails((state) =>
			{
				state.url = `${process.env.REACT_APP_API_ENDPOINT}/audio-stream/${call.id}`;
				return state;
			});
			let tags = call.tags.map((tag) => ({ value: tag.id, label: tag.label }));
			setTags(tags);
			if (call.status_id) {
				setCallStatus({
					value: call.status_id,
					label: call.call_status.name,
				});
			}
		}
	}, [call]);

	const handleSubmit = (event) =>
	{
		event.preventDefault();
		const formData = new FormData();
		if (!call) {
			formData.append("notes", notes);
			formData.append("tags", JSON.stringify(tags));
			formData.append("voice", audioDetails.blob);
			formData.append("call_profile_id", params.id);
			if (callStatus) {
				formData.append("status_id", callStatus.value);
			}

			dispatch(
				sendCallRecordingStatus({
					workspace_id: currentWorkspace.id,
					status: "SUBMITTED",
					call_profile_id: params.id,
				})
			);
		}
		setFormSubmissionLoader(true);
		dispatch(
			call
				? updateCall({
					formData: {
						notes,
						tags: JSON.stringify(tags),
						status_id: callStatus?.value,
					},
					id: call.id,
				})
				: createCall({
					formData,
					id: params.id,
				})
		).then((res) =>
		{
			setFormSubmissionLoader(false);
			if (res.payload.data) {
				toggleSidebar();
			}
		});
	};


	const handleSidebarClosed = () =>
	{
		setAudioDetails({
			url: null,
			blob: null,
			chunks: [],
			duration: {
				h: 0,
				m: 0,
				s: 0,
			},
		});
		setNotes("");
		setTags([]);

		dispatch(
			sendCallRecordingStatus({
				workspace_id: currentWorkspace.id,
				status: "DISCONNECTED",
				call_profile_id: params.id,
			})
		);
	};


	const handleSelected = (selected) =>
	{
		return callOptions.filter(op => op.value === selected);
	}

	return (
		<Sidebar
			size="lg"
			open={open}
			title={call ? "Update Call" : "New Call"}
			headerClassName="mb-1"
			contentClassName="pt-0"
			toggleSidebar={toggleSidebar}
			onClosed={handleSidebarClosed}
		>
			<Form onSubmit={handleSubmit}>
				{!call && (
					<Recorder
						audioDetails={audioDetails}
						setAudioDetails={setAudioDetails}
					/>
				)}
				<div className="mb-1">
					<Label className="form-label" for="phone-number">
						Call Status<span className="text-danger">*</span>
					</Label>
					<Select
						value={callStatus}
						theme={selectThemeColors}
						classNamePrefix="select"
						className={errors.has("status_id") ? "is-invalid react-select" : "react-select"}
						placeholder="Select call status"
						options={callOptions}
						onChange={setCallStatus}
					/>
					{errors.has("status_id") && (<FormFeedback>{errors.get("status_id")}</FormFeedback>)}
				</div>
				<div className="mb-1">
					<Label className="form-label" for="title">
						Tags<span className="text-danger">*</span>
					</Label>
					<TagInput
						value={tags}
						onChange={setTags}
						className={errors.has("tags") ? "is-invalid react-select" : "react-select"}
						name="Tags"
						placeHolder="Add tag"
					/>
					{errors.has("tags") && <FormFeedback>{errors.get("tags")}</FormFeedback>}
				</div>
				<div className="mb-1">
					<Label className="form-label" for="title">
						Notes
					</Label>
					<Input
						placeholder="Enter Note here"
						value={notes}
						onChange={(e) =>
						{
							const value = e.target.value.replace(
								/(^\w{1})|(\s+\w{1})/g,
								(letter) => letter.toUpperCase()
							);
							setNotes(value);
						}}
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
