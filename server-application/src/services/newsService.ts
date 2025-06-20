import axios from "axios";

const NEWS_API_KEY = "9e5d95edc356421ea9d9be87080439a4";
const NEWS_API_URL = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${NEWS_API_KEY}`;

export const fetchNewsFromAPI = async () => {
  try {
    console.log(NEWS_API_KEY);
    const response = await axios.get(NEWS_API_URL);
    return response.data.articles;
  } catch (error) {
    console.log(error);
  }
};
