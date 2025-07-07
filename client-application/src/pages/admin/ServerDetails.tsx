import React, { useEffect, useState } from "react";
import axios from "../../api/axiosInstance";

interface ServerDetail {
  _id: string;
  name: string;
  baseUrl: string;
  status: string;
  createdAt: string;
  lastChecked:Date;
}

const ServerDetails: React.FC = () => {
  const [servers, setServers] = useState<ServerDetail[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchServerDetails = async () => {
    try {
      const res = await axios.get("/admin/servers");
      setServers(res.data.servers);
    } catch (err) {
      console.error("Failed to fetch server details", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServerDetails();
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        External Server Details
      </h2>

      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : servers.length === 0 ? (
        <p className="text-gray-600">No server details found.</p>
      ) : (
        <div className="space-y-4">
          {servers.map((server) => (
            <div
              key={server._id}
              className="border border-gray-300 rounded p-4 shadow bg-white"
            >
              <h3 className="text-xl font-semibold mb-2">{server.name}</h3>
              <p className="mb-1">
                <span className="font-medium">URL:</span> {server.baseUrl}
              </p>
              <p className="mb-1">
                <span className="font-medium">Status:</span> {server.status}
              </p>
              <p className="text-sm text-gray-500">
                <span className="font-medium">Created:</span>{" "}
                {new Date(server.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

};

export default ServerDetails;
