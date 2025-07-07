import React, { useEffect, useState } from "react";
import { getBlockedKeywords, updateBlockedKeywords } from "../../api/adminApi";

const KeywordFilters = () => {
  const [keywords, setKeywords] = useState<string[]>([]);
  const [input, setInput] = useState("");

useEffect(() => {
  getBlockedKeywords().then((res) =>
    setKeywords(res.data.blockedKeywords || [])
  );
}, []);

  const addKeyword = () => {
    if (input && !keywords.includes(input)) {
      setKeywords((prev) => [...prev, input]);
      setInput("");
    }
  };

  const removeKeyword = (word: string) => {
    setKeywords((prev) => prev.filter((k) => k !== word));
  };

  const handleSave = () => {
    updateBlockedKeywords(keywords).then(() => alert("Keywords updated."));
  };



  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Blocked Keywords</h2>

      <div className="mb-4 flex">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add keyword"
          className="border px-3 py-2 rounded w-full"
        />
        <button
          onClick={addKeyword}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded ml-2"
        >
          Add
        </button>
      </div>

      <ul className="space-y-2">
        {keywords.map((k) => (
          <li
            key={k}
            className="flex justify-between items-center border px-3 py-2 rounded"
          >
            <span>{k}</span>
            <button
              className="text-red-600 font-bold text-lg hover:text-red-800"
              onClick={() => removeKeyword(k)}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>

      <button
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mt-4 w-full"
        onClick={handleSave}
      >
        Save Changes
      </button>
    </div>
  );

};

export default KeywordFilters;
