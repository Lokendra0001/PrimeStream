import axios from "axios";
const apiKey = "AIzaSyCXJGG3EU1U2oxqIpCFtvNUyv9JeqKdy3k";
const fetchApiData = async (query, pageToken = "") => {
  const baseURL = "https://www.googleapis.com/youtube/v3/search";

  const params = {
    part: "snippet",
    type: "video",
    q: query ? query : "home",
    maxResults: 20,
    videoDuration: "long",
    regionCode: "IN",
    order: "relevance",
    videoEmbeddable: "true",
    key: apiKey,
  };

  if (pageToken) {
    params.pageToken = pageToken;
  }

  if (query)
    try {
      const response = await axios.get(baseURL, { params });
      if (response && response.data) {
        return response.data;
      }
    } catch (error) {
      console.error("Error fetching YouTube data:", error);
      return null;
    }
};

export const fetchApiVideos = async (videoId) => {
  const baseURL = "https://www.googleapis.com/youtube/v3/videos";
  const params = {
    part: "contentDetails,statistics",
    key: apiKey,
    id: videoId,
  };

  try {
    const response = await axios.get(baseURL, { params });
    if (response) return response.data.items; // return full response data
  } catch (error) {
    console.error("Error fetching YouTube data:", error);
    return null;
  }
};

export const fetchChannelDetails = async (channelId) => {
  const baseURL = "https://www.googleapis.com/youtube/v3/channels";
  const params = {
    part: "snippet",
    key: apiKey,
    id: channelId,
  };
  const response = await axios.get(baseURL, { params });
  if (response) return response.data.items[0].snippet.thumbnails.default.url;
};

export const fetchComments = async (videoId) => {
  const url = "https://www.googleapis.com/youtube/v3/commentThreads";
  const params = {
    part: "snippet",
    videoId,
    maxResults: 18,
    key: apiKey,
  };

  try {
    const response = await axios.get(url, { params });
    return response.data.items;
  } catch (error) {
    console.error("Error fetching comments:", error);
    return [];
  }
};

export default fetchApiData;
