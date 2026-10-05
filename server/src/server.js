import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoute.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import profileRoutes from "./routes/profile.js";
import settingsRoutes from "./routes/setting.js";
import aiRoutes from "./routes/aiRoute.js";
import activityRoutes from "./routes/activityRoutes.js";
import problemRoutes from "./routes/problemRoutes.js";
import codeRoutes from "./routes/codeRoutes.js";
import submissionRoutes from "./routes/submissionRoutes.js";




dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/code", codeRoutes);
app.use("/api/submissions", submissionRoutes);

app.use("/api/problems", problemRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/activity", activityRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "CodingBhai API is running 🚀",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});