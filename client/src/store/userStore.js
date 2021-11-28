import { createSlice } from "@reduxjs/toolkit";
import { AppActions } from "./AppStore";
import { toast } from "react-toastify";
import { getAuthedToken, RemoveCookie } from "../Utils/Helpers";

const initialState = {
  user: {
    id: "",
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    age: "",
    role: "",
  },
};

const user = createSlice({
  name: "User",
  initialState,
  reducers: {
    signinUser(state, action) {
      state.user = action.payload;
    },
  },
});

//user actions
export const LoginUser = (values) => {
  return async (dispatch) => {
    try {
      await fetch("/api/users/signin", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.message) {
            toast.error(data.message, {
              position: toast.POSITION.TOP_CENTER,
            });
          } else {
            dispatch(UserActions.signinUser(data));
            dispatch(AppActions.setLoggedin());
            toast.success("logged in success");
          }
        });
    } catch (error) {
      console.log(error);
    }
  };
};
export const RegisterUser = (values) => {
  return async (dispatch) => {
    try {
      await fetch("/api/users/register", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
          firstname: values.firstname,
          lastname: values.lastname,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.message) {
            toast.error(data.message, {
              position: toast.POSITION.TOP_CENTER,
            });
          } else {
            dispatch(UserActions.signinUser(data));
            dispatch(AppActions.setLoggedin());
            toast.success("Registered Successfully");
          }
        });
    } catch (error) {
      console.log(error);
    }
  };
};
export const isAuthedUser = () => {
  return async (dispatch) => {
    try {
      await fetch("/api/users/isauthed", getAuthedToken)
        .then((res) => res.json())
        .then((data) => {
          if (data.message) {
            dispatch(UserActions.signinUser({}));
            dispatch(AppActions.setLogOut());
          } else {
            dispatch(UserActions.signinUser(data));
            dispatch(AppActions.setLoggedin());
            toast.success(` hey,${data.firstname}`);
          }
        });
    } catch (error) {
      dispatch(UserActions.signinUser({}));
      dispatch(AppActions.setLogOut());
      toast.error("sing up or login");
    }
  };
};
export const LogOutUser = () => {
  return async (dispatch) => {
    RemoveCookie();
    dispatch(UserActions.signinUser({}));
    dispatch(AppActions.setLogOut());
    toast.success("Logged out Successfully");
  };
};

/*----------------------------*/
export const UserActions = user.actions;
export default user.reducer;
