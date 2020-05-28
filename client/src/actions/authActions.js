import {
  USER_LOADED,
  USER_LOADING,
  AUTH_ERROR,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOGOUT_SUCCESS,
} from "../actions/types";
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

//Register User
export const register = ({ name, email, password }) => (dispatch) => {
  //Headers
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  //Request body
  const body = JSON.stringify({ name, email, password });

  axios
    .post("api/users", body, config)
    .then((res) => dispatch({ type: REGISTER_SUCCESS, payload: res.data }))
    .catch((err) => {
      dispatch(
        returnErrors(err.response.data, err.response.status, "REGISTER_FAIL")
      );
      dispatch({
        type: REGISTER_FAIL,
      });
    });
};

//Logout user
export const logout = () => {
  return {
    type: LOGOUT_SUCCESS,
  };
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
