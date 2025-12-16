import { pool } from "../../database/db";

const getAllUsers = async () => {
  const result = await pool.query(
    `SELECT id, name, email, phone, role FROM users`
  );
  return result.rows;
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
  const activeBookings = await pool.query(
    `SELECT id FROM bookings 
     WHERE customer_id = $1 AND status = 'active'`,
    [userId]
  );

  if (activeBookings.rows.length > 0) {
    throw new Error("Cannot delete user with active bookings");
  }

  const result = await pool.query(
    `DELETE FROM users WHERE id = $1 RETURNING id, name, email`,
    [userId]
  );
  return result.rows[0];
};

export const userService = {
  getAllUsers,
  updateUser,
  deleteUser,
};
