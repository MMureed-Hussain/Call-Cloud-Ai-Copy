import BookingPagesTable from "./BookingPagesTable";
import { useSelector } from "react-redux";
import Skeleton from "react-loading-skeleton";

const BookingPages = () => {
  const workspaceStore = useSelector((state) => state.workspaces);

  return workspaceStore.currentWorkspace &&
    workspaceStore.currentWorkspace.id.length > 0 ? (
    <BookingPagesTable workspaceId={workspaceStore.currentWorkspace.id} />
  ) : (
    // <p>{workspaceStore.currentWorkspace.id}</p>
    <Skeleton />
  );
};

export default BookingPages;
