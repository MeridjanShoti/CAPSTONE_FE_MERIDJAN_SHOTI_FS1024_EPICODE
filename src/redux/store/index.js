import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "../reducers/userReducer";
import tokenReducer from "../reducers/tokenReducer";

const mainReducer = combineReducers({
  token: tokenReducer,
  user: userReducer,
});
const store = configureStore({
  reducer: mainReducer,
});
export default store;
