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
    <div style={{ padding: "1rem" }}>
      <h2>Configure Notifications</h2>

      <h4>Select Categories:</h4>
      {["business", "technology", "sports", "entertainment"].map((cat) => (
        <label key={cat} style={{ display: "block" }}>
          <input
            type="checkbox"
            value={cat}
            checked={categories.includes(cat)}
            onChange={handleCategoryChange}
          />
          {cat}
        </label>
      ))}

      <div style={{ marginTop: "1rem" }}>
        <label>
          <h4>Keywords (comma separated):</h4>
          <input
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="e.g. election, startup, crypto"
            style={{ width: "100%" }}
          />
        </label>
      </div>

      <button style={{ marginTop: "1rem" }} onClick={handleSubmit}>
        Save Preferences
      </button>
    </div>
  );
};

export default ConfigureNotifications;
