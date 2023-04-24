import { createSlice } from "@reduxjs/toolkit";

const initialStateValue = {
  Registration: [],
};

export const createAuth = createSlice({
  name: "UserAuth",
  initialState: initialStateValue,
  reducers: {
    addRegisterUser: (state, action) => {
      state.Registration.push(action.payload);
    },
    deleteUser: (state, action) => {
      state.Registration = state.Registration.filter(
        (data) => data.id !== action.payload
      );
    },
  },
});

// Action creators are generated for each case reducer function
export const { addRegisterUser, deleteUser } = createAuth.actions;

export default createAuth.reducer;
