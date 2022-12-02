import Avatar from "@components/avatar";

const UserInfo = ({ name, email }) => {
    return (
        <div className="d-flex justify-content-left align-items-center">
            <Avatar
                initials
                className="me-1"
                color={"light-primary"}
                content={name || "John Doe"}
            />
            <div className="d-flex flex-column">
                <span className="fw-bolder">
                    {name}
                </span>
                <small className="text-truncate text-muted mb-0">{email}</small>
            </div>
        </div>
    )
}
export default UserInfo;