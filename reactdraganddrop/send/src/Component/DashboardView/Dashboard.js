import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addTask, editTask } from "../../Redux/Reducer";
import "./styles.css";
import TaskList from "./TaskList";

import { useAuth } from "../../AuthContext/Auth";

const Dashboard = () => {
  const taskdata = useSelector((state) => state.task.taskdata);
  const userAuth = useAuth();
  let navigate = useNavigate();
  let dispatch = useDispatch();
  let getUser = JSON.parse(localStorage.getItem("userDetail"));
  let googleUser = JSON.parse(localStorage.getItem("googleUser"));
  let currentDate = new Date().toJSON().slice(0, 10);
  const [title, setTitle] = useState("");
  const [taskValidate, setTaskValidate] = useState("");
  const [tarikh, setTarikh] = useState("");
  const [prioty, setPrioty] = useState("Select");
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState("");
  const [editableId, setEditatbleId] = useState();

  const pendingdata = useSelector((state) =>
    state.task.taskdata.filter((data) => data.stage === "pending")
  );
  const tododata = useSelector((state) =>
    state.task.taskdata.filter((data) => data.stage === "todo")
  );
  const completeddata = useSelector((state) =>
    state.task.taskdata.filter((data) => data.stage === "done")
  );
  const backdata = useSelector((state) =>
    state.task.taskdata.filter((data) => data.stage === "backlog")
  );

  const checkDuplicate = taskdata.find((data) => data.title === title);
  const filterEditData = taskdata.filter((data) => data.id !== editableId);
  const checkEditDuplicate = filterEditData.some(
    (data) => data.title === title
  );
  const getData = {
    id: title.length * 5 + taskdata?.length,
    title: title,
    date: tarikh,
    priorty: prioty,
    stage: "backlog",
  };
  const logout = () => {
    localStorage.removeItem("googleUser");
    userAuth.logout(false);
    navigate("/login");
  };

  const add = (e) => {
    e.preventDefault();
    if (title === "" || tarikh === "" || prioty === "") {
      setError(
        (title === "" && "Enter title") ||
          ((prioty === "" || prioty === "Select") && "Enter prioty") ||
          (tarikh === "" && "Enter deadline")
      );
    } else if (!editMode && checkDuplicate) {
      !editMode && setTaskValidate("Enter unique task name.");
      setError("");
    } else if (editMode && checkEditDuplicate) {
      checkEditDuplicate && setTaskValidate("Enter unique task name.");
    } else {
      !editMode
        ? dispatch(addTask(getData))
        : dispatch(
            editTask({
              id: editableId,
              title: title,
              date: tarikh,
              priorty: prioty,
            })
          );
      setTitle("");
      setTarikh("");
      setPrioty("");
      setError("");
      setTaskValidate("");
      setEditMode(false);
    }
  };

  const editChange = (id) => {
    setEditMode(true);
    setEditatbleId(id);
    setError("");
    const setEditField = taskdata.filter((data) => data.id === id);
    setTitle(setEditField[0].title);
    setTarikh(setEditField[0].date);
    setPrioty(setEditField[0].priorty);
  };

  const cancleEdit = () => {
    setEditMode(false);
    setError("");
    setTitle("");
    setTarikh("");
    setPrioty("");
    setTaskValidate("");
  };

  return (
    <>
      <div className="box-main">
        <h3 className="alignment-left" style={{ color: "purple" }}>
          Backlog: {backdata?.length}
        </h3>
        <h3 className="alignment-left" style={{ color: "orange" }}>
          Ongoing: {pendingdata?.length}
        </h3>
        <h3 className="alignment-left" style={{ color: "blue" }}>
          Todo: {tododata?.length}
        </h3>
        <h3 className="alignment-left" style={{ color: "green" }}>
          Done: {completeddata?.length}
        </h3>

        <div className="alignment-right">
          <img
            // className="preview"
            src={getUser?.proImg}
            alt=""
            width="40px"
            height="30px"
          />
          <strong style={{ marginRight: "20px" }}>
            {googleUser?.username === undefined && googleUser?.name
              ? googleUser.name
              : getUser.name}
          </strong>

          <button type="button" className="btn btn-light" onClick={logout}>
            Logout
          </button>
        </div>
      </div>
      <br />
      <div>
        <form>
          <input
            type="text"
            placeholder="Task name"
            value={title.trimStart()}
            onChange={(e) => setTitle(e.target.value)}
          />

          <select onChange={(e) => setPrioty(e.target.value)} value={prioty}>
            <option value="">Select</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <input
            type="date"
            name="deadline"
            min={currentDate}
            value={tarikh}
            onChange={(e) => setTarikh(e.target.value)}
          />
          <button onClick={add}>
            {!editMode ? "Create Task" : "Save Task"}
          </button>
          {editMode && <button onClick={cancleEdit}>Cancle</button>}
        </form>
      </div>
      <span style={{ color: "red" }}>{error ? error : taskValidate}</span>

      <br />

      <div className="Apptask">
        <TaskList
          editChange={editChange}
          pendings={pendingdata}
          todos={tododata}
          dones={completeddata}
          backlogs={backdata}
        />
      </div>
    </>
  );
};

export default Dashboard;
