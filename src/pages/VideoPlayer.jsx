import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toggleSidebar } from "../store/QuerySlice";
import { data, useLocation, useNavigate } from "react-router-dom";
import ReactPlayer from "react-player";
import {
  fetchApiVideos,
  fetchChannelDetails,
  fetchComments,
} from "../Service/Service";
import RelatedVideo from "../components/RelatedVideo";
import { Share, ThumbsDownIcon, ThumbsUpIcon, User } from "lucide-react";

const VideoPlayer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { item } = location.state || {};
  const [channelIcon, setChannelIcon] = useState(" ");
  const [viewCount, setViewCount] = useState("");
  const [publishAt, setPublishAt] = useState("");
  const [comments, setComments] = useState([]);

  useEffect(() => {
    dispatch(toggleSidebar(false));
    return () => dispatch(toggleSidebar(true));
  }, [dispatch]);

  if (!item) {
    navigate("/");
    return null;
  }

  // ✅ Format view count and published date
  function formatVideoData(viewCount, publishedAt) {
    let formattedViews;
    if (viewCount >= 1_000_000) {
      formattedViews = (viewCount / 1_000_000).toFixed(1) + "M views";
    } else if (viewCount >= 1_000) {
      formattedViews = (viewCount / 1_000).toFixed(1) + "K views";
    } else {
      formattedViews = viewCount + " views";
    }

    const date = new Date(publishedAt);
    const formattedDate = date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    setViewCount(formattedViews);
    setPublishAt(formattedDate);
  }

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchApiVideos(item.id.videoId);
      if (data && data.length > 0) {
        formatVideoData(data[0].statistics.viewCount, item.snippet.publishedAt);
      }
    };

    const fetchChannelUrl = async () => {
      const data = await fetchChannelDetails(item.snippet.channelId);
      if (data) {
        setChannelIcon(data);
      }
    };

    const fetchComment = async () => {
      const data = await fetchComments(item.id.videoId);
      if (data) {
        setComments(data);
      }
    };

    fetchData();
    fetchChannelUrl();
    fetchComment();
  }, [item]);

  return (
    <div className="flex flex-col lg:flex-row w-full bg-gray-100 dark:bg-black/90 h-[90vh] overflow-y-auto ">
      {/* Video Area */}
      <div className="w-full lg:w-3/4 p-4">
        <div className="aspect-video bg-black rounded-xl overflow-hidden">
          <ReactPlayer
            url={`https://www.youtube.com/watch?v=${item.id.videoId}`}
            controls
            width="100%"
            height="100%"
          />
        </div>

        {/* Video Title */}
        <div className="mt-4">
          <h1 className="text-md tracking-wider sm:text-lg font-semibold sm:tracking-wide dark:text-white">
            {item.snippet.title}
          </h1>

          {/* Views and Date */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center space-x-3">
              <span className="text-xs sm:text-md text-gray-600 dark:text-gray-400">
                {viewCount}
              </span>
              <span className="text-xs sm:text-md text-gray-600 dark:text-gray-400">
                {publishAt}
              </span>
            </div>

            <div className="flex space-x-2">
              <button className="sm:px-2 sm:py-1 cursor-pointer hover:scale-[1.01] bg-gray-200 dark:bg-white/10  rounded-full">
                <span className="dark:text-white flex sm:gap-1.5 px-2 py-2 items-center text-xs sm:text-md">
                  <ThumbsUpIcon className="h-3 sm:h-4" /> Like
                </span>
              </button>
              <button className="sm:px-2 sm:py-2   cursor-pointer hover:scale-[1.01] bg-gray-200 dark:bg-white/10 rounded-full">
                <span className="dark:text-white flex sm:gap-1.5 px-2 py-2 items-center text-xs sm:text-md">
                  <Share className="h-3 sm:h-4" /> Share
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Channel Info */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-1.5 sm:space-x-3">
            <div className="w-7 sm:w-10 sm:h-10 rounded-full overflow-hidden">
              <img
                src={channelIcon}
                alt={item.snippet.channelTitle}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-medium text-[15px] sm:text-md dark:text-white">
                {item.snippet.channelTitle}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {item.channel?.statistics?.subscriberCount &&
                  `${item.channel.statistics.subscriberCount} subscribers`}
              </p>
            </div>
          </div>
          <button className="sm:px-4 sm:py-1.5 text-sm px-2 py-1 bg-red-600 text-white rounded-full tracking-wide cursor-pointer hover:bg-red-700">
            Subscribe
          </button>
        </div>

        {/* Description */}
        <div className="mt-4 p-3 bg-gray-200 dark:bg-white/10 rounded-lg">
          <p className="whitespace-pre-line text-sm sm:text-md  text-gray-800 dark:text-gray-200">
            {item.snippet.description}
          </p>
        </div>

        {/* Comments Section */}
        <div className="mt-8">
          {/* Comments Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold dark:text-white">
              {comments.length} Comments
            </h2>
            <div className="flex items-center space-x-2">
              <span className="text-gray-600 dark:text-gray-400 text-sm">
                Sort by
              </span>
              <select className="bg-gray-200 dark:bg-white/10 dark:text-white px-3 py-1 rounded-md text-sm">
                <option value="top" className="text-black">
                  Top comments
                </option>
                <option value="newest" className="text-black">
                  Newest first
                </option>
              </select>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-6">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="flex space-x-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 flex justify-center items-center">
                    <User className="dark:text-white bg-gray-300 dark:bg-white/10 p-2 h-[80%] w-[80%] rounded-full " />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium text-sm dark:text-white">
                        {
                          comment.snippet.topLevelComment.snippet
                            .authorDisplayName
                        }
                      </h3>
                      <span className="text-gray-500 dark:text-gray-400 text-xs">
                        {new Date(
                          comment.snippet.topLevelComment.snippet.publishedAt
                        ).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="mt-1 text-sm dark:text-gray-300">
                      {comment.snippet.topLevelComment.snippet.textDisplay}
                    </p>
                    <div className="flex items-center mt-2 space-x-4">
                      <button className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                        <ThumbsUpIcon className="h-4 w-4" />
                        <span className="text-xs">
                          {comment.snippet.topLevelComment.snippet.likeCount}
                        </span>
                      </button>
                      <button className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                        <ThumbsDownIcon className="h-4 w-4" />
                      </button>
                      <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-xs">
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No comments yet. Be the first to comment!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar (Related Videos) */}
      <div className="w-full lg:w-1/4 p-4 space-y-4 ">
        <h2 className="font-normal dark:text-white tracking-wide">
          Related Videos
        </h2>
        {/* You can add RelatedVideos component here */}
        <RelatedVideo currentVideoId={item.id.videoId} />
      </div>
    </div>
  );
};

export default VideoPlayer;
