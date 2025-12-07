import { pool } from "../../database/db";

const createVehicle = async (payload: {
  vehicle_name: string;
  type: "car" | "bike" | "van" | "SUV";
  registration_number: string;
  daily_rent_price: number;
  availability_status?: "available" | "booked";
}) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status = "available",
  } = payload;

  const regCheck = await pool.query(
    `SELECT id FROM vehicles WHERE registration_number = $1`,
    [registration_number]
  );
  if (regCheck.rows.length > 0) {
    throw new Error("Registration number already exists");
  }

  const result = await pool.query(
    `INSERT INTO vehicles (vehicle_name, type, registration_number, daily_rent_price, availability_status)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    ]
  );

  return result.rows[0];
};

const getAllVehicles = async () => {
  const result = await pool.query(`SELECT * FROM vehicles ORDER BY id`);
  return result.rows;
};

const getVehicleById = async (vehicleId: number) => {
  const result = await pool.query(`SELECT * FROM vehicles WHERE id = $1`, [
    vehicleId,
  ]);
  return result.rows[0];
};

const updateVehicle = async (
  vehicleId: number,
  data: {
    vehicle_name?: string;
    type?: "car" | "bike" | "van" | "SUV";
    registration_number?: string;
    daily_rent_price?: number;
    availability_status?: "available" | "booked";
  }
) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = data;

  if (registration_number) {
    const regCheck = await pool.query(
      `SELECT id FROM vehicles WHERE registration_number = $1 AND id != $2`,
      [registration_number, vehicleId]
    );
    if (regCheck.rows.length > 0) {
      throw new Error("Registration number already exists");
    }
  }

  const updates: string[] = [];
  const values: any[] = [];
  let paramCount = 1;

  if (vehicle_name !== undefined) {
    updates.push(`vehicle_name = $${paramCount++}`);
    values.push(vehicle_name);
  }
  if (type !== undefined) {
    updates.push(`type = $${paramCount++}`);
    values.push(type);
  }
  if (registration_number !== undefined) {
    updates.push(`registration_number = $${paramCount++}`);
    values.push(registration_number);
  }
  if (daily_rent_price !== undefined) {
    updates.push(`daily_rent_price = $${paramCount++}`);
    values.push(daily_rent_price);
  }
  if (availability_status !== undefined) {
    updates.push(`availability_status = $${paramCount++}`);
    values.push(availability_status);
  }

  if (updates.length === 0) {
    throw new Error("No fields to update");
  }

  values.push(vehicleId);
  const result = await pool.query(
    `UPDATE vehicles
     SET ${updates.join(", ")}
     WHERE id = $${paramCount}
     RETURNING *`,
    values
  );

  return result.rows[0];
};

const deleteVehicle = async (vehicleId: number) => {
  const activeBookings = await pool.query(
    `SELECT id FROM bookings 
     WHERE vehicle_id = $1 AND status = 'active'`,
    [vehicleId]
  );

  if (activeBookings.rows.length > 0) {
    throw new Error("Cannot delete vehicle with active bookings");
  }

  const result = await pool.query(
    `DELETE FROM vehicles WHERE id = $1 RETURNING *`,
    [vehicleId]
  );

  return result.rows[0];
};

export const vehicelsService = {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
};
