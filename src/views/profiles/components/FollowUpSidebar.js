/* eslint-disable */
import { useEffect, useState, useImperativeHandle, forwardRef } from "react";
import { Button, Label, Form, Input, FormFeedback, Spinner, FormGroup, Row, Col } from "reactstrap";
import Sidebar from "@components/sidebar";

import Select from "react-select";
import { selectThemeColors } from "@utils";
import axios from "axios";
axios.defaults.withCredentials = true;
import toast from "react-hot-toast";
// ** Store & Actions
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { storeOrUpdateCallFollowUp } from "@store/profiles";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVideo, faPhone } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";


const FollowUpSidebar = forwardRef((props, ref) =>
{

	const params = useParams()
	const dispatch = useDispatch();
	const user = useSelector(state => state.auth.user);
	const errors = useSelector(state => state.profiles.errors);
	const [followUp, setFollowUp] = useState(null);
	const workspaces = useSelector((state) => state.workspaces);

	const [open, setOpen] = useState(false);
	const [loader, setLoader] = useState(false);
	const [timezoneList, setTimezoneList] = useState("");
	const [timezone, setTimezone] = useState(null);

	const [data, setData] = useState({});

	const handleChange = (e) =>
	{

		const key = e.target.name;
		const value = e.target.type == 'checkbox' ? e.target.checked : e.target.value;


		if (e.target.name == 'type') {
			setData(data => ({
				...data,
				'meeting_at': '',
				[key]: value,
			}));
		} else {

			setData(data => ({
				...data,
				[key]: value,
			}));
		}
	}

	const handleSelectChange = (e, name) =>
	{
		let target = {
			name,
			type: 'input',
			value: e.value,
		};

		handleChange({ target });

		if (name == 'timezone') {
			setTimezone(e);
		}
	}

	const handleSubmit = (event) =>
	{
		event.preventDefault();
		let arg = { id: params.id, data };
		setLoader(true);
		dispatch(storeOrUpdateCallFollowUp(arg))
			.then(res =>
			{
				setLoader(false);
				setOpen(false)
			});
	};

	const meetingOptions = () =>
	{
		let numbers = [];
		for (let i = 1; i < 61; i++) {
			numbers.push({ value: i, label: i });
		}
		return numbers;

	}

	const meetingHeldOn = () =>
	{
		if (data.type && data.meeting_at) {
			let date = (data.type == 'number' || data.type == 'days') ? moment().add(data.meeting_at, 'days') : moment(data.meeting_at);
			return `This meeting will be ${date.format('lll')}`;
		}
	}

	useImperativeHandle(ref, () => ({
		handleShow: (obj = null) =>
		{

			if (workspaces && workspaces.currentWorkspace) {

				let arg = obj ? {
					...obj,
					is_created: 0,
					type: 'datetime'
				} : {
					type: 'number',
					meeting_at: '',
					meeting_type: 'phone',
					call_profile_id: params.id,
					is_created: 1,
					workspace_id: workspaces.currentWorkspace.id,
				};

				setFollowUp(obj);
				setData(arg);
				setOpen(true);

			} else {

				toast.error('Please select a workspace first!');
			}
		},
	}));


	useEffect(() =>
	{

		if (!user.timezone) {
			axios.get(`${process.env.REACT_APP_API_ENDPOINT}/api/timezones`)
				.then((res) =>
				{
					const timezoneOptions = res.data.map((timezone) =>
					{
						return {
							id: timezone.id,
							value: timezone.id,
							label: timezone.name,
						};
					});
					setTimezoneList(timezoneOptions);
				});
		}
	}, []);


	return (
		<Sidebar
			size="lg"
			open={open}
			title={`${followUp ? 'Update' : 'Create'} Follow Up`}
			headerClassName="mb-1"
			contentClassName="pt-0"
			toggleSidebar={() => setOpen(!open)}
			onClosed={() => setOpen(false)}>

			<div className="text-center fw-bold text-primary">
				{meetingHeldOn()}
			</div>

			<Form onSubmit={handleSubmit}>
				<Row className={`pt-2 pb-2 ${data.type == 'number' ? '' : ''}`}>
					<Col sm="2" className="d-flex align-items-center">
						<Input
							type="radio"
							name="type"
							defaultChecked={data.type == 'number'}
							value="number"
							onChange={e => handleChange(e)} />
					</Col>
					<Col>
						<Label className="form-label">Select Day/Days</Label>
						<Select
							name="meeting_at"
							theme={selectThemeColors}
							classNamePrefix="select"
							className={`react-select ${(errors.has("meeting_at") && data.type == 'number') && 'is-invalid'}`}
							placeholder="Select a number"
							options={meetingOptions()}
							onChange={e => handleSelectChange(e, 'meeting_at')}
							disabled={data.type == 'number' ? false : true}
						/>
						{(errors.has("meeting_at") && data.type == 'number') && <FormFeedback>{errors.get("meeting_at")}</FormFeedback>}

					</Col>
				</Row>
				<Row className={`pt-2 pb-2 ${data.type == 'days' ? '' : ''}`}>
					<Col sm="2" className="d-flex  align-items-center">
						<Input
							type="radio"
							name="type"
							defaultChecked={data.type == 'days'}
							value="days"
							onChange={e => handleChange(e)}
						/>
					</Col>
					<Col>
						<Label className="form-label">Enter Day/Days</Label>
						<Input
							type="number"
							name="meeting_at"
							value={data.meeting_at && data.type == 'days' ? data.meeting_at : ''}
							className={`${(errors.has("meeting_at") && data.type == 'days') && 'is-invalid'}`}
							onChange={(e) => handleChange(e)}
							disabled={data.type == 'days' ? false : true}
						/>

						{(errors.has("meeting_at") && data.type == 'days') && <FormFeedback>{errors.get("meeting_at")}</FormFeedback>}
					</Col>
				</Row>

				<Row className={`pt-2 pb-2 mb-1 ${data.type == 'datetime' ? '' : ''}`}>
					<Col sm="2" className="d-flex justify-content-center align-items-center">
						<Input
							type="radio"
							name="type"
							defaultChecked={data.type == 'datetime'}
							value="datetime"
							onChange={e => handleChange(e)}
						/>
					</Col>
					<Col>
						<Label className="form-label"> Choose Date <span className="text-danger"></span></Label>
						<Input
							type="datetime-local"
							name="meeting_at"
							value={data.meeting_at && data.type == 'datetime' ? moment(data.meeting_at).format('YYYY-MM-DD HH:mm') : ''}
							className={`${(errors.has("meeting_at") && data.type == 'datetime') && 'is-invalid'}`}
							onChange={(e) => handleChange(e)}
							disabled={data.type == 'datetime' ? false : true}
						/>

						{(errors.has("meeting_at") && data.type == 'datetime') && <FormFeedback>{errors.get("meeting_at")}</FormFeedback>}
					</Col>
				</Row>


				{!user.timezone &&

					<div className="mb-1">
						<Label className="form-label" for="timezoneInput">
							Profile's Timezone
						</Label>
						<Select
							required
							isClearable={false}
							isSearchable={true}
							name="timezone"
							className="react-select"
							id="timezoneInput"
							classNamePrefix="select"
							onChange={e => handleSelectChange(e, 'timezone')}
							theme={selectThemeColors}
							options={timezoneList}
							noOptionsMessage={input => `No match found for ${input.inputValue}!`}
						/>

						{errors.has("timezone") && <FormFeedback>{errors.get("timezone")}</FormFeedback>}
					</div>
				}

				<div className="mb-1">
					<Row className="text-center">

						<Col sm="2" className="d-flex align-items-center">
							<Label className="form-label">Meeting Type</Label>
						</Col>
						<Col sm="10">
							<Row>
								<Col>
									<i className="bi bi-google"></i>
									<FontAwesomeIcon fontSize={24} icon={faPhone} />
									<div className="mt-2">
										<Input
											type="radio"
											name="meeting_type"
											defaultChecked={data.meeting_type == 'phone'}
											value="phone"
											onChange={e => handleChange(e)} />
									</div>
								</Col>
								<Col>
									<FontAwesomeIcon fontSize={24} icon={faVideo} />
									<div className="mt-2">
										<Input
											type="radio"
											name="meeting_type"
											defaultChecked={data.meeting_type == 'google_meet'}
											value="google_meet"
											onChange={e => handleChange(e)} />
									</div>
								</Col>
								<Col>
									<span>Other</span>
									<div className="mt-2">
										<Input
											type="radio"
											name="meeting_type"
											defaultChecked={data.meeting_type == 'other'}
											value="other"
											onChange={e => handleChange(e)} />
									</div>
								</Col>
							</Row>
						</Col>
					</Row>
				</div>
				<div className="mb-1">
					<Label className="form-label">Location Detail</Label>
					<Input
						type="text"
						name="location"
						value={data.location ? data.location : ''}
						className={`${errors.has("location") && 'is-invalid'}`}
						onChange={(e) => handleChange(e)}
						required
					/>

					{errors.has("location") && <FormFeedback>{errors.get("location")}</FormFeedback>}
				</div>

				<div className="mb-1">
					<Label className="form-label" for="title"> Note </Label>
					<Input
						name="notes"
						type="textarea"
						placeholder="Enter Note here"
						value={data.notes}
						onChange={e => handleChange(e)}
					/>
				</div>
				<Button className="me-1" color="primary" type="submit" >
					{loader && <Spinner style={{ marginRight: "5px" }} size={"sm"} color="white" />}
					Submit
				</Button>

				<Button type="reset" color="secondary" outline onClick={() => setOpen(false)}>
					Cancel
				</Button>
			</Form>
		</Sidebar>
	);
});

export default FollowUpSidebar;
