/* eslint-disable */
import { useEffect, useState, useImperativeHandle, forwardRef } from "react";
import { Button, Label, Form, Input, FormFeedback, Spinner, FormGroup, Row, Col } from "reactstrap";
import Sidebar from "@components/sidebar";
import Select from "react-select";
import { selectThemeColors } from "@utils";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVideo, faPhone } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import PhoneInput from "react-phone-input-2";
// ** Store & Actions
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { storeOrUpdateProfileContact } from "@store/profiles";


const CreateUpdateContactSidebar = forwardRef((props, ref) =>
{

	const params = useParams();
	const dispatch = useDispatch();
	const [profileContact, setProfileContact] = useState(null);
	const currentWorkspace = useSelector((state) => state.workspaces.currentWorkspace);
	const errors = useSelector((state) => state.profiles.errors);
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

	const handleSubmit = (event) =>
	{
		event.preventDefault();
		let arg = { id: params.id, data };
		setLoader(true);
		dispatch(storeOrUpdateProfileContact(arg))
			.then(res => setLoader(false));
	};


	useImperativeHandle(ref, () => ({
		handleShow: (obj = null) =>
		{
			if (currentWorkspace) {

				let arg = obj ? {
					id: obj.id,
					first_name: obj.first_name,
					last_name: obj.last_name,
					job_title: obj.job_title,
					email: obj.email,
					phone: obj.phone,
					note: obj.note,
					call_profile_id: obj.call_profile_id,
					workspace_id: currentWorkspace.id,
					is_created: 0,
				} : {
					is_created: 1,
					workspace_id: currentWorkspace.id,
					call_profile_id: params.id,
				};

				setProfileContact(obj);
				setData(arg);
				setOpen(true);

				// console.log(obj, arg);

			} else {

				toast.error('Please select a workspace first!');
			}
		},
	}));




	return (
		<Sidebar
			size="lg"
			open={open}
			title={`${profileContact ? 'Update' : 'Create'} Contact`}
			headerClassName="mb-1"
			contentClassName="pt-0"
			toggleSidebar={() => setOpen(!open)}
			onClosed={() => setOpen(false)}>

			<Form onSubmit={handleSubmit}>
				<FormGroup>
					<Label className="form-label" for="title">First Name</Label>
					<Input name="first_name" type="text" value={data.first_name} onChange={e => handleChange(e)} className={`${errors.has("first_name") && 'is-invalid'}`} />
					{errors.has("first_name") && <FormFeedback>{errors.get("first_name")}</FormFeedback>}
				</FormGroup>
				<FormGroup>
					<Label className="form-label" for="title">Last Name</Label>
					<Input name="last_name" type="text" value={data.last_name} onChange={e => handleChange(e)} />
				</FormGroup>
				<FormGroup>
					<Label className="form-label" for="title">Job Title</Label>
					<Input name="job_title" type="text" value={data.job_title} onChange={e => handleChange(e)} />
				</FormGroup>
				<FormGroup>
					<Label className="form-label" for="title">Email </Label>
					<Input name="email" type="email" value={data.email} onChange={e => handleChange(e)} />
				</FormGroup>
				<FormGroup>
					<Label className="form-label" for="phone-number">Phone Number </Label>
					<PhoneInput country={"us"} value={data.phone} onChange={e => handleChange({ target: { name: 'phone', value: e, type: 'input' } })} enableSearch disableSearchIcon inputClass="form-control w-100" placeholder="1 234 567 8900" />
				</FormGroup>
				<FormGroup>
					<Label className="form-label" for="title"> Note </Label>
					<Input name="note" type="textarea" placeholder="Enter Note here" value={data.note} onChange={e => handleChange(e)} />
				</FormGroup>
				<Button className="me-1" color="primary">
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

export default CreateUpdateContactSidebar;
