1.PROJECT NAME : Vehicle Rental Server.
2.Live URL :

3.All Features

*JWT-based authentication
*Role-based access control (Admin & Customer)
\*Secure password hashing with bcrypt

For Vehicle
.................
Create, read, update, and delete vehicles
Vehicle availability
Daily rent price

For User Management
.......................
User profile management
Admin can manage all users
Customers can manage their own profiles
Role assignment and updates

For Booking Management
.......................
Vehicles bookings with date validation
Automatic price calculation
Booking cancellation (customers only, before start date)
Auto-update expired bookings to "returned" status
Vehicle availability

4.Technology

Node.js
TypeScript
Express.js
PostgreSQL

jsonwebtoken
bcryptjs
dotenv

6.Set up environment variables
first install npm
Create a .env file in the root directory
CONNECTION_STR=postgresql connection URL
PORT=5000
SECRET_KEY=jwt secret key
