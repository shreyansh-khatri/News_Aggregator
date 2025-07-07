import React, { useEffect, useState } from "react";
import axios from "../../api/axiosInstance";

interface Server {
  _id: string;
  name: string;
  baseUrl: string;
  lastChecked:Date,
  status:string
}

const UpdateServer: React.FC = () => {
  const [servers, setServers] = useState<Server[]>([]);
  const [selectedServer, setSelectedServer] = useState<Server | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServers = async () => {
      try {
        const res = await axios.get("/admin/servers");
        setServers(res.data.servers);
      } catch (err) {
        console.error("Failed to fetch servers", err);
      } finally {
        setLoading(false);
      }
    };

    fetchServers();
  }, []);

  const handleUpdate = async () => {
    console.log("yy")
    if (!selectedServer) return;
    try {
      await axios.put(`/admin/servers/${selectedServer._id}`, selectedServer);
      alert(" Server updated successfully");
    } catch (err) {
      console.error("Update failed", err);
      alert(" Failed to update server");
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Update External Server
      </h2>

      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : (
        <div className="mb-4">
          <label className="block mb-2 text-gray-700">
            Select a server:
            <select
              onChange={(e) => {
                const selected = servers.find((s) => s._id === e.target.value);
                setSelectedServer(selected || null);
              }}
              defaultValue=""
              className="border rounded px-3 py-2 w-full mt-1"
            >
              <option value="" disabled>
                -- Choose --
              </option>
              {servers.map((server) => (
                <option key={server._id} value={server._id}>
                  {server.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}

      {selectedServer && (
        <div className="bg-white shadow rounded p-4 border border-gray-300">
          <label className="block mb-4 text-gray-700">
            Name:
            <input
              type="text"
              value={selectedServer.name}
              onChange={(e) =>
                setSelectedServer({ ...selectedServer, name: e.target.value })
              }
              className="border rounded px-3 py-2 w-full mt-1"
            />
          </label>

          <label className="block mb-4 text-gray-700">
            URL:
            <input
              type="text"
              value={selectedServer.baseUrl}
              onChange={(e) =>
                setSelectedServer({
                  ...selectedServer,
                  baseUrl: e.target.value,
                })
              }
              className="border rounded px-3 py-2 w-full mt-1"
            />
          </label>

          <button
            onClick={handleUpdate}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full"
          >
            Update Server
          </button>
        </div>
      )}
    </div>
  );

};

export default UpdateServer;
