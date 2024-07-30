import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { config } from "dotenv";
const app = express();

const corsConfig = {
  origin: "*",
  credentials: true,
  methods: ["GET", "POST", "DELETE", "PUT"],
};

app.use(cors(corsConfig));

app.use(express.json());

// url encoding
app.use(express.urlencoded({ extended: true }));

// for files at server
app.use(express.static("public"));
app.use(cookieParser());

import userRouter from "../src/routes/user.route.js"

app.use("/api/v1/user", userRouter);

export default app;
