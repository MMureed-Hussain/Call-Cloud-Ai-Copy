// ** React Imports
import { useEffect, useState } from "react";
// ** Reactstrap Imports
import { Card, CardBody } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { getNotes } from "../../../redux/note";
import Timeline from "@components/timeline";
import InfiniteScroll from "react-infinite-scroll-component";

export default () => {
  const [timelineData, setTimeLineDate] = useState([]);
  const [note, setNote] = useState();
  const [noteLength, setNoteLength] = useState(3);
  const [hasMore, setHasMore] = useState(true);

  const currentWorkspace = useSelector(
    (state) => state.workspaces.currentWorkspace
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (currentWorkspace) {
      dispatch(getNotes({ workspace_id: currentWorkspace.id })).then((data) => {
        setNote(data.payload.notes);
      });
    }
  }, [currentWorkspace]);

  const fetchMoreData = () => {
    const _leftItems = Number(note.length) - Number(noteLength);

    console.log("length", note.length, noteLength, _leftItems);

    setTimeout(() => {
      if (_leftItems >= Number(noteLength)) {
        console.log("truecase", _leftItems, noteLength);
        setNoteLength(noteLength + 3);
      } else {
        console.log("false case");
        setNoteLength(noteLength + _leftItems);
        setHasMore(false);
      }
    }, 3000);
  };

  useEffect(() => {
    if (note) {
      const copyTimeLine = [...timelineData];

      note.map((item) => {
        copyTimeLine.push({
          title: item.call_profile.name,
          content: item.notes,
          meta: "12 min ago",
        });
      });
      setTimeLineDate(copyTimeLine);
    }
  }, [note]);

  return (
    <>
      <Card>
        <CardBody style={{ height: 200, overflow: "auto" }}>
          <InfiniteScroll
            dataLength={noteLength}
            next={fetchMoreData}
            hasMore={hasMore}
            scrollableTarget="scrollableDiv"
          >
            {timelineData && <Timeline data={timelineData} />}
          </InfiniteScroll>
        </CardBody>
      </Card>
    </>
  );
};
