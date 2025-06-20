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
    <div style={{ padding: "1rem" }}>
      <h2>Update External Server</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <label>
            Select a server:
            <select
              onChange={(e) => {
                console.log('dd',e.target.value)
                console.log(servers)
                const selected = servers.find((s) => s._id === e.target.value);
                console.log(selected)
                setSelectedServer(selected || null);
              }}
              defaultValue=""
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
        <div style={{ marginTop: "1rem" }}>
          <label>
            Name:{" "}
            <input
              type="text"
              value={selectedServer.name}
              onChange={(e) =>
                setSelectedServer({ ...selectedServer, name: e.target.value })
              }
            />
          </label>
          <br />
          <label>
            URL:{" "}
            <input
              type="text"
              value={selectedServer.baseUrl}
              onChange={(e) =>
                setSelectedServer({ ...selectedServer, baseUrl: e.target.value })
              }
            />
          </label>
          <br />

          <br />
          <button onClick={handleUpdate} style={{ marginTop: "1rem" }}>
            Update Server
          </button>
        </div>
      )}
    </div>
  );
};

export default UpdateServer;
