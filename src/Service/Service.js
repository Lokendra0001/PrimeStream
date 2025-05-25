import axios from "axios";
const apiKey = "AIzaSyBHLjWuKA3CX8M1juzcHNJIczsHP7fKj_M";
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
    part: "snippet, brandingSettings",
    key: apiKey,
    id: channelId,
  };
  const response = await axios.get(baseURL, { params });
  if (response) return response.data.items[0];
};

export const fetchComments = async (videoId) => {
  const screenSize = window.innerWidth < 680;
  const url = "https://www.googleapis.com/youtube/v3/commentThreads";
  const params = {
    part: "snippet",
    videoId,
    maxResults: screenSize ? 5 : 18,
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

export const fetchChannelVideos = async (channelId) => {
  const baseURL = "https://www.googleapis.com/youtube/v3/search";
  const params = {
    part: "snippet",
    channelId: channelId,
    type: "video",
    maxResults: 30,
    order: "date",
    videoEmbeddable: "true",
    key: apiKey,
  };

  try {
    const response = await axios.get(baseURL, { params });
    if (response) return response.data.items; // return full response data
  } catch (error) {
    console.error("Error fetching YouTube data:", error);
    return null;
  }
};

export const fetchStats = async (channelId) => {
  const baseURL = "https://www.googleapis.com/youtube/v3/channels";
  const params = {
    part: "statistics",
    key: apiKey,
    id: channelId,
  };

  try {
    const response = await axios.get(baseURL, { params });
    if (response) return response.data.items; // return full response data
  } catch (error) {
    console.error("Error fetching YouTube data:", error);
    return null;
  }
};

export default fetchApiData;
