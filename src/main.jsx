import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store from "./store/store.js";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Account, Videolist, VideoPlayer } from "./pages/Index.jsx";
import Channel from "./pages/Channel.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Videolist /> },
      { path: "/account", element: <Account /> },
      { path: "/video/:id", element: <VideoPlayer /> },
      { path: "/channel", element: <Channel /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
