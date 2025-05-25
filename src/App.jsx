import Container from "./components/Container";
import { Header } from "./pages/Index";
import { useEffect } from "react";
import { Sidebar } from "./pages/Index";
import { useDispatch } from "react-redux";
import { toggleSidebar } from "./store/QuerySlice";
import { Outlet } from "react-router-dom";

function App() {
  const dispatch = useDispatch();
  //Collapse the sidebar if screen width is < 680px
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 680) {
        dispatch(toggleSidebar(false));
      } else {
        dispatch(toggleSidebar(true));
      }
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <Container>
        <Header />
        <div className="w-full  flex ">
          <Sidebar />
          <Outlet />
        </div>
      </Container>
    </>
  );
}

export default App;
