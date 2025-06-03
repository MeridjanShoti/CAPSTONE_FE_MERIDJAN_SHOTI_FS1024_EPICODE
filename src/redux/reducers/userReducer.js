import { CLEAR_ERROR, LOGIN_FAILURE, LOGOUT, SET_USER } from "../actions";

const userReducer = (state = { user: null }, action) => {
  switch (action.type) {
    case SET_USER:
      return { ...state, user: action.payload };
    case LOGOUT:
      return { ...state, user: null };
    case LOGIN_FAILURE:
      return { ...state, error: action.payload.error };
    case CLEAR_ERROR:
      return { ...state, error: null };

    default:
      return state;
  }
};
export default userReducer;
