import { LOGOUT, SET_TOKEN } from "../actions";

const tokenReducer = (state = { token: localStorage.getItem("token") || null }, action) => {
  switch (action.type) {
    case SET_TOKEN:
      return { ...state, token: action.payload };
    case LOGOUT:
      return { ...state, token: null };
    default:
      return state;
  }
};
export default tokenReducer;
