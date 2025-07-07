import React, { useState } from "react";
import axios from "../api/axiosInstance";

interface NewsArticle {
  _id: string;
  title: string;
  description: string;
  publishedAt: string;
  url: string; 
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
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">🔍 Search News</h2>

      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Enter keyword"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="border rounded px-3 py-2 w-full md:w-auto"
        />
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
        <button
          onClick={handleSearch}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Searching...</p>
      ) : (
        <div className="mt-4">
          {results.length === 0 && (
            <p className="text-gray-600">No articles found</p>
          )}

          {results.map((article) => (
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

              <small className="text-gray-500">
                {new Date(article.publishedAt).toLocaleString()}
              </small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
