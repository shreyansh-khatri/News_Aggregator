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
    <div style={{ padding: "1rem" }}>
      <h2>External Server Statuses</h2>
      {loading ? (
        <p>Loading...</p>
      ) : servers.length === 0 ? (
        <p>No servers found.</p>
      ) : (
        <table border={1} cellPadding={8}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Status</th>
              <th>Last Checked</th>
            </tr>
          </thead>
          <tbody>
            {servers.map((server) => (
              <tr key={server._id}>
                <td>{server.name}</td>
                <td>{server.status}</td>
                <td>{new Date(server.lastChecked).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ServerStatus;
