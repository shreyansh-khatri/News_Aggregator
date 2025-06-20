import React, { useEffect, useState } from "react";
import axios from "../api/axiosInstance";

interface NewsArticle {
  _id: string;
  title: string;
  description: string;
  publishedAt: string;
}

const Headlines: React.FC = () => {
  const [dateOption, setDateOption] = useState<"none" | "today" | "range">(
    "none"
  );
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [category, setCategory] = useState("all");

  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    fetchHeadlines();
  }, []);

  const handleSave = async (articleId: string) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.post("/saved/save", { articleId });
      alert(" Article saved!");
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to save article");
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Headlines</h2>
      <div>
        <h3>Filter Headlines</h3>

        <label>
          <input
            type="radio"
            name="dateOption"
            value="none"
            checked={dateOption === "none"}
            onChange={() => setDateOption("none")}
          />
          All Dates
        </label>

        <label>
          <input
            type="radio"
            name="dateOption"
            value="today"
            checked={dateOption === "today"}
            onChange={() => setDateOption("today")}
          />
          Today
        </label>

        <label>
          <input
            type="radio"
            name="dateOption"
            value="range"
            checked={dateOption === "range"}
            onChange={() => setDateOption("range")}
          />
          Date Range
        </label>

        {dateOption === "range" && (
          <>
            <input
              type="date"
              value={start}
              onChange={(e) => setStart(e.target.value)}
            />
            <input
              type="date"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
            />
          </>
        )}

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="all">All</option>
          <option value="business">Business</option>
          <option value="entertainment">Entertainment</option>
          <option value="sports">Sports</option>
          <option value="technology">Technology</option>
        </select>

        <button onClick={fetchHeadlines}>Apply Filters</button>
      </div>

      {loading && <p>Loading...</p>}
      {articles.map((article) => (
        <div key={article._id} style={{ marginBottom: "1rem" }}>
          <h4>{article.title}</h4>
          <p>{article.description}</p>
          <button onClick={() => handleSave(article._id)}>Save</button>
          <small>{new Date(article.publishedAt).toLocaleString()}</small>
        </div>
      ))}
    </div>
  );
};

export default Headlines;
