import dotenv from "dotenv";
import { connectDB } from "./src/db/index.js";
import app from "./src/app.js";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import { User } from "./src/models/user-model.js";

dotenv.config();
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 8000;

connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("Error : ", error);
      throw error;
    });

    app.listen(PORT, () => {
      console.log(`Server is running at port : ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB Connection Failed !!!...", err);
  });