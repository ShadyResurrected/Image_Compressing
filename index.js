import express from "express";
import cors from 'cors'
const app = express();

app.use(cors())

import * as dotenv from "dotenv";
dotenv.config();

import route from "./Routes/route.js";
import {Connection} from "./database/db.js";

const port = process.env.PORT;

// routes
app.use("/", route);

// Port
app.listen(port, () => {
  console.log("Listening on port " + port);
});

// Database connection
Connection()


