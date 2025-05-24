import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  query: "",
  currentCategory: "Home",
  isSidebarOpen: true,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    addQuery: (state, action) => {
      state.query = action.payload;
    },
    setCurrentCategory: (state, action) => {
      state.currentCategory = action.payload;
    },
    setSidebarOpen: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    toggleSidebar: (state, action) => {
      state.isSidebarOpen = action.payload;
    },
  },
});

export const { addQuery, setCurrentCategory, setSidebarOpen, toggleSidebar } =
  appSlice.actions;
export default appSlice.reducer;
