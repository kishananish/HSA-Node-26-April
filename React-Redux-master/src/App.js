import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { incNumber, decNumber, addFiveNumber } from "./actions";
import "./App.css";

const App = () => {
  const myState = useSelector((state) => state.changeTheNumber);
  const dispatch = useDispatch();
  return (
    <>
      <div classname="container">
        <h1>Increment/Decrement counter</h1>
        <h4>using React and Redux</h4>
        <div classname="quantity">
          <button
            classname="quantity__minus"
            title="Decrement"
            onClick={() => dispatch(decNumber())}
          >
            <span>-</span>
          </button>
          <input
            name="quantity"
            type="text"
            classname="quantity__input"
            value={myState}
          />
          <button
            classname="quantity__plus"
            title="Increment"
            onClick={() => dispatch(incNumber(3))}
          >
            <span>5</span>
          </button>

          <button
            classname="quantity__plus"
            title="Addfivenumber"
            onClick={() => dispatch(addFiveNumber(5))}
          >
            <span>+5</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default App;
