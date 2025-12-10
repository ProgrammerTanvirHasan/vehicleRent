# Vehicle Rental Server

A comprehensive backend API for managing vehicle rentals, bookings, customers, and administrative operations.

## 1. Project Name & Live URL

**Project Name:** Vehicle Rental Server  
**Live URL:** _[Add your deployment URL here]_

---

## 2. All Features

### Authentication & Authorization

- JWT-based authentication
- Role-based access control (Admin & Customer)
- Secure password hashing with bcrypt

### For Vehicle Management

- Create, read, update, and delete vehicles
- Vehicle availability tracking
- Daily rent price management
- Support for multiple vehicle types (car, bike, van, SUV)

### For User Management

- User profile management
- Admin can manage all users
- Customers can manage their own profiles
- Role assignment and updates

### For Booking Management

- Vehicles bookings with date validation
- Automatic price calculation (daily rate × duration)
- Overlapping booking prevention
- Booking cancellation (customers only, before start date)
- Auto-update expired bookings to "returned" status
- Vehicle availability auto-update

---

## 3. Technology Stack

- **Runtime:** Node.js
- **Language:** TypeScript
- **Web Framework:** Express.js
- **Database:** PostgreSQL
- **Authentication:**
  - jsonwebtoken (JWT tokens)
  - bcryptjs (Password hashing)
- **Environment:** dotenv

---

## 4. Setup & Installation

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- npm package manager

### Installation Steps

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Set up environment variables**

   Create a `.env` file in the root directory with the following variables:

   ```env
   CONNECTION_STR=postgresql://username:password@localhost:5432/vehicle_rental_db
   PORT=5000
   SECRET_KEY=your-secret-jwt-key-here-minimum-32-characters
   ```

   **Environment Variables Explanation:**

   - `CONNECTION_STR` - PostgreSQL database connection string

     - Format: `postgresql://username:password@host:port/database_name`
     - Example: `postgresql://postgres:mypassword@localhost:5432/vehicle_rental_db`

   - `PORT` - Server port number (default: 5000)

     - Example: `5000`

   - `SECRET_KEY` - Secret key for JWT token signing and verification
     - Should be a strong, random string (minimum 32 characters recommended)
     - Example: `my-super-secret-jwt-key-2024-vehicle-rental-system`

   **Important Notes:**

   - Never commit the `.env` file to version control
   - Keep your `SECRET_KEY` secure and never share it publicly
   - Replace all placeholder values with your actual credentials

3. **Database Setup**

   The application will automatically create the required tables (`users`, `vehicles`, `bookings`) when you start the server for the first time.

4. **Start the development server**

   ```bash
   npm run dev
   ```

   The server will start on `http://localhost:5000` (or the port specified in your `.env` file).

---

## 5. API Endpoints

### Authentication

- `POST /api/v1/auth/signup` - Register a new user
- `POST /api/v1/auth/signin` - Login and get JWT token

### Vehicles

- `GET /api/v1/vehicles` - Get all vehicles (Public)
- `GET /api/v1/vehicles/:vehicleId` - Get vehicle by ID (Public)
- `POST /api/v1/vehicles` - Create vehicle (Admin only)
- `PUT /api/v1/vehicles/:vehicleId` - Update vehicle (Admin only)
- `DELETE /api/v1/vehicles/:vehicleId` - Delete vehicle (Admin only)

### Users

- `GET /api/v1/users` - Get all users (Admin only)
- `GET /api/v1/users/:userId` - Get user by ID (Admin or Own)
- `PUT /api/v1/users/:userId` - Update user (Admin or Own)
- `DELETE /api/v1/users/:userId` - Delete user (Admin only)

### Bookings

- `POST /api/v1/bookings` - Create booking (Customer or Admin)
- `GET /api/v1/bookings` - Get all bookings (Role-based)
- `GET /api/v1/bookings/:bookingId` - Get booking by ID (Role-based)
- `PUT /api/v1/bookings/:bookingId` - Update booking (Customer: cancel, Admin: mark as returned)

---

## 6. Example API Requests

### Register a User

```bash
POST /api/v1/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "1234567890",
  "role": "customer"
}
```

### Login

```bash
POST /api/v1/auth/signin
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Create a Vehicle (Admin)

```bash
POST /api/v1/vehicles
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "vehicle_name": "Toyota Camry",
  "type": "car",
  "registration_number": "ABC-1234",
  "daily_rent_price": 50.00,
  "availability_status": "available"
}
```

### Create a Booking

```bash
POST /api/v1/bookings
Authorization: Bearer <customer_token>
Content-Type: application/json

{
  "vehicle_id": 1,
  "rent_start_date": "2024-01-15",
  "rent_end_date": "2024-01-20"
}
```

---

## 7. Project Structure

```
vehicleRent/
├── src/
│   ├── config/          # Configuration files
│   ├── database/        # Database connection and initialization
│   ├── middleware/      # Authentication and authorization middleware
│   ├── modules/         # Feature modules
│   │   ├── auth/        # Authentication module
│   │   ├── bookings/    # Bookings module
│   │   ├── user/        # User management module
│   │   └── vehicels/    # Vehicle management module
│   ├── types/           # TypeScript type definitions
│   └── server.ts        # Application entry point
├── .env                 # Environment variables (create this)
├── package.json
├── tsconfig.json
└── README.md
```

---

## 8. Important Notes

- All dates should be in `YYYY-MM-DD` format
- JWT tokens expire after 7 days
- Passwords must be at least 6 characters long
- Vehicle types: `car`, `bike`, `van`, `SUV`
- Booking statuses: `active`, `cancelled`, `returned`
- Vehicle availability: `available`, `booked`
- Always include the JWT token in the `Authorization` header for protected endpoints: `Authorization: Bearer <token>`

---

## 9. License

ISC
