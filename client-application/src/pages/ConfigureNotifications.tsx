import React, { useState } from "react";
import { updateNotificationPreferences } from "../services/notificationService";

const ConfigureNotifications: React.FC = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [keywords, setKeywords] = useState("");

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCategories((prev) =>
      prev.includes(value)
        ? prev.filter((cat) => cat !== value)
        : [...prev, value]
    );
  };

  const handleSubmit = async () => {
    try {
      const keywordList = keywords
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean);

      await updateNotificationPreferences(categories, keywordList);
      alert(" Notification preferences saved!");
    } catch (error) {
      console.error(" Failed to save preferences", error);
      alert(" Failed to save preferences.");
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Configure Notifications
      </h2>

      <h4 className="text-lg font-semibold mb-2 text-gray-700">
        Select Categories:
      </h4>
      <div className="mb-4">
        {["business", "technology", "sports", "entertainment"].map((cat) => (
          <label
            key={cat}
            className="flex items-center gap-2 mb-2 text-gray-600"
          >
            <input
              type="checkbox"
              value={cat}
              checked={categories.includes(cat)}
              onChange={handleCategoryChange}
            />
            {cat}
          </label>
        ))}
      </div>

      <div className="mb-4">
        <h4 className="text-lg font-semibold mb-2 text-gray-700">
          Keywords (comma separated):
        </h4>
        <input
          type="text"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          placeholder="e.g. election, startup, crypto"
          className="border rounded px-3 py-2 w-full"
        />
      </div>

      <button
        onClick={handleSubmit}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        Save Preferences
      </button>
    </div>
  );

};

export default ConfigureNotifications;
