import { createSlice } from "@reduxjs/toolkit";
const initialState = { 
  loggedIn: null,
};

const App= createSlice({
  name: "app",
  initialState,
  reducers: {
   

    setLoggedin(state){
        state.loggedIn = true
    },  

    setLogOut(state){
      state.loggedIn = false
  } ,
  },
});
export const AppActions = App.actions;
export default  App.reducer;
