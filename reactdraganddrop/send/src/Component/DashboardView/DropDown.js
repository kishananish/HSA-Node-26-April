import { NavDropdown } from "react-bootstrap";
import Dropdown from "react-bootstrap/Dropdown";
import { onDragEnd, onDragStart } from "./DragFunction";
import {
  pendingTask,
  doneTask,
  todoTask,
  deleteTask,
  backlogTask,
} from "../../Redux/Reducer";
import { useDispatch } from "react-redux";
const DropdownMore = ({ data, editChange }) => {
  const dispatch = useDispatch();
  const getBackgroundColour = (stage) =>
    stage === "backlog"
      ? "red"
      : stage === "todo"
      ? "grey"
      : stage === "pending"
      ? "orange"
      : "green";
  const ForBack = (id, stage) => {
    stage === "backlog"
      ? dispatch(todoTask(id))
      : stage === "todo"
      ? dispatch(pendingTask(id))
      : stage === "pending" && dispatch(doneTask(id));
  };
  const BackFor = (id, stage) => {
    stage === "done"
      ? dispatch(pendingTask(id))
      : stage === "pending"
      ? dispatch(todoTask(id))
      : stage === "todo" && dispatch(backlogTask(id));
  };
  return data?.map(({ id, stage, title, date, priorty }) => (
    <div
      className="task1"
      key={id}
      id={id}
      draggable
      onDragStart={(e) => onDragStart(e)}
      onDragEnd={(e) => onDragEnd(e)}
      style={{
        backgroundColor: getBackgroundColour(stage),
        cursor: "grab",
        borderRadius: 15,
      }}
    >
      <div className="row m-1 ">
        <div className="col-lg-10 col col">
          <p style={{ marginTop: "15px", lineHeight: "10px" }}>
            <b>Stage:</b>
            <strong style={{ color: "black" }}>
              {" "}
              {stage === "backlog"
                ? "0"
                : stage === "pending"
                ? "2"
                : stage === "todo"
                ? "1"
                : "3"}
            </strong>
          </p>

          <p style={{ marginTop: "15px", lineHeight: "10px" }}>
            <b>Task:</b>
            <strong style={{ color: "black" }}> {title}</strong>
          </p>
        </div>

        <div
          className="col-lg-2 col col text-end"
          style={{ cursor: "pointer" }}
        >
          <NavDropdown className="custdropdown" style={{ fontSize: 25 }}>
            <Dropdown.Item onClick={() => editChange(id)}>Edit</Dropdown.Item>

            <Dropdown.Item onClick={() => dispatch(deleteTask(id))}>
              Delete
            </Dropdown.Item>

            <div style={{ display: "flex" }}>
              <Dropdown.Item
                onClick={() => BackFor(id, stage)}
                disabled={stage === "backlog"}
              >
                Back
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => ForBack(id, stage)}
                disabled={stage === "done"}
              >
                Forword
              </Dropdown.Item>
            </div>
          </NavDropdown>
        </div>

        <div className="row">
          <p style={{ marginTop: "15px", lineHeight: "10px" }}>
            <b>Deadline:</b> <strong style={{ color: "blue" }}>{date}</strong>
          </p>
          <p>
            <b>Prioroty:</b>
            <strong style={{ color: "black", marginLeft: 10 }}>
              {priorty}
            </strong>
          </p>
        </div>
      </div>
    </div>
  ));
};
export default DropdownMore;
