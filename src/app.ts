import express from "express";
import * as dotenv from "dotenv";
import connect from "./config/dataBaseConfig";
import cors from "cors";
import morgan from "morgan";

import userRouter from "./api/v1/routes/user";

const app = express();
const PORT = process.env.PORT || 5001;
dotenv.config();

const uri =
  typeof process.env.dbURI === "string" ? process.env.dbURI : "NO URI Found";

connect(uri);

app.use(cors());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/users", userRouter);

app.listen(PORT, () => {
  console.log(`Listening on port : ${PORT}`);
});
