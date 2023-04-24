import { createSlice } from "@reduxjs/toolkit";

const initialStateValue = {
  taskdata: [],
};

export const createTask = createSlice({
  name: "task",
  initialState: initialStateValue,
  reducers: {
    addTask: (state, action) => {
      state.taskdata.push(action.payload);
    },
    deleteTask: (state, action) => {
      state.taskdata = state.taskdata.filter(
        (data) => data.id !== action.payload
      );
    },
    deleteDragTask: (state, action) => { },
    editTask: (state, action) => {
      const { id, title, date, priorty } = action.payload;

      state.taskdata = state.taskdata.map((data) =>
        data.id === id
          ? { ...data, title: title, date: date, priorty: priorty }
          : data
      );
    },
    pendingTask: (state, action) => {
      state.taskdata = state.taskdata.map((data) =>
        data.id === action.payload ? { ...data, stage: "pending" } : data
      );

    },
    doneTask: (state, action) => {
      state.taskdata = state.taskdata.map((data) =>
        data.id === action.payload ? { ...data, stage: "done" } : data
      );
    },
    backlogTask: (state, action) => {
      state.taskdata = state.taskdata.map((data) =>
        data.id === action.payload ? { ...data, stage: "backlog" } : data
      );
    },
    todoTask: (state, action) => {
      state.taskdata = state.taskdata.map((data) =>
        data.id === action.payload ? { ...data, stage: "todo" } : data
      );
    },
    moveTask: (state, action) => {
      const { data, value } = action.payload;

      state.taskdata = state.taskdata.map((task) => {
        if (task.id == data) task.stage = value;
        return task;
      });
    },
  },
});


export const {
  addTask,
  deleteTask,
  editTask,
  pendingTask,
  doneTask,
  todoTask,
  moveTask,
  deleteDragTask,
  backlogTask
} = createTask.actions;

export default createTask.reducer;
