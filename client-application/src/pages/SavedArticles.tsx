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
    <div style={{ padding: "1rem" }}>
      <h2>Saved Articles</h2>
      {loading ? (
        <p>Loading...</p>
      ) : articles.length === 0 ? (
        <p>No saved articles found.</p>
      ) : (
        articles.map((article) => (
          <div key={article._id} style={{ marginBottom: "1rem" }}>
            <h4>{article.title}</h4>
            <p>{article.description}</p>
            <small>{new Date(article.publishedAt).toLocaleString()}</small>
            <br />
            <button onClick={() => handleDelete(article._id)}>🗑 Remove</button>
          </div>
        ))
      )}
    </div>
  );
};

export default SavedArticles;
