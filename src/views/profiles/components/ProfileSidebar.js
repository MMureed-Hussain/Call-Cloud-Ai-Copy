/* eslint-disable */
import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { Form, Input, Label, FormGroup, Spinner, Button, FormFeedback } from "reactstrap";
import "cleave.js/dist/addons/cleave-phone.us";
import { useDispatch, useSelector } from "react-redux";
import { createProfile, setSelectedProfile, updateProfile } from "../../../redux/profiles";
import { } from "../../../redux/statuses";
import { getUsers } from "../../../redux/workspaces";
import { getCampaignsList } from "../../../redux/campaigns";
import "react-phone-input-2/lib/style.css";
import PhoneInput from "react-phone-input-2";
import Select from "react-select";
import { selectThemeColors } from "@utils";
import Sidebar from "@components/sidebar";

export default forwardRef(({ type, clientOptions, leadOptions, pipelineOptions }, ref) =>
{

	const dispatch = useDispatch();
	const [open, setOpen] = useState(false);
	const [profile, setProfile] = useState(null);
	const currentWorkspace = useSelector((state) => state.workspaces.currentWorkspace);
	const campaignsOptions = useSelector((state) => state.campaigns.campaignsOptions);
	const loading = useSelector((state) => state.profiles.loading);
	const errors = useSelector((state) => state.profiles.errors);
	const workspaceUsers = useSelector((state) => state.workspaces.users.map((user) => ({ value: user.id, label: user.name })));
	const [data, setData] = useState({});

	useEffect(() =>
	{
		dispatch(getUsers({ id: currentWorkspace.id, perPage: 50, page: 1 }));
		dispatch(getCampaignsList({ workspace_id: currentWorkspace.id, orderby: "created_at", sort: "desc", }));
	}, [currentWorkspace]);



	useImperativeHandle(ref, () => ({
		handleShow: (obj = null) =>
		{
			if (currentWorkspace) {
				let arg = obj
					? {
						name: obj.name,
						phone: obj.phone,
						campaign_id: obj.campaign_id,
						pipeline_id: obj.pipeline_id,
						lead_status_id: obj.lead_status_id,
						client_status_id: obj.client_status_id,
						workspace_id: currentWorkspace.id,
						users: obj.users.map((item) => ({ value: item.id, label: item.name })),
					}
					: {
						name: null,
						campaign_id: null,
						phone: null,
						pipeline_id: null,
						lead_status_id: null,
						client_status_id: null,
						workspace_id: currentWorkspace.id,
						users: [],
					};

				setData(arg);
				setProfile(obj);
				setOpen(true);

			} else {
				toast.error("Please select a workspace first!");
			}
		},
	}));


	const handleChange = (e) =>
	{
		const key = e.target.name;
		let value = e.target.value;
		setData((data) => ({
			...data,
			[key]: value,
		}));
	};

	const handleSelectChange = (e, name) =>
	{
		let target = {
			name,
			type: "input",
			value: e.value,
		};

		handleChange({ target });
	};

	const handleSelected = (op, sel) =>
	{
		let newOptions = [{ value: 0, label: 'None' }, ...op];
		let selected = sel ? sel : 0;

		return newOptions.filter(option => option.value === selected);
	}

	const handleSubmit = (event) =>
	{
		event.preventDefault();
		dispatch(profile ? updateProfile({ payload: data, id: profile.id }) : createProfile(data))
	};

	return (
		<Sidebar
			size="lg"
			open={open}
			title={profile ? "Edit Profile" : "New Profile"}
			headerClassName="mb-1"
			contentClassName="pt-0"
			toggleSidebar={() => setOpen(!open)}
			onClosed={() => setOpen(false)}
		>
			<Form onSubmit={handleSubmit}>
				<div className="mb-1">
					<Label className="form-label" for="title">
						Profile Name<span className="text-danger">*</span>
					</Label>
					<Input
						name="name"
						id="profile"
						value={data.name}
						placeholder="Enter profile name"
						className={`form-control ${errors.has("name") && 'is-invalid'}`}
						onChange={e => handleChange(e)}
					/>

					{errors.has("name") && <FormFeedback > {errors.get("name")}</FormFeedback>}
				</div>

				<div className="mb-1">
					<Label className="form-label" for="campaign"> Campaign</Label>
					<Select
						placeholder="Select campaign"
						classNamePrefix="select"
						options={[{ value: '', label: 'None' }, ...campaignsOptions]}
						onChange={e => handleSelectChange(e, 'campaign_id')}
						value={handleSelected(campaignsOptions, data.campaign_id)}
					/>
				</div>

				<div className="mb-1">
					<Label className="form-label" for="phone-number">
						Phone Number<span className="text-danger">*</span>
					</Label>
					<PhoneInput
						country={"us"}
						value={data.phone}
						enableSearch
						disableSearchIcon
						containerClass={`${errors.has("phone") && 'is-invalid'}`}
						inputClass={`form-control w-100 ${errors.has("phone") && 'is-invalid'}`}
						placeholder="1 234 567 8900"
						onChange={e => handleSelectChange({ value: e }, 'phone')}
					/>

					{errors.has("phone") && <FormFeedback > {errors.get("phone")}</FormFeedback>}

				</div>
				<div className="mb-1">
					<Label className="form-label" for="phone-number">
						Pipeline<span className="text-danger">*</span>
					</Label>
					<Select
						classNamePrefix="select"
						className="mb-2"
						placeholder="Pipeline"
						options={pipelineOptions}
						onChange={e => handleSelectChange(e, 'pipeline_id')}
						value={handleSelected(pipelineOptions, data.pipeline_id)}
					/>
				</div>
				<div className="mb-1">
					<Label className="form-label" for="phone-number">
						Status<span className="text-danger">*</span>
					</Label>
					{type == 'client' &&
						<Select
							classNamePrefix="select"
							className="mb-2"
							placeholder='Client Status'
							options={clientOptions}
							onChange={e => handleSelectChange(e, 'client_status_id')}
							value={handleSelected(clientOptions, data.client_status_id)}
						/>
					}
					{
						type == 'lead' &&
						<Select
							classNamePrefix="select"
							className="mb-2"
							placeholder='Lead Status'
							options={leadOptions}
							onChange={e => handleSelectChange(e, 'lead_status_id')}
							value={handleSelected(leadOptions, data.lead_status_id)}
						/>
					}
				</div>
				<div className="mb-1">
					<Label className="form-label">
						Users<span className="text-danger">*</span>
					</Label>
					<Select
						theme={selectThemeColors}
						isMulti
						placeholder="Select User"
						classNamePrefix="select"
						className={`react-select ${errors.has("users") && 'is-invalid'}`}
						value={data.users}
						options={workspaceUsers}
						onChange={(e) => handleChange({ target: { name: 'users', type: 'input', value: e } })}
					/>

					{errors.has("users") && <FormFeedback > {errors.get("users")}</FormFeedback>}

				</div>
				<Button className="me-1" color="primary" type="submit">
					Submit
					{loading && <Spinner style={{ marginLeft: "5px" }} size={"sm"} color="white" />}
				</Button>
				<Button type="reset" color="secondary" outline onClick={() => setOpen(false)} > Cancel </Button>
			</Form>
		</Sidebar >
	);
});
