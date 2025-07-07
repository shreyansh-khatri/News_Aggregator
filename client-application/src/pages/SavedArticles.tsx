import React, { useEffect, useState } from "react";
import {
  getSavedArticles,
  deleteArticle
} from "../services/articleService";

interface Article {
  _id: string;
  title: string;
  description: string;
  publishedAt: string;
}

const SavedArticles: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSaved = async () => {
    setLoading(true);
    try {
      const saved = await getSavedArticles();
      setArticles(saved);
    } catch (err) {
      console.error("Failed to fetch saved articles", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteArticle(id);
      setArticles((prev) => prev.filter((article) => article._id !== id));
    } catch (err) {
      console.error("Failed to delete", err);
    }
  };

  useEffect(() => {
    fetchSaved();
  }, []);


  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Saved Articles</h2>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : articles.length === 0 ? (
        <p className="text-gray-600">No saved articles found.</p>
      ) : (
        articles.map((article) => (
          <div
            key={article._id}
            className="bg-white shadow rounded p-4 mb-4 border border-gray-300"
          >
            <h4 className="text-xl font-semibold mb-2 text-gray-800">
              {article.title}
            </h4>
            <p className="text-gray-700 mb-2">{article.description}</p>
            <small className="text-gray-500">
              {new Date(article.publishedAt).toLocaleString()}
            </small>
            <br />
            <button
              onClick={() => handleDelete(article._id)}
              className="mt-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
            >
              🗑 Remove
            </button>
          </div>
        ))
      )}
    </div>
  );

};

export default SavedArticles;
