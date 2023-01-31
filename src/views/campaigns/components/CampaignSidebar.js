/* eslint-disable */
import { useParams } from "react-router-dom";
import { useEffect, useState, useImperativeHandle, forwardRef } from "react";
import { Button, Label, Form, Input, FormFeedback, Spinner, FormGroup } from "reactstrap";
import Select from "react-select";
import toast from "react-hot-toast";
import Sidebar from "@components/sidebar";
import { useDispatch, useSelector } from "react-redux";
import { storeOrUpdate } from "../../../redux/campaigns";
import moment from "moment/moment";

const CampaignSidebar = forwardRef((props, ref) =>
{

	const params = useParams()
	const dispatch = useDispatch();
	const user = useSelector(state => state.auth.user);
	const errors = useSelector(state => state.campaigns.errors);
	const [campaign, setCampaign] = useState(null);
	const currentWorkspace = useSelector((state) => state.workspaces.currentWorkspace);
	const [open, setOpen] = useState(false);
	const [loader, setLoader] = useState(false);
	const [data, setData] = useState({});
	const handleChange = (e) =>
	{
		const key = e.target.name;
		const value = e.target.type == 'checkbox' ? e.target.checked : e.target.value;

		setData(data => ({
			...data,
			[key]: value,
		}));
	}

	const handleSelectChange = (e, name) =>
	{
		let target = {
			name,
			type: 'input',
			value: e.value,
		};

		handleChange({ target });
	}

	const handleSubmit = (event) =>
	{
		event.preventDefault();
		setLoader(true);
		console.log(data, 'eata');
		dispatch(storeOrUpdate(data)).then(res => { console.log(res, 'res'); setLoader(false) });
	};

	const handleSelected = (op, sel) =>
	{
		return op.filter(option => option.value === sel);
	}



	useImperativeHandle(ref, () => ({
		handleShow: (obj = null) =>
		{
			if (currentWorkspace) {
				let arg = obj ? {
					...obj,
					is_created: 0,
					start_date: moment(obj.start_date).format('YYYY-MM-DD')
				} : {
					title: '',
					start_date: '',
					description: '',
					is_created: 1,
					team_id: '',
					status: 1,
					workspace_id: currentWorkspace.id,
				};

				setCampaign(obj);
				setData(arg);
				setOpen(true);

			} else {
				toast.error('Please select a workspace first!');
			}
		},
	}));

	return (
		<Sidebar
			size="lg"
			open={open}
			title={`${campaign ? 'Update' : 'Create'} Campaign`}
			headerClassName="mb-1"
			contentClassName="pt-0"
			toggleSidebar={() => setOpen(!open)}
			onClosed={() => setOpen(false)}>

			<Form onSubmit={handleSubmit}>
				<FormGroup>
					<Label className="form-label">Title <span className="text-danger">*</span></Label>
					<Input
						type="text"
						name="title"
						value={data.title ?? ''}
						className={`${errors.has("title") && 'is-invalid'}`}
						onChange={(e) => handleChange(e)}
					/>

					{errors.has("title") && <FormFeedback>{errors.get("title")}</FormFeedback>}
				</FormGroup>

				<FormGroup>
					<Label className="form-label" for="title">Description</Label>
					<Input
						name="description"
						type="textarea"
						placeholder="Enter description here"
						value={data.description}
						onChange={e => handleChange(e)}
					/>
				</FormGroup>
				<FormGroup>
					<Label className="form-label" for="title">Start Date <span className="text-danger">*</span></Label>
					<Input
						name="start_date"
						type="date"
						value={data.start_date}
						onChange={e => handleChange(e)}
						className={`${errors.has("start_date") && 'is-invalid'}`}
					/>
					{errors.has("start_date") && <FormFeedback>{errors.get("start_date")}</FormFeedback>}

				</FormGroup>

				<FormGroup>
					<Label className="form-label">Select a team <span className="text-danger">*</span></Label>
					<Select
						classNamePrefix="select"
						className={`react-select ${errors.has("team_id") && 'is-invalid'}`}
						placeholder="Select a team"
						onChange={e => handleSelectChange(e, 'team_id')}
						options={props.teams}
						value={handleSelected(props.teams, data.team_id)}
					/>

					{errors.has("team_id") && <FormFeedback>{errors.get("team_id")}</FormFeedback>}

				</FormGroup>

				<FormGroup>
					<Label className="form-label">Status <span className="text-danger">*</span></Label>
					<FormGroup switch>
						<Input
							type="switch"
							id="switch-success"
							name="status"
							checked={data.status}
							onChange={e => handleChange(e)}
						/>
					</FormGroup>

				</FormGroup>
				<Button className="me-1" color="primary">
					{loader && <Spinner style={{ marginRight: "5px" }} size={"sm"} color="white" />}
					Submit
				</Button>

				<Button type="reset" color="secondary" outline onClick={() => setOpen(false)}> Cancel </Button>
			</Form>
		</Sidebar>
	);
});

export default CampaignSidebar;
