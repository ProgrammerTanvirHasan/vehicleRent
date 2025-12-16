import { pool } from "../../database/db";

const createBooking = async (payload: {
  customer_id: number;
  vehicle_id: number;
  rent_start_date: string;
  rent_end_date: string;
}) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

  const startDate = new Date(rent_start_date);
  const endDate = new Date(rent_end_date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (startDate < today) {
    throw new Error("Rent start date cannot be in the past");
  }

  if (endDate <= startDate) {
    throw new Error("Rent end date must be after start date");
  }

  const vehicle = await pool.query(`SELECT * FROM vehicles WHERE id = $1`, [
    vehicle_id,
  ]);

  if (vehicle.rows.length === 0) {
    throw new Error("Vehicle not found");
  }

  if (vehicle.rows[0].availability_status === "booked") {
    throw new Error("Vehicle is not available");
  }

  const overlappingBookings = await pool.query(
    `SELECT id FROM bookings 
     WHERE vehicle_id = $1 
     AND status = 'active'
     AND (
       (rent_start_date <= $2 AND rent_end_date >= $2) OR
       (rent_start_date <= $3 AND rent_end_date >= $3) OR
       (rent_start_date >= $2 AND rent_end_date <= $3)
     )`,
    [vehicle_id, rent_start_date, rent_end_date]
  );

  if (overlappingBookings.rows.length > 0) {
    throw new Error("Vehicle is already booked for the selected dates");
  }

  const dailyRate = parseFloat(vehicle.rows[0].daily_rent_price);
  const daysDiff = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const totalPrice = dailyRate * daysDiff;

  const result = await pool.query(
    `INSERT INTO bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
     VALUES ($1, $2, $3, $4, $5, 'active')
     RETURNING *`,
    [customer_id, vehicle_id, rent_start_date, rent_end_date, totalPrice]
  );

  await pool.query(
    `UPDATE vehicles SET availability_status = 'booked' WHERE id = $1`,
    [vehicle_id]
  );

  return result.rows[0];
};

const getAllBookings = async (userId?: number, role?: string) => {
  await pool.query(`
    UPDATE bookings 
    SET status = 'returned'
    WHERE status = 'active' AND rent_end_date < CURRENT_DATE
  `);

  await pool.query(`
    UPDATE vehicles
    SET availability_status = 'available'
    WHERE id IN (
      SELECT vehicle_id FROM bookings
      WHERE status = 'returned' AND rent_end_date < CURRENT_DATE
    )
  `);

  let query = `
    SELECT 
      bookings.*,
      users.name AS customer_name,
      users.email AS customer_email,
      vehicles.vehicle_name,
      vehicles.type,
      vehicles.registration_number
    FROM bookings
    JOIN users ON bookings.customer_id = users.id
    JOIN vehicles ON bookings.vehicle_id = vehicles.id
  `;

  const params: any[] = [];

  if (role === "customer" && userId) {
    query += ` WHERE bookings.customer_id = $1`;
    params.push(userId);
  }

  query += ` ORDER BY bookings.id DESC`;

  const result = await pool.query(query, params);
  return result.rows;
};

const getBookingById = async (
  bookingId: number,
  userId?: number,
  role?: string
) => {
  let query = `
    SELECT
      bookings.*,
      users.name AS customer_name,
      users.email AS customer_email,
      vehicles.vehicle_name,
      vehicles.type,
      vehicles.registration_number
    FROM bookings
    JOIN users ON bookings.customer_id = users.id
    JOIN vehicles ON bookings.vehicle_id = vehicles.id
    WHERE bookings.id = $1
  `;

  const params: any[] = [bookingId];

  if (role === "customer" && userId) {
    query += ` AND bookings.customer_id = $2`;
    params.push(userId);
  }

  const result = await pool.query(query, params);
  return result.rows[0];
};

const updateBooking = async (
  bookingId: number,
  action: "cancel" | "return",
  userId?: number,
  role?: string
) => {
  let query = `SELECT * FROM bookings WHERE id = $1`;
  const params: any[] = [bookingId];

  if (role === "customer") {
    query += ` AND customer_id = $2`;
    params.push(userId);
  }

  const bookingResult = await pool.query(query, params);

  if (bookingResult.rows.length === 0) {
    throw new Error("Booking not found");
  }

  const booking = bookingResult.rows[0];

  if (action === "cancel") {
    if (role !== "customer") {
      throw new Error("Only customers can cancel bookings");
    }

    const startDate = new Date(booking.rent_start_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (startDate <= today) {
      throw new Error("Cannot cancel booking after start date");
    }

    if (booking.status !== "active") {
      throw new Error("Only active bookings can be cancelled");
    }

    const result = await pool.query(
      `UPDATE bookings 
       SET status = 'cancelled'
       WHERE id = $1
       RETURNING *`,
      [bookingId]
    );

    await pool.query(
      `UPDATE vehicles SET availability_status = 'available' WHERE id = $1`,
      [booking.vehicle_id]
    );

    return result.rows[0];
  } else if (action === "return") {
    if (role !== "admin") {
      throw new Error("Only admin can mark bookings as returned");
    }

    if (booking.status !== "active") {
      throw new Error("Only active bookings can be marked as returned");
    }

    const result = await pool.query(
      `UPDATE bookings 
       SET status = 'returned'
       WHERE id = $1
       RETURNING *`,
      [bookingId]
    );

    await pool.query(
      `UPDATE vehicles SET availability_status = 'available' WHERE id = $1`,
      [booking.vehicle_id]
    );

    return result.rows[0];
  }

  throw new Error("Invalid action");
};

export const bookingsService = {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBooking,
};
