import { User } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchApiVideos } from "../Service/Service";

const PrimeStreamCard = ({ item }) => {
  const [duration, setDuration] = useState(0);

  const getTimeAgo = (publishedAt) => {
    const pubDate = new Date(publishedAt);
    const now = new Date();

    const diffMs = now - pubDate;
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);

    if (diffYears > 0) {
      return diffYears === 1 ? "1 year ago" : `${diffYears} years ago`;
    }
    if (diffMonths > 0) {
      return diffMonths === 1 ? "1 month ago" : `${diffMonths} months ago`;
    }
    if (diffDays > 0) {
      return diffDays === 1 ? "1 day ago" : `${diffDays} days ago`;
    }
    if (diffHours > 0) {
      return diffHours === 1 ? "1 hour ago" : `${diffHours} hours ago`;
    }
    if (diffMinutes > 0) {
      return diffMinutes === 1 ? "1 minute ago" : `${diffMinutes} minutes ago`;
    }
    return "Just now";
  };

  function parseYouTubeDuration(duration) {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);

    const hours = (match[1] || "0H").slice(0, -1);
    const minutes = (match[2] || "0M").slice(0, -1);
    const seconds = (match[3] || "0S").slice(0, -1);

    const h = String(hours).padStart(2, "0");
    const m = String(minutes).padStart(2, "0");
    const s = String(seconds).padStart(2, "0");

    return h === "00" ? `${m}:${s}` : `${h}:${m}:${s}`;
  }

  // setDuration(parsedVal);

  useEffect(() => {
    const fetchVideo = async () => {
      const data = await fetchApiVideos(item.id.videoId);
      const val = parseYouTubeDuration(data[0].contentDetails.duration);
      setDuration(val);
    };
    fetchVideo();
  }, [item]);

  return (
    <div className="h-[300px] w-full sm:w-full lg:w-full bg-white dark:bg-transparent rounded-lg overflow-hidden cursor-pointer  duration-200 ">
      {/* Thumbnail with duration badge */}
      <div className="relative">
        <img
          className="w-full h-46 sm:h-48 object-fill"
          src={item.snippet.thumbnails.medium.url}
          alt={item.snippet.title}
          loading="lazy"
        />
        <span className="absolute bottom-2 right-2 bg-black/80 dark:bg-gray-900/90 text-white text-xs px-1.5 py-0.5 rounded select-none">
          {duration}
        </span>
      </div>

      {/* Video info */}
      <div className="flex p-3 gap-3">
        {/* Channel icon */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
            {item.snippet.thumbnails.default.url ? (
              <img
                src={item.snippet.thumbnails.default.url}
                alt="channel"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <User className="w-6 h-6 text-gray-500 dark:text-gray-400" />
            )}
          </div>
        </div>

        {/* Video details */}
        <div className="flex-grow overflow-hidden">
          <h3 className="font-[Roboto,sans-serif] font-semibold text-sm sm:text-sm tracking-wide line-clamp-2 text-black dark:text-white">
            {item.snippet.title}
          </h3>
          <p className="text-xs sm:text-xs text-gray-500 dark:text-gray-400 font-semibold tracking-wide mt-1 truncate">
            {item.snippet.channelTitle}
          </p>
          <div className="flex items-center text-xs sm:text-xs text-gray-800 dark:text-gray-400 mt-1">
            <span>100K views</span>
            <span className="mx-1 select-none">•</span>
            <span>{getTimeAgo(item.snippet.publishedAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrimeStreamCard;
