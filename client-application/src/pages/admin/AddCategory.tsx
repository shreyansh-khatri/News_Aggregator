import React, { useState } from "react";
import axios from "../../api/axiosInstance";

const AddCategory: React.FC = () => {
  const [category, setCategory] = useState("");
  const [keywords, setKeywords] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddCategory = async () => {
    if (!category.trim()) return alert("Category name cannot be empty");

    const keywordList = keywords
      .split(",")
      .map((kw) => kw.trim())
      .filter(Boolean);

    setLoading(true);
    try {
        console.log(keywordList)
      const res = await axios.post("/admin/categories", {
        name: category.trim(),
        keywords: keywordList,
      });
      alert(" " + res.data.message);
      setCategory("");
      setKeywords("");
    } catch (err) {
      console.error("Failed to add category", err);
      alert(" Failed to add category");
    }
    setLoading(false);
  };


  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Add New Category
      </h2>

      <input
        type="text"
        value={category}
        placeholder="Enter new category"
        onChange={(e) => setCategory(e.target.value)}
        className="border rounded px-3 py-2 w-full mb-4"
      />

      <input
        type="text"
        value={keywords}
        placeholder="Enter keywords (comma separated)"
        onChange={(e) => setKeywords(e.target.value)}
        className="border rounded px-3 py-2 w-full mb-4"
      />

      <button
        onClick={handleAddCategory}
        disabled={loading}
        className={`${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700"
        } text-white px-4 py-2 rounded w-full`}
      >
        {loading ? "Saving..." : "Add Category"}
      </button>
    </div>
  );

};

export default AddCategory;
