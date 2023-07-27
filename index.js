import express from "express";
import db from "./db.js";
import dotenv from "dotenv";
import router from "./routes/index.js";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();

const app = express();

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(router);

db.authenticate()
  .then(() => {
    console.log("Database connection has been established successfully");
    // return db.sync();
  })
  .then(() => {
    app.listen(5000, () => {
      console.log("Server berjalan pada port 5000");
    });
  })
  .catch((error) => {
    console.error(
      "Terjadi kesalahan saat sinkronisasi dengan database:",
      error
    );
  });
