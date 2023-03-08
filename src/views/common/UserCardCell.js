import BaseAvatar from "@components/avatar";


const Avatar = ({ user }) => {
  let avatar = null;
  if (user.avatar && user.avatar.length) {
    avatar = <BaseAvatar className="me-1" img={user.avatar} width="32" height="32" />;
  } else {
    avatar = <BaseAvatar initials className="me-1" color={user.avatarColor || "light-primary"} content={user.name || "John Doe"}/>;
  }
  return (
    <>
      { avatar }
    </>
  );
};

const UserCardCell = ({ user }) => {
  return (
    <>
      <div className="d-flex justify-content-left align-items-center">
        <Avatar user={user} />
        <div className="d-flex flex-column">
          <span className="fw-bolder">
            {user.nickname ? user.nickname : user.name}
          </span>
          <small className="text-truncate text-muted mb-0">{user.email}</small>
        </div>
      </div>
    </>
  );
}

export default UserCardCell;