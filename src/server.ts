import express, { Request, Response, NextFunction } from "express";
import { root } from "./routers";
import cors from "cors";
const app = express();

//view engine setting
app.use(cors());
app.set("view engine", "pug");
app.set("views", __dirname + "./src");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/", root);
const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
  console.log(error);
  res.status(500).json({ error });
};

app.use("/views", express.static("./views"));
app.use(errorHandler);
export default app;
