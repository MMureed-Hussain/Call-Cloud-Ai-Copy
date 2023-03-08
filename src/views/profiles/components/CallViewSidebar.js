/* eslint-disable */
import Sidebar from "@components/sidebar";
import CallPlayer from "./CallPlayer";
import { Badge } from "reactstrap"
import moment from "moment";
import UserInfo from "./UserInfo"

export default ({ call, open, toggleSidebar }) => {

    return (
      <Sidebar
        size="lg"
        open={open}
        title="Call View"
        headerClassName="mb-1"
        contentClassName="pt-0"
        id="call-view-sidebar"
        toggleSidebar={toggleSidebar}
      >
        <CallPlayer callId={call.id} container="call-view-sidebar" />
        <h5 className="mt-2">Notes:</h5>
        <p>{call.notes ?? "-"}</p>
        <h5 className="mt-2">Status:</h5>
        <p>
          {call.call_status ? (
            <Badge color="light-primary">{call.call_status.name}</Badge>
          ) : (
            "-"
          )}
        </p>
        <h5 className="mt-2">Tags:</h5>
        {call.tags.map((tag) => {
          return (
            <Badge
              style={{ marginRight: "5px" }}
              key={`tag-${tag.key}`}
              color="light-primary"
            >
              {tag.label}
            </Badge>
          );
        })}
        <h5 className="mt-2">Created By:</h5>
        <UserInfo
          name={`${call.created_by.first_name} ${call.created_by.last_name}`}
          email={call.created_by.email}
        />
        <h5 className="mt-2">Updated By:</h5>
        {call.updated_by ? (
          <UserInfo
            name={`${call.updated_by.first_name} ${call.updated_by.last_name}`}
            email={call.updated_by.email}
          />
        ) : (
          <p>-</p>
        )}
        <h5 className="mt-2">Created At:</h5>
        <p>{moment(call.created_at).format("YYYY-MM-DD HH:mm:ss")}</p>
        <h5 className="mt-2">Updated At:</h5>
        <p>
          {call.updated_by
            ? moment(call.updated_at).format("YYYY-MM-DD HH:mm:ss")
            : "-"}
        </p>
      </Sidebar>
    );
}