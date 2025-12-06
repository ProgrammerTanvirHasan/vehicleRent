import express, { Request, Response } from "express";
const app = express();
const port = 5000;

import { userRouter } from "./modules/user/user.route";
import { initDB } from "./database/db";
app.use(express.json());

initDB();

app.use("/api/v1/users", userRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app running on port ${port}`);
});
