import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./QuerySlice"; // import the slice reducer (default export)

const store = configureStore({
  reducer: {
    app: appReducer, // key 'app' so useSelector(state => state.app.currentCategory) works
  },
});

export default store;
