import app from "./app";
import connectDB from "./config/db";
import { runCronJobs } from "./cronJobs";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });

  runCronJobs(); 
};

startServer();
