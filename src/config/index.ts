import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const config = {
  CONNECTION_STR: process.env.CONNECTION_STR,
  PORT: process.env.PORT,
  SECRET_KEY: process.env.SECRET_KEY,
};

export default config;
