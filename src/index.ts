import express, { Application } from "express";
import bodyParser from 'body-parser';
import dotenv from "dotenv";
import { PORT } from "./config";
import cors from 'cors';
import morgan from "morgan";


import authRouter from "./routes/auth.route";
import { connectDatabase } from "./database/mongodb";
import adminRouter from "./routes/admin/admin.routes";
import path from "path";

dotenv.config();

const app: Application = express();


let corsOptions ={
  origin: ["http://localhost:5050", "http://localhost:5050"],
  credentials: true,
    optionsSuccessStatus: 200,
  //which domain can access your backend server
    // add frontend domain in origin
}
//origin: "*", // allow all domain to access your backend 

// Middleware
app.use(express.json());
app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));


app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Routes
  
app.use("/api/auth", authRouter);
app.use("/api/admin",adminRouter);

// Catch-all for undefined routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Start Server
async function startServer() {
  try {
    await connectDatabase();
    app.listen(PORT, () => {
      console.log(`App is running on: http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

startServer();
