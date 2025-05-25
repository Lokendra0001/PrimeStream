import { useState } from "react";
import hamburger from "../assets/hamburger.svg";
import primeStreamLogo from "../assets/primeStreamLogo.png";
import { ArrowLeft, Search, X } from "lucide-react";
import { useDispatch } from "react-redux";
import {
  addQuery,
  setCurrentCategory,
  setSidebarOpen,
} from "../store/QuerySlice";
import { NavLink, useNavigate } from "react-router-dom";

const Header = () => {
  const [val, setVal] = useState("");
  const [searchBarOpen, setSearchBarOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSearch = () => {
    setSearchBarOpen(true);
    if (val) {
      dispatch(addQuery(val));
      dispatch(setCurrentCategory(""));
      navigate(`/?q=${encodeURIComponent(val)}`);
    }
  };

  return (
    <nav className="flex justify-between items-center h-[10dvh] w-full px-2 sm:px-3 shadow-sm bg-white dark:bg-[#0f0f0ffd]  dark:border-gray-700">
      {/* Left Section - Logo and Menu */}
      {searchBarOpen && (
        <button
          type="button"
          className={`${
            searchBarOpen ? "pr-1 py-2" : ""
          } sm:px-3 sm:py-2 text-gray-600 dark:text-gray-300 cursor-pointer text-center block sm:hidden`}
          onClick={() => {
            setSearchBarOpen(false);
            navigate("/");
            setVal("");
            dispatch(addQuery("home"));
          }}
        >
          <ArrowLeft size={20} />
        </button>
      )}

      <div
        className={`flex items-center gap-4 ${
          searchBarOpen ? "hidden sm:flex" : "flex"
        }`}
      >
        <button
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition"
          onClick={() => dispatch(setSidebarOpen())}
        >
          <img src={hamburger} width={24} alt="Menu" className="dark:invert" />
        </button>

        <NavLink to={"/"} className={`flex items-center gap-2 cursor-pointer`}>
          <img
            src={primeStreamLogo}
            width={30}
            className="sm:h-[30px] "
            alt="PrimeStream Logo"
          />
          <h1 className="sm:text-[22px] text-[21px] font-[Roboto,'sans serif'] tracking-wider mt-0.5 font-semibold text-gray-800 dark:text-white">
            PrimeStream
          </h1>
        </NavLink>
      </div>

      {/* Right Section - Search */}
      <div
        className={`flex items-center sm:w-1/3 gap-1 rounded-lg 
        ${searchBarOpen ? "border-[1px] " : "sm:border-[1px]"}  
        border-gray-300 dark:border-white/20 focus:bg-gray-100 dark:focus:bg-gray-800 overflow-hidden 
        ${searchBarOpen && "w-full"}`}
      >
        <input
          type="text"
          className={`w-full bg-transparent outline-none pl-2 text-gray-900 dark:text-white dark:placeholder-gray-400
          ${searchBarOpen ? "block" : "hidden"} sm:block`}
          placeholder="Search here..."
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
        />
        <button
          type="button"
          className={`cursor-pointer self-center text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400
            ${val && searchBarOpen ? "block" : "hidden"}
            ${val ? "sm:block" : "sm:hidden"}`}
          onClick={() => setVal("")}
        >
          <X size={19} />
        </button>
        <button
          type="button"
          className={`${
            searchBarOpen && "pr-1.5 pl-0.5 py-2"
          } sm:px-3 sm:py-2 text-gray-900 dark:text-gray-300 sm:bg-gray-100 dark:sm:bg-white/15 cursor-pointer hover:bg-gray-200 dark:hover:bg-white/25`}
          onClick={handleSearch}
        >
          <Search size={17} />
        </button>
      </div>
    </nav>
  );
};

export default Header;
