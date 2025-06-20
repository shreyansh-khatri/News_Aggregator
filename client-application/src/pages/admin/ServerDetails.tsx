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
    <div style={{ padding: "1rem" }}>
      <h2>External Server Details</h2>
      {loading ? (
        <p>Loading...</p>
      ) : servers.length === 0 ? (
        <p>No server details found.</p>
      ) : (
        <div>
          {servers.map((server) => (
            <div
              key={server._id}
              style={{
                border: "1px solid #ccc",
                padding: "1rem",
                marginBottom: "1rem",
                borderRadius: "5px",
              }}
            >
              <h3>{server.name}</h3>
              <p>
                <strong>URL:</strong> {server.baseUrl}
              </p>
              <p>
                <strong>Status:</strong> {server.status}
              </p>

              <small>
                <strong>Created:</strong>{" "}
                {new Date(server.createdAt).toLocaleString()}
              </small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServerDetails;
