import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "../reducers/userReducer";

const mainReducer = combineReducers({
  user: userReducer,
});
const store = configureStore({
  reducer: mainReducer,
});
export default store;
