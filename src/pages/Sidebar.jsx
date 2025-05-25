import {
  Download,
  Home,
  Flame,
  Music,
  Gamepad2,
  Shirt,
  Podcast,
  Newspaper,
  Trophy,
  Lightbulb,
  Film,
  Code2,
  User,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addQuery, toggleSidebar } from "../store/QuerySlice";
import { setCurrentCategory, setSidebarOpen } from "../store/QuerySlice";
import { NavLink } from "react-router-dom";

const Sidebar = ({}) => {
  const [isMobile, setIsMobile] = useState(false);
  const dispatch = useDispatch();
  const selectedCategory = useSelector((state) => state.app.currentCategory);
  const isSideOpen = useSelector((state) => state.app.isSidebarOpen);

  const mainLinks = [{ icon: <Home size={18} />, link: "Home" }];

  const categories = [
    { icon: <Flame size={18} />, name: "Trending" },
    { icon: <Music size={18} />, name: "Music" },
    { icon: <Gamepad2 size={18} />, name: "Gaming" },
    { icon: <Newspaper size={18} />, name: "News" },
    { icon: <Trophy size={18} />, name: "Sports" },
    { icon: <Lightbulb size={18} />, name: "Learning" },
    { icon: <Shirt size={18} />, name: "Fashion" },
    { icon: <Podcast size={18} />, name: "Podcasts" },
    { icon: <Film size={18} />, name: "Movies" },
    { icon: <Code2 size={18} />, name: "Coding" },
  ];

  function onSelectCategory(category) {
    dispatch(setCurrentCategory(category));
  }

  function onClose(open) {
    dispatch(setSidebarOpen(open));
  }

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 630);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMainLink = (itemName) => {
    onSelectCategory(itemName);
    dispatch(addQuery(itemName));
    if (window.innerWidth < 680) dispatch(toggleSidebar(false));
  };

  return (
    <>
      {/* Overlay div */}
      {isSideOpen && isMobile && (
        <div
          onClick={() => onClose(!isSideOpen)}
          className="fixed left-0 right-0 bottom-0 top-[10dvh] bg-black/50 dark:bg-black/70 z-40"
          aria-hidden="true"
        />
      )}

      <div
        className={`fixed top-[10dvh] h-[90dvh] bg-white dark:bg-[#0f0f0f]  flex flex-col  
        overflow-y-hidden hover:overflow-y-auto overflow-x-hidden scrollbar-auto-hide shadow-2xl z-50
        ${isSideOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0"} 
        ${isSideOpen ? "w-52 p-3 pl-1 md:pl-3" : "w-14 p-2.5"} 
        sm:static`}
      >
        {/* Main Links */}
        <div
          className={`mb-2 w-full flex flex-col ${
            !isSideOpen && "items-center gap-1.5 mb-0"
          }`}
        >
          {mainLinks.map((item, index) => (
            <NavLink
              to={""}
              key={index}
              className={`flex items-center p-2 mb-1 rounded-lg gap-3 cursor-pointer 
              ${
                selectedCategory === item.link
                  ? " dark:bg-white/15 dark:hover:bg-white/25 dark:text-white text-black bg-black/10 "
                  : "bg-transparent hover:bg-black/5 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300"
              }`}
              onClick={() => {
                handleMainLink(item.link);
              }}
              title={!isSideOpen ? item.link : undefined}
            >
              <span
                className={`${
                  selectedCategory === item.link
                    ? "text-red-500"
                    : "text-gray-500"
                }`}
              >
                {item.icon}
              </span>
              <span
                className={`text-sm font-normal  tracking-wide ${
                  !isSideOpen && "sm:hidden"
                }`}
              >
                {item.link}
              </span>
            </NavLink>
          ))}
        </div>

        {/* Categories */}
        <div
          className={`border-t border-gray-200 dark:border-gray-700 pt-3 flex flex-col w-full ${
            !isSideOpen && "items-center"
          }`}
        >
          <h3
            className={`px-2 font-semibold text-gray-500 dark:text-gray-400 mb-1 tracking-wide ${
              isSideOpen ? "text-sm" : "text-xs"
            }`}
          >
            Explore
          </h3>
          <div
            className={`grid grid-cols-1 gap-1 w-full ${
              !isSideOpen && "md:place-items-center gap-1.5"
            }`}
          >
            {categories.map((category, index) => (
              <NavLink
                to={""}
                key={index}
                className={`flex items-center p-2 rounded-lg gap-3 cursor-pointer
                ${
                  selectedCategory === category.name
                    ? " dark:bg-white/15 dark:hover:bg-white/25 dark:text-white text-black bg-black/10 "
                    : "bg-transparent hover:bg-black/5 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300"
                }`}
                onClick={() => {
                  dispatch(setCurrentCategory(category.name));
                  if (window.innerWidth < 680) dispatch(toggleSidebar(false));
                }}
                title={!isSideOpen ? category.name : undefined}
              >
                {category.icon && (
                  <span
                    className={`${
                      selectedCategory === category.name
                        ? "text-red-500"
                        : "text-gray-500"
                    }`}
                  >
                    {category.icon}
                  </span>
                )}
                <span
                  className={`text-sm font-normal tracking-wide ${
                    !isSideOpen && "sm:hidden"
                  }`}
                >
                  {category.name}
                </span>
              </NavLink>
            ))}
          </div>
        </div>

        {/* Footer */}
        {isSideOpen && (
          <div className="mt-auto pt-1 flex flex-col items-center md:items-start border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400 space-y-1 w-full">
            <p>© 2025 PrimeStream</p>
            <p>Terms · Privacy · Policy</p>
          </div>
        )}
      </div>
    </>
  );
};

export default Sidebar;
