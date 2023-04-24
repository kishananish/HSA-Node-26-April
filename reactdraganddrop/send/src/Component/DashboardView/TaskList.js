import { useState } from "react";
import { useDispatch } from "react-redux";
import { onDragEnter, onDragLeave } from "./DragFunction";
import { moveTask, deleteTask } from "../../Redux/Reducer";
import DeleteModal from "./DeleteModal";
import DivCard from "./DivCard";
import Trash from "./Trash";
const TaskList = ({ editChange, pendings, dones, todos, backlogs }) => {
  const [showDeleteColoum, setShowDeleteColoum] = useState(false);
  const [idDelete, setIdDelete] = useState();
  const [openDelete, setOpenDelete] = useState(false);
  const [dragValue, setDragValue] = useState([]);

  const dispatch = useDispatch();

  const onDrop = (evt, value) => {
    evt.preventDefault();
    evt.currentTarget.classList.remove("dragged-over");
    let data = evt.dataTransfer.getData("text/plain");
    setIdDelete(data);
    value === "delete" && setOpenDelete(true);
    setDragValue([...dragValue, value]);

    if (value === "delete") {
      return false;
    } else {
      dispatch(moveTask({ data, value }));
    }
    setShowDeleteColoum(false);
  };

  const onDragEnd = (evt, value) => {
    evt?.currentTarget?.classList?.remove("dragged");
    value === "delete" && setOpenDelete(true);
  };

  const onDragOver = (evt) => {
    evt.preventDefault();
    evt.dataTransfer.dropEffect = "move";
    setShowDeleteColoum(true);
  };

  const confirmDelete = () => {
    dispatch(deleteTask(idDelete * 1));
    setOpenDelete(false);
    setShowDeleteColoum(false);
  };
  const closeDeleteModal = () => {
    const dragHistry = dragValue.length - 1;
    const valueIndex = dragValue[dragHistry - 1];
    setShowDeleteColoum(false);
    setOpenDelete(false);
    dispatch(moveTask({ idDelete, valueIndex }));
  };

  return (
    <>
      <div className="container1">
        <div className="container1 mobileresponsive1">
          <div>
            <h3 style={{ color: "purple" }}>Backlog</h3>
            <DivCard
              data={backlogs}
              stage="backlog"
              editChange={editChange}
              onDragEnd={onDragEnd}
              onDrop={onDrop}
              onDragOver={onDragOver}
            />
          </div>

          <div>
            <h3 style={{ color: "blue" }}>Todo</h3>
            <DivCard
              data={todos}
              stage="todo"
              editChange={editChange}
              onDragEnd={onDragEnd}
              onDrop={onDrop}
              onDragOver={onDragOver}
            />
          </div>

          <div>
            <h3 style={{ color: "orange" }}>Ongoing</h3>
            <DivCard
              data={pendings}
              stage="pending"
              editChange={editChange}
              onDragEnd={onDragEnd}
              onDrop={onDrop}
              onDragOver={onDragOver}
            />
          </div>

          <div>
            <h3 style={{ color: "green" }}>Done</h3>
            <DivCard
              data={dones}
              stage="done"
              editChange={editChange}
              onDragEnd={onDragEnd}
              onDrop={onDrop}
              onDragOver={onDragOver}
            />
          </div>
        </div>
      </div>
      <DeleteModal
        show={openDelete}
        confirmDelete={confirmDelete}
        handleClose={closeDeleteModal}
      />

      {showDeleteColoum && (
        <Trash onDragEnd={onDragEnd} onDrop={onDrop} onDragOver={onDragOver} />
      )}
    </>
  );
};
export default TaskList;
