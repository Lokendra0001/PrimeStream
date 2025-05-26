import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  fetchChannelDetails,
  fetchChannelVideos,
  fetchStats,
} from "../Service/Service";
import { NavLink } from "react-router-dom";
import PrimeStreamCard from "../components/PrimeStreamCard";
import Skeleton from "react-loading-skeleton";
import { BsCollectionPlay } from "react-icons/bs";
import { toggleSidebar } from "../store/QuerySlice";
import { useDispatch } from "react-redux";
import { Verified } from "lucide-react";

function Channel() {
  const location = useLocation();
  const [initialLoad, setInitialLoad] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [skeletonCount, setSkeletonCount] = useState(8);
  const [data, setData] = useState([]);
  const [activeTab, setActiveTab] = useState("videos");
  const [channelInfo, setChannelInfo] = useState({
    name: "",
    subscribers: 0,
    videos: 0,
    banner: null,
    avatar: null,
    description:
      "This channel creates awesome content about technology, design, and more!",
  });
  const [nextPageToken, setnextPageToken] = useState(null);
  const dispatch = useDispatch();

  const fetchVideos = async (chId, token = "") => {
    setLoading(true);
    setInitialLoad(token == "");
    try {
      const res = await fetchChannelVideos(chId, token);
      if (res) {
        if (!token) {
          setData(res.items);
        } else {
          setData((prev) => [...prev, ...res.items]);
        }
        setnextPageToken(res.nextPageToken);
        setSkeletonCount(res.items.length);
        setChannelInfo((prev) => ({
          ...prev,
          name: res.items[0].snippet.channelTitle,
        }));
      }
    } catch (error) {
      setError(true);
    }
    const detail = await fetchStats(location.state?.channelId);
    if (detail) {
      setChannelInfo((prev) => ({
        ...prev,
        subscribers: detail[0].statistics.subscriberCount,
        videos: detail[0].statistics.videoCount,
      }));
    }

    const data = await fetchChannelDetails(location.state?.channelId);
    if (data) {
      setChannelInfo((prev) => ({
        ...prev,
        avatar: data.snippet.thumbnails.default.url,
        description: data.snippet.localized.description,
        banner: data.brandingSettings.image.bannerExternalUrl,
      }));
    }
    setTimeout(() => {
      setInitialLoad(false);
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    if (location.state) {
      fetchVideos(location.state?.channelId, "");
    }
  }, [location.state]);

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
    <div className="w-full h-[90dvh] overflow-y-auto bg-gray-50 dark:bg-black/[92%]">
      {/* Channel Banner */}
      <div className="relative w-full h-48 sm:h-60 bg-gradient-to-r overflow-hidden">
        <img
          src={channelInfo.banner}
          alt="Banner"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      </div>

      {/* Channel Header */}
      <div className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 sm:gap-6 -mt-16 pb-6">
          <div className="relative group">
            <img
              src={channelInfo.avatar}
              alt="Channel"
              className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-900 object-cover shadow-lg"
            />
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 sm:text-white dark:text-white">
                {channelInfo.name}
              </h1>
              <span className=" text-xs   rounded-full">
                <Verified className="inline h-4 text-white" />
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600 sm:text-gray-400 dark:text-gray-300">
              <span>@{channelInfo.name}</span>
              <span>{channelInfo.subscribers} subscribers</span>
              <span>{channelInfo.videos} videos</span>
            </div>

            <p className="text-gray-700 dark:text-gray-300 max-w-3xl line-clamp-2">
              {channelInfo.description}
            </p>

            <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full font-medium transition-all">
              Subscribe
            </button>
          </div>
        </div>

        {/* Channel Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("videos")}
              className={`py-4 px-1 font-medium text-sm border-b-2 ${
                activeTab === "videos"
                  ? "border-red-600 text-red-600 dark:text-red-500"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              <BsCollectionPlay className="inline mr-2" /> Videos
            </button>
          </nav>
        </div>
      </div>

      {/* Video Grid */}
      <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 w-full p-3 pt-4  ">
          {initialLoad ? (
            Array(skeletonCount)
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
          ) : data.length > 0 ? (
            data.map((e, index) => (
              <NavLink
                to={`/video/${e.id.videoId}`}
                key={index}
                state={{ item: e }}
                className="group"
              >
                <PrimeStreamCard item={e} channelPage={true} />
              </NavLink>
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 mx-auto mb-6 text-gray-400 dark:text-gray-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                  No videos found
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  This channel hasn't posted any videos yet.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {nextPageToken && (
        <div className="w-full flex justify-center pb-5">
          <button
            className="px-4 py-2 bg-black/90 dark:bg-red-600 text-white rounded cursor-pointer hover:bg-black dark:hover:bg-red-700 disabled:opacity-50 transition-colors"
            onClick={() =>
              fetchVideos(location.state?.channelId, nextPageToken)
            }
            disabled={loading}
          >
            {loading ? "loading..." : "Load More"}
          </button>
        </div>
      )}
      {error && (
        <div className="flex flex-col items-center justify-center space-y-4 py-6">
          <div className="text-center space-y-2">
            <h3 className="text-lg font-bold  tracking-wider  text-red-500">
              Error : Too Many Request. Try again later!
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
  );
}

export default Channel;
