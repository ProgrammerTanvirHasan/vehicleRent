import express, { Request, Response } from "express";
const app = express();
const port = 5000;

import { userRouter } from "./modules/user/user.route";
import { initDB } from "./database/db";
import { authRouter } from "./modules/auth/auth.route";
import { vehicelsRouter } from "./modules/vehicels/vehicels.route";
import { bookingsRouter } from "./modules/bookings/bookings.route";

app.use(express.json());

initDB();

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/vehicles", vehicelsRouter);
app.use("/api/v1/bookings", bookingsRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app running on port ${port}`);
});
