import React, { useEffect, useState } from "react";
import { getReportedArticles, hideArticle } from "../../api/adminApi";

type Article = {
  _id: string;
  title: string;
  description?: string;
};


const ReportedArticles = () => {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    getReportedArticles().then((res) => setArticles(res.data.articles));
  }, []);

  const handleHide = async (id: string) => {
    await hideArticle(id);
    setArticles((prev) => prev.filter((a) => a._id !== id));
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Reported Articles</h2>
      {articles.map((article) => (
        <div key={article._id} className="border p-4 mb-4 rounded">
          <h3 className="font-semibold">{article.title}</h3>
          <p>{article.description}</p>
          <button
            className="bg-red-600 text-white px-4 py-1 mt-2"
            onClick={() => handleHide(article._id)}
          >
            Hide Article
          </button>
        </div>
      ))}
    </div>
  );
};

export default ReportedArticles;
