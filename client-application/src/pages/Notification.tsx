
import React, { useEffect, useState } from "react";
import axios from "../api/axiosInstance";

interface Article {
  title?: string | null;
  description?: string | null;
  category?: string[] | null;
  url?: string | null;
}

interface Notification {
  _id: string;
  articleId: Article | null;
  createdAt: string;
  isRead: boolean;
}

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(response.data.notifications);
    } catch (err) {
      setError("Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (notificationId: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `/notifications/mark-as-read/${notificationId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNotifications((prev) =>
        prev.map((n) => (n._id === notificationId ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-semibold text-center mb-8">
        Your Notifications
      </h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading notifications...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : notifications.length === 0 ? (
        <p className="text-center text-gray-500">No notifications found.</p>
      ) : (
        <ul className="space-y-6">
          {notifications.map((n) => (
            <li
              key={n._id}
              className={`bg-white border rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow ${
                n.isRead ? "opacity-70" : ""
              }`}
            >
              <strong className="text-lg text-gray-800">
                {n.articleId?.title || "No title"}
              </strong>

              <p className="mt-2 text-gray-600">
                {n.articleId?.description || "No description"}
              </p>

              <p className="mt-2 text-sm text-gray-500">
                <span className="font-medium">Categories:</span>{" "}
                {n.articleId?.category?.join(", ") || "None"}
              </p>

              {n.articleId?.url && (
                <a
                  href={n.articleId.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-3 text-blue-600 hover:text-blue-800 font-medium"
                >
                  Read more
                </a>
              )}

              <p className="mt-2 text-xs text-gray-400">
                Created at: {new Date(n.createdAt).toLocaleString()}
              </p>

              {!n.isRead && (
                <button
                  onClick={() => markAsRead(n._id)}
                  className="mt-4 inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                >
                  Mark as Read
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;
