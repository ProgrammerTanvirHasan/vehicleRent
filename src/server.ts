import express, { Request, Response } from "express";
const app = express();
const port = 5000;
import { Pool } from "pg";
app.use(express.json());

const pool = new Pool({
  connectionString:
    "postgresql://neondb_owner:npg_xbmtYEOi6kM1@ep-bitter-bar-a8w9roze-pooler.eastus2.azure.neon.tech/neondb?sslmode=require&channel_binding=require",
});

const initDB = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE CHECK (email = LOWER(email)),
      password VARCHAR(255) NOT NULL CHECK (LENGTH(password) >= 6),
      phone VARCHAR(20) NOT NULL,
      role VARCHAR(10) NOT NULL CHECK (role IN ('admin', 'customer'))
    );

    CREATE TABLE IF NOT EXISTS vehicles (
      id SERIAL PRIMARY KEY,
      vehicle_name VARCHAR(100) NOT NULL,
      type VARCHAR(10) NOT NULL CHECK (type IN ('car', 'bike', 'van', 'SUV')),
      registration_number VARCHAR(50) NOT NULL UNIQUE,
      daily_rent_price NUMERIC CHECK (daily_rent_price > 0) NOT NULL,
      availability_status VARCHAR(10) NOT NULL CHECK (availability_status IN ('available', 'booked'))
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id SERIAL PRIMARY KEY,
      customer_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      vehicle_id INT NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
      rent_start_date DATE NOT NULL,
      rent_end_date DATE NOT NULL,
      total_price NUMERIC CHECK (total_price > 0) NOT NULL,
      status VARCHAR(10) NOT NULL CHECK (status IN ('active', 'cancelled', 'returned')),
      CHECK (rent_end_date > rent_start_date)
    );
  `);
};

initDB();

app.post("/users", async (req: Request, res: Response) => {
  const { name, email, password, phone, role } = req.body;
  const result = await pool.query(
    `
    INSERT INTO users (name,email,password,phone,role)
    VALUES ($1,$2,$3,$4,$5) RETURNING *;
    
    `,
    [name, email, password, phone, role]
  );
  res.status(201).json({
    success: true,
    message: "user created successfullt",
    data: result.rows[0],
  });
});

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app running on port ${port}`);
});
