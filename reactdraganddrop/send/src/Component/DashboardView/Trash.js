import { onDragEnter, onDragLeave } from "./DragFunction";
const Trash = ({ onDragEnd, onDragOver, onDrop }) => {
  return (
    <div>
      <div
        style={{
          width: "150px",
          border: "2px solid",
          margin: "4px",
          borderRadius: "15px",
          height: "80px",
          position: "fixed",
          backgroundColor: "#ff3333",
          bottom: 100,
          right: 80,
          paddingTop: 20,
        }}
        onDragLeave={(e) => onDragLeave(e)}
        onDragEnter={(e) => onDragEnter(e)}
        onDragEnd={(e) => onDragEnd(e, "delete")}
        onDragOver={(e) => onDragOver(e)}
        onDrop={(e) => onDrop(e, "delete")}
      >
        <h3>Trash</h3>
      </div>
    </div>
  );
};
export default Trash;
