import React, { useEffect, useState } from "react";
import axios from "../api/axiosInstance";

interface NewsArticle {
  _id: string;
  title: string;
  description: string;
  publishedAt: string;
  likes: number;
  dislikes: number;
  userReaction?: "like" | "dislike";
  url: string; 
}

const Headlines: React.FC = () => {
  const [dateOption, setDateOption] = useState<"none" | "today" | "range">(
    "none"
  );
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [category, setCategory] = useState("all");
  const [categories, setCategories] = useState<string[]>([]);


  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/admin/categories");
        setCategories(response.data.categories || []);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };

    fetchCategories();
  }, []);

  const fetchHeadlines = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();

      if (dateOption === "today") {
        params.append("date", "today");
      } else if (dateOption === "range" && start && end) {
        params.append("start", start);
        params.append("end", end);
      }

      if (category !== "all") {
        params.append("category", category);
      }

      const url = params.toString()
        ? `/news/headlines?${params.toString()}`
        : `/news/headlines`;

      const response = await axios.get(url);
      setArticles(response.data.headlines || []);
    } catch (error) {
      console.error("Failed to fetch headlines", error);
    }
    setLoading(false);
  };

  const handleLike = async (articleId: string) => {
    try {
      await axios.post(`/news/like/${articleId}`);
      setArticles((prev) =>
        prev.map((a) =>
          a._id === articleId
            ? {
                ...a,
                likes: a.userReaction === "like" ? a.likes - 1 : a.likes + 1,
                dislikes:
                  a.userReaction === "dislike" ? a.dislikes - 1 : a.dislikes,
                userReaction: a.userReaction === "like" ? undefined : "like",
              }
            : a
        )
      );
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to like article");
    }
  };

  const handleDislike = async (articleId: string) => {
    try {
      await axios.post(`/news/dislike/${articleId}`);
      setArticles((prev) =>
        prev.map((a) =>
          a._id === articleId
            ? {
                ...a,
                dislikes:
                  a.userReaction === "dislike"
                    ? a.dislikes - 1
                    : a.dislikes + 1,
                likes: a.userReaction === "like" ? a.likes - 1 : a.likes,
                userReaction:
                  a.userReaction === "dislike" ? undefined : "dislike",
              }
            : a
        )
      );
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to dislike article");
    }
  };

  useEffect(() => {
    fetchHeadlines();
  }, []);

  const handleSave = async (articleId: string) => {
    try {
      await axios.post("/saved/save", { articleId });
      alert("Article saved!");
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to save article");
    }
  };

  const handleReport = async (articleId: string) => {
    try {
      await axios.post(`/news/report/${articleId}`);
      alert("Article reported!");
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to report article");
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Headlines</h2>

      <div className="bg-white shadow rounded p-4 mb-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-700">
          Filter Headlines
        </h3>

        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
          <label className="flex items-center gap-2 text-gray-600">
            <input
              type="radio"
              name="dateOption"
              value="none"
              checked={dateOption === "none"}
              onChange={() => setDateOption("none")}
            />
            All Dates
          </label>
          <label className="flex items-center gap-2 text-gray-600">
            <input
              type="radio"
              name="dateOption"
              value="today"
              checked={dateOption === "today"}
              onChange={() => setDateOption("today")}
            />
            Today
          </label>
          <label className="flex items-center gap-2 text-gray-600">
            <input
              type="radio"
              name="dateOption"
              value="range"
              checked={dateOption === "range"}
              onChange={() => setDateOption("range")}
            />
            Date Range
          </label>
        </div>

        {dateOption === "range" && (
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <input
              type="date"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="border rounded px-3 py-2 w-full md:w-auto"
            />
            <input
              type="date"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              className="border rounded px-3 py-2 w-full md:w-auto"
            />
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-4 items-center">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border rounded px-3 py-2 w-full md:w-auto"
          >
            <option value="all">All</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>

          <button
            onClick={fetchHeadlines}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Apply Filters
          </button>
        </div>
      </div>

      {loading && <p className="text-gray-500">Loading...</p>}

      {articles.map((article) => (
        <div
          key={article._id}
          className="bg-white shadow rounded p-4 mb-4 border border-gray-300"
        >
          <h4 className="text-xl font-semibold mb-2 text-gray-800">
            {article.title}
          </h4>
          <p className="text-gray-700 mb-2">{article.description}</p>

          {article.url && (
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline mb-2 block"
            >
              Read full article
            </a>
          )}

          <div className="flex flex-wrap gap-2 mb-2">
            <button
              onClick={() => handleSave(article._id)}
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
            >
              Save
            </button>
            <button
              onClick={() => handleReport(article._id)}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
            >
              Report
            </button>
            <button
              onClick={() => handleLike(article._id)}
              className={`px-3 py-1 rounded text-white ${
                article.userReaction === "like"
                  ? "bg-blue-800"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              👍 {article.likes}
            </button>
            <button
              onClick={() => handleDislike(article._id)}
              className={`px-3 py-1 rounded text-white ${
                article.userReaction === "dislike"
                  ? "bg-gray-800"
                  : "bg-gray-600 hover:bg-gray-700"
              }`}
            >
              👎 {article.dislikes}
            </button>
          </div>

          <small className="text-gray-500">
            {new Date(article.publishedAt).toLocaleString()}
          </small>
        </div>
      ))}
    </div>
  );
};

export default Headlines;
