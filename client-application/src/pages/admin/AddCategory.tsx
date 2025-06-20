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
    <div style={{ padding: "1rem" }}>
      <h2>Add New Category</h2>

      <input
        type="text"
        value={category}
        placeholder="Enter new category"
        onChange={(e) => setCategory(e.target.value)}
        style={{ padding: "0.5rem", width: "100%", maxWidth: "400px" }}
      />

      <br />

      <input
        type="text"
        value={keywords}
        placeholder="Enter keywords (comma separated)"
        onChange={(e) => setKeywords(e.target.value)}
        style={{
          padding: "0.5rem",
          width: "100%",
          maxWidth: "400px",
          marginTop: "1rem",
        }}
      />

      <br />

      <button
        onClick={handleAddCategory}
        disabled={loading}
        style={{ marginTop: "1rem" }}
      >
        {loading ? "Saving..." : "Add Category"}
      </button>
    </div>
  );
};

export default AddCategory;
