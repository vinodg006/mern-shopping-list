import { USER_LOADED, USER_LOADING, AUTH_ERROR } from "../actions/types";
import axios from "axios";
import { returnErrors } from "./errorActions";

//Check token and load user

export const loadUser = () => (dispatch, getState) => {
  //User loading
  dispatch({ type: USER_LOADING });

  axios
    .get("api/auth/user", tokenConfig(getState))
    .then((res) => dispatch({ type: USER_LOADED, payload: res.data }))
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
      dispatch({ type: AUTH_ERROR });
    });
};

//Setup config headers and token
export const tokenConfig = (getState) => {
  //Get  token from localStorage.
  const token = getState().auth.token;

  //Headers
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  //If token add to header
  if (token) {
    config.headers["x-auth-token"] = token;
  }

  return config;
};
