import express from "express";
import bodyParser from "body-parser";
import cors from "cors"; // Import cors
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import plateNumberRoutes from "./routes/plateNumberRoutes";
import errorHandler from "./middlewares/errorHandler";

const app = express();

// Use CORS before other middlewares
app.use(cors());

app.use(bodyParser.json()); // Parse JSON request bodies

// Define your routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/plates", plateNumberRoutes);

// Error handling middleware should be last
app.use(errorHandler);

export default app;
