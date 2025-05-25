import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  fetchApiVideos,
  fetchChannelDetails,
  fetchChannelVideos,
  fetchStats,
} from "../Service/Service";
import { NavLink } from "react-router-dom";
import PrimeStreamCard from "../components/PrimeStreamCard";
import Skeleton from "react-loading-skeleton";
import { FiYoutube } from "react-icons/fi";
import { BsGrid3X3Gap, BsCollectionPlay } from "react-icons/bs";
import { RiLiveLine } from "react-icons/ri";

function Channel() {
  const location = useLocation();
  const [initialLoad, setInitialLoad] = useState(true);
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

  const fetchVideos = async (chId) => {
    setInitialLoad(true);
    const res = await fetchChannelVideos(chId);
    if (res) {
      setData(res);
      console.log(res);
      setChannelInfo((prev) => ({
        ...prev,
        name: res[0].snippet.channelTitle,
      }));

      setSkeletonCount(res.length);
      setTimeout(() => {
        setInitialLoad(false);
      }, 1000);
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
      console.log(data);
      setChannelInfo((prev) => ({
        ...prev,
        avatar: data.snippet.thumbnails.default.url,
        description: data.snippet.localized.description,
        banner: data.brandingSettings.image.bannerExternalUrl,
      }));
    }
  };

  useEffect(() => {
    if (location.state) {
      fetchVideos(location.state?.channelId);
    }
  }, [location.state]);

  return (
    <div className="w-full h-[90vh] overflow-y-auto bg-gray-50 dark:bg-black/[92%]">
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
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
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                {channelInfo.name}
              </h1>
              <span className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 rounded-full">
                <FiYoutube className="inline mr-1" /> Verified
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600 dark:text-gray-300">
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
                  className="flex flex-col gap-3 w-full rounded-lg overflow-hidden bg-white dark:bg-black/[92%]shadow-sm hover:shadow-md transition-shadow"
                >
                  <Skeleton
                    className="w-full aspect-video rounded-t-lg"
                    baseColor="#f3f4f6"
                    highlightColor="#e5e7eb"
                    darkBaseColor="rgba(31, 41, 55, 0.5)"
                    darkHighlightColor="rgba(31, 41, 55, 0.8)"
                  />
                  <div className="p-3">
                    <Skeleton
                      width="80%"
                      height={20}
                      className="rounded-md mb-2"
                    />
                    <Skeleton width="60%" height={16} className="rounded-md" />
                  </div>
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
    </div>
  );
}

export default Channel;
