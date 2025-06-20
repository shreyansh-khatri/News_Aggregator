import React, { useState } from "react";
import axios from "../api/axiosInstance";

interface NewsArticle {
  _id: string;
  title: string;
  description: string;
  publishedAt: string;
}

const Search: React.FC = () => {
  const [keyword, setKeyword] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [results, setResults] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (keyword) params.append("keyword", keyword);
      if (start) params.append("start", start);
      if (end) params.append("end", end);

      const response = await axios.get(`/news/search?${params.toString()}`);
      setResults(response.data.results || []);
    } catch (error) {
      console.error("Search failed:", error);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>🔍 Search News</h2>
      <div>
        <input
          type="text"
          placeholder="Enter keyword"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
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
        <button onClick={handleSearch}>Search</button>
      </div>

      {loading ? (
        <p>Searching...</p>
      ) : (
        <div style={{ marginTop: "1rem" }}>
          {results.length === 0 && <p>No articles found</p>}
          {results.map((article) => (
            <div key={article._id} style={{ marginBottom: "1rem" }}>
              <h4>{article.title}</h4>
              <p>{article.description}</p>
              <small>{new Date(article.publishedAt).toLocaleString()}</small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
