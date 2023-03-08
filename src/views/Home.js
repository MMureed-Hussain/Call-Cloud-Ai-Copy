import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  CardText,
  CardLink,
} from "reactstrap";

import { Navigate } from "react-router-dom";

import { useSelector } from "react-redux";

const Home = () => {
  const store = useSelector((state) => {
    return state.auth;
  });
  const workspaceState = useSelector((state) => {
    return state.workspaces;
  });

  if (!store.user) {
    return <Navigate to="/login" />;
  }
  
  // if (workspaceState.currentWorkspace) {
  //   return <Navigate to={`/workspace/${workspaceState.currentWorkspace.id}`} />;
  // }

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>
            {
              // prettier-ignore
              workspaceState.currentWorkspace ? `Welcome ${store.user.name} (${store.user.email}) to workspace ${workspaceState.currentWorkspace.name} 🚀` : `Welcome ${store.user.name} (${store.user.email}) 🚀`
            }
          </CardTitle>
        </CardHeader>
        <CardBody>
          <CardText>All the best for your new project.</CardText>
          <CardText>
            {store.user.emailVerified && "All set, your good to go!"}
            {!store.user.emailVerified &&
              "Please check inbox and verify your email address."}

            {store.user.profileCompleted && "Profile completed"}
            {!store.user.profileCompleted && "Please complete profile"}
          </CardText>
        </CardBody>
      </Card>
    </div>
  );
};

export default Home;
