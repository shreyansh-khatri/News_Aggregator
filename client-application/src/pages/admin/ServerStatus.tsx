import React, { useEffect, useState } from "react";
import axios from "../../api/axiosInstance";

interface Server {
  _id: string;
  name: string;
  status: string;
  lastChecked: string;
}

const ServerStatus: React.FC = () => {
  const [servers, setServers] = useState<Server[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchServerStatuses = async () => {
    try {
      const res = await axios.get("/admin/servers/status");
      setServers(res.data.servers);
    } catch (error) {
      console.error("Failed to fetch server statuses", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServerStatuses();
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        External Server Statuses
      </h2>

      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : servers.length === 0 ? (
        <p className="text-gray-600">No servers found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b text-left">Name</th>
                <th className="py-2 px-4 border-b text-left">Status</th>
                <th className="py-2 px-4 border-b text-left">Last Checked</th>
              </tr>
            </thead>
            <tbody>
              {servers.map((server) => (
                <tr key={server._id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{server.name}</td>
                  <td className="py-2 px-4 border-b">{server.status}</td>
                  <td className="py-2 px-4 border-b">
                    {new Date(server.lastChecked).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

};

export default ServerStatus;
