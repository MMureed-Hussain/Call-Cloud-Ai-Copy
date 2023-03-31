/* eslint-disable */
import { useState, useImperativeHandle, forwardRef } from "react";
import Sidebar from "@components/sidebar"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVideo, faPhone } from "@fortawesome/free-solid-svg-icons";

const FollowUpViewSidebar = forwardRef((props, ref) =>
{
	const [followUp, setFollowUp] = useState(null);
	const [open, setOpen] = useState(false);

	useImperativeHandle(ref, () => ({
		handleShow: (obj) =>
		{
			setFollowUp(obj);
			setOpen(true);
		},
	}));

	return (
		<Sidebar
			size="lg"
			open={open}
			title="Follow-up Details"
			headerClassName="mb-1"
			contentClassName="pt-0"
			toggleSidebar={() => setOpen(!open)}
			onClosed={() => setOpen(false)}
		>
			{followUp &&
				<>
					<div className="mb-3">
						<div className="form-label">Meeting At</div>
						<div className="fw-bold ms-3">{followUp.meeting_at}</div>
					</div>
					<div className="mb-3">
						<div className="form-label">Meeting Type</div>
						<div className="fw-bold ms-3 text-primary">
							{followUp.meeting_type == 'phone' && <FontAwesomeIcon fontSize={24} icon={faPhone} />}
							{followUp.meeting_type == 'google_meet' && <FontAwesomeIcon fontSize={24} icon={faVideo} />}
							{followUp.meeting_type == 'other' && 'Other'}
						</div>
					</div>
					<div className="mb-3">
						<div sm="3" className="form-label">Location</div>
						<div className="fw-bold ms-3 text-primary">{followUp.location}</div>
					</div>
					<div className="mb-3">
						<div sm="3" className="form-label">Meeting Note</div>
						<div className="fw-bold ms-3">{followUp.notes}</div>
					</div>
					<div className="mb-3">
						<div sm="3" className="form-label">Created At</div>
						<div className="fw-bold ms-3">{followUp.created_at}</div>
					</div>
					<div className="mb-3">
						<div sm="3" className="form-label">Updated At</div>
						<div className="fw-bold ms-3">{followUp.updated_at}</div>
					</div>
				</>
			}
		</Sidebar>
		
	);
});

export default FollowUpViewSidebar;
