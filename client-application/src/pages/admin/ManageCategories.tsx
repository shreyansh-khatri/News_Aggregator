import React, { useEffect, useState } from "react";
import { getCategories, hideCategories } from "../../api/adminApi";

const ManageCategories = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    getCategories().then((res) => setCategories(res.data.categories));
  }, []);

  const toggleCategory = (name: string) => {
    setSelected((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]
    );
  };

  const handleSubmit = async () => {
    await hideCategories(selected);
    alert("Categories updated.");
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Hide Categories</h2>
      {categories.map((cat) => (
        <label key={cat} className="block">
          <input
            type="checkbox"
            checked={selected.includes(cat)}
            onChange={() => toggleCategory(cat)}
          />
          <span className="ml-2">{cat}</span>
        </label>
      ))}
      <button
        className="bg-blue-600 text-white px-4 py-1 mt-4"
        onClick={handleSubmit}
      >
        Save Changes
      </button>
    </div>
  );
};

export default ManageCategories;
