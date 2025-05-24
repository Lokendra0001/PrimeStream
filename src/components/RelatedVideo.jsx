import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import fetchApiData from "../Service/Service";
import { useSelector } from "react-redux";

const RelatedVideo = ({ currentVideoId }) => {
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const category = useSelector((state) => state.app.query);

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

  useEffect(() => {
    const getRelatedVideos = async () => {
      try {
        setLoading(true);
        const data = await fetchApiData(category);
        if (data && data.items) {
          setRelatedVideos(data.items);
        } else {
          setRelatedVideos([]); // or handle the error case
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (currentVideoId) {
      getRelatedVideos();
    }
  }, [currentVideoId, category]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex space-x-2 animate-pulse">
            <div className="w-40 h-24 bg-gray-300 dark:bg-transparent rounded"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
              <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500">Error loading related videos: {error}</div>
    );
  }

  return (
    <div className="space-y-3">
      {relatedVideos.map((video) => (
        <NavLink
          to={`/video/${video.id.videoId}`}
          state={{ item: video }}
          key={video.id.videoId || video.id}
          className="flex cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors"
        >
          <div className="relative w-40 flex-shrink-0">
            <img
              src={video.snippet.thumbnails.medium.url}
              alt={video.snippet.title}
              className="w-full h-24 object-cover rounded-lg"
            />
          </div>
          <div className="ml-2 overflow-hidden">
            <h3 className="font-medium text-sm line-clamp-2 dark:text-white">
              {video.snippet.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">
              {video.snippet.channelTitle}
            </p>
            <div className="flex items-center text-gray-600 dark:text-gray-400 text-xs mt-1">
              {/* <span>{formatViewCount(video.statistics?.viewCount || 0)} views</span> */}
              <span className="mx-1">•</span>
              <span>{getTimeAgo(video.snippet.publishedAt)}</span>
            </div>
          </div>
        </NavLink>
      ))}
    </div>
  );
};

export default RelatedVideo;
