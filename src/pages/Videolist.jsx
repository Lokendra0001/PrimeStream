import { useEffect, useState } from "react";
import fetchApiData from "../Service/Service";
import PrimeStreamCard from "../components/PrimeStreamCard";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useLocation } from "react-router-dom";
import { addQuery, toggleSidebar } from "../store/QuerySlice";

const Videolist = () => {
  const selectedCategory = useSelector((state) => state.app.currentCategory);
  const query = useSelector((state) => state.app.query);
  const [data, setData] = useState([]);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [initialLoad, setInitialLoad] = useState(true);
  const [loading, setLoading] = useState(true);
  const [skeletonCount, setSkeletonCount] = useState(10);
  const dispatch = useDispatch();
  const location = useLocation();
  const [error, setError] = useState(false);

  useEffect(() => {
    const searchParam = new URLSearchParams(location.search).get("q");
    if (searchParam) {
      dispatch(addQuery(searchParam));
      // call fetch logic here using searchParam
    }
  }, [location.search]);

  const fetchVideos = async (query, pageToken = "") => {
    setError(false);
    setLoading(true);
    try {
      const res = await fetchApiData(query, pageToken);
      if (res) {
        if (!pageToken) {
          setData(res.items);
        } else {
          setData((prev) => [...prev, ...res.items]);
        }
        setNextPageToken(res.nextPageToken);
        setSkeletonCount(res.items.length);
      }
    } catch (error) {
      setError(true);
    }
    setTimeout(() => {
      setLoading(false);
      setInitialLoad(false);
    }, 1000);
  };

  useEffect(() => {
    setData([]);
    setNextPageToken(null);
    setInitialLoad(true);
    fetchVideos(selectedCategory, "");
  }, [selectedCategory]);

  useEffect(() => {
    setData([]);
    setNextPageToken(null);
    setInitialLoad(true);
    fetchVideos(query, "");
  }, [query]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 w-full p-3 pt-4 mx-auto h-[90dvh] overflow-y-auto place-items-center dark:bg-black/[92%]">
      {initialLoad
        ? Array(skeletonCount)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="flex flex-col gap-2 w-full max-w-sm p-2 rounded-md bg-gray-200 shadow-sm dark:bg-transparent"
              >
                <Skeleton
                  className="w-full h-[180px] rounded-lg"
                  baseColor="rgba(255, 255, 255, 0.05)"
                  highlightColor="rgba(255, 255, 255, 0.15)"
                />
                <Skeleton
                  width={250}
                  className=" h-5 rounded-md"
                  baseColor="rgba(255, 255, 255, 0.05)"
                  highlightColor="rgba(255, 255, 255, 0.15)"
                />
                <Skeleton
                  width={140}
                  className="w-1/2 h-4 rounded-md"
                  baseColor="rgba(255, 255, 255, 0.05)"
                  highlightColor="rgba(255, 255, 255, 0.15)"
                />
              </div>
            ))
        : data.map((e, index) => (
            <NavLink
              to={`/video/${e.id.videoId}`}
              key={index}
              state={{ item: e }}
              className="hover:opacity-90 transition-opacity w-full"
            >
              <PrimeStreamCard item={e} />
            </NavLink>
          ))}

      <div className="flex justify-center my-4 col-span-full">
        {nextPageToken && (
          <button
            className="px-4 py-2 bg-black/90 dark:bg-red-600 text-white rounded cursor-pointer hover:bg-black dark:hover:bg-red-700 disabled:opacity-50 transition-colors"
            onClick={() =>
              fetchVideos(query ? query : selectedCategory, nextPageToken)
            }
            disabled={loading}
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        )}
        {error && !loading && (
          <div className="flex flex-col items-center justify-center space-y-4 py-6">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-bold  tracking-wider  text-red-500">
                Connection Error!
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md px-4">
                Server capacity is temporarily maxed out. Please try again in a
                little while.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white rounded-md transition-colors flex items-center mx-auto"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                    clipRule="evenodd"
                  />
                </svg>
                Retry Connection
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Videolist;
