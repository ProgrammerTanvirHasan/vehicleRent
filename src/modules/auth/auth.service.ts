import { pool } from "../../database/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../../config";

const authServiceFun = async (email: string, password: string) => {
  const result = await pool.query(`SELECT * FROM users WHERE email=$1`, [
    email,
  ]);
  const user = result.rows[0];

  if (!user) {
    throw new Error("User not found");
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw new Error("Invalid credentials");
  }

  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
  };

  const token = jwt.sign(jwtPayload, config.SECRET_KEY as string, {
    expiresIn: "7d",
  });

  return { token, user };
};

export const authService = {
  authServiceFun,
};
