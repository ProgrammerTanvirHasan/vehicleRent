import { pool } from "../../database/db";
import bcrypt from "bcryptjs";
const vehiclesService = async (payload: Record<string, unknown>) => {
  const { name, email, password, phone, role } = payload;
  const hassedPassword = await bcrypt.hash(password as string, 12);
  const result = await pool.query(
    `
        INSERT INTO users (name,email,password,phone,role)
        VALUES ($1,$2,$3,$4,$5) RETURNING *;
        
        `,
    [name, email, hassedPassword, phone, role]
  );
  return result;
};
export const vehicelsService = {
  vehiclesService,
};
