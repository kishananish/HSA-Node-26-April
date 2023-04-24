import DropdownMore from "./DropDown";
import { onDragEnter, onDragLeave } from "./DragFunction";
import "./styles.css";
const DivCard = ({
  editChange,
  stage,
  data,
  onDragEnd,
  onDragOver,
  onDrop,
}) => {
  return (
    <>
      <div
        style={{
          width: "250px",
          border: "2px solid black",
          margin: "4px",
          overflowY: "scroll",
          height: "500px",
        }}
        onDragLeave={(e) => onDragLeave(e)}
        onDragEnter={(e) => onDragEnter(e)}
        onDragEnd={(e) => onDragEnd(e)}
        onDragOver={(e) => onDragOver(e)}
        onDrop={(e) => onDrop(e, stage)}
      >
        <DropdownMore data={data} editChange={editChange} />
      </div>
    </>
  );
};
export default DivCard;
