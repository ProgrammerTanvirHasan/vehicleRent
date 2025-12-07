import { pool } from "../../database/db";
import bcrypt from "bcryptjs";

const createUserService = async (payload: Record<string, unknown>) => {
  const { name, email, password, phone, role } = payload;
  const emailCheck = await pool.query(`SELECT id FROM users WHERE email = $1`, [
    (email as string)?.toLowerCase(),
  ]);
  if (emailCheck.rows.length > 0) throw new Error("Email already exists.");
  const hassedPassword = await bcrypt.hash(password as string, 12);
  const result = await pool.query(
    `
        INSERT INTO users (name,email,password,phone,role)
        VALUES ($1,$2,$3,$4,$5) RETURNING *;
        
        `,
    [name, (email as string)?.toLowerCase(), hassedPassword, phone, role]
  );
  return result;
};

const getAllUsers = async () => {
  const result = await pool.query(
    `SELECT id, name, email, phone, role FROM users`
  );
  return result.rows;
};

const getUserById = async (userId: number) => {
  const result = await pool.query(
    `SELECT id, name, email, phone, role FROM users WHERE id = $1`,
    [userId]
  );
  return result.rows[0];
};

const updateUser = async (
  userId: number,
  data: { name?: string; email?: string; phone?: string; role?: string }
) => {
  const { name, email, phone, role } = data;

  const result = await pool.query(
    `UPDATE users
     SET name = $1, email = $2 ,phone=$3,role=$4
     WHERE id = $5
     RETURNING id, name, email, phone, role`,
    [name, email, phone, role, userId]
  );

  return result.rows[0];
};

const deleteUser = async (userId: number) => {
  const result = await pool.query(
    `DELETE FROM users WHERE id = $1 RETURNING id, name, email`,
    [userId]
  );
  return result.rows[0];
};

export const userService = {
  createUserService,
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
};
