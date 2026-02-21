Backend Banking System
A robust banking backend API built with Node.js, Express, MongoDB, and Mongoose. This system implements secure user authentication, account management, and transaction processing with double-entry ledger accounting.

🚀 Features
Authentication & Authorization
JWT-based authentication

Token blacklisting for secure logout

Password hashing with bcrypt

Protected routes with middleware

System user privileges for special operations

Account Management
Create multiple accounts per user

Account status management (ACTIVE/FROZEN/CLOSED)

Real-time balance calculation from ledger entries

Currency support (default: INR)

Transaction Processing
Idempotent API - Prevents duplicate transactions

Double-entry ledger - Ensures data integrity

Atomic transactions - MongoDB sessions for ACID compliance

Balance validation - Prevents overdrawing

Status tracking - PENDING → COMPLETED/FAILED/REVERSED

Immutable ledger entries - Tamper-proof audit trail

Email Notifications
Welcome emails on registration

Transaction success/failure notifications

Nodemailer with Gmail OAuth2 integration

Security Features
Environment variable configuration

Input validation at schema level

Blacklisted token management

Immutable financial records

Secure password storage

📋 Prerequisites
Node.js (v14 or higher)

MongoDB (v4 or higher)

Gmail account for email notifications

🛠️ Installation
Clone the repository

bash
git clone <repository-url>
cd backend-banking
Install dependencies

bash
npm install
Environment setup
Create a .env file in the root directory:

env
# Server
PORT=3000
MONGO_URI=mongodb://localhost:27017/banking-system

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this

# Email Configuration (Gmail with OAuth2)
EMAIL_USER=your-email@gmail.com
CLIENT_ID=your-google-client-id
CLIENT_SECRET=your-google-client-secret
REFRESH_TOKEN=your-google-refresh-token
Start the server

bash
# Development mode
npm run dev

# Production mode
npm start
📁 Project Structure
text
backend-banking/
├── src/
│   ├── config/
│   │   └── db.js                 # Database connection
│   ├── controllers/
│   │   ├── account.controller.js  # Account operations
│   │   ├── auth.controller.js     # Authentication logic
│   │   └── transaction.controller.js # Transaction processing
│   ├── middleware/
│   │   └── auth.middleware.js     # JWT verification
│   ├── models/
│   │   ├── account.model.js       # Account schema
│   │   ├── blackList.model.js     # Token blacklist
│   │   ├── ledger.model.js        # Ledger entries
│   │   ├── transaction.model.js   # Transaction records
│   │   └── user.model.js          # User schema
│   └── app.js                      # Express app setup
├── routes/
│   ├── account.routes.js           # Account endpoints
│   ├── auth.routes.js              # Auth endpoints
│   └── transaction.routes.js       # Transaction endpoints
├── services/
│   └── email.service.js            # Email notifications
├── server.js                        # Entry point
├── .env                              # Environment variables
├── package.json                      # Dependencies
└── README.md                         # Documentation
🔌 API Endpoints
Authentication
Method	Endpoint	Description	Auth Required
POST	/api/auth/register	Register new user	No
POST	/api/auth/login	User login	No
POST	/api/auth/logout	User logout	Yes
Accounts
Method	Endpoint	Description	Auth Required
POST	/api/accounts/	Create new account	Yes
GET	/api/accounts/	Get user's accounts	Yes
GET	/api/accounts/balance/:accountId	Get account balance	Yes
Transactions
Method	Endpoint	Description	Auth Required
POST	/api/transactions/	Create new transaction	Yes
POST	/api/transactions/system/initial-funds	Initial funds (system only)	System User
💳 API Usage Examples
Register a User
bash
POST /api/auth/register
Content-Type: application/json

{
    "email": "user@example.com",
    "password": "securepassword",
    "name": "John Doe"
}
Create an Account
bash
POST /api/accounts/
Authorization: Bearer <jwt-token>
Transfer Money
bash
POST /api/transactions/
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
    "fromAccount": "account_id_1",
    "toAccount": "account_id_2",
    "amount": 1000,
    "idempotencyKey": "unique-key-123"
}
Check Balance
bash
GET /api/accounts/balance/:accountId
Authorization: Bearer <jwt-token>
🔒 Security Features
Password Security

Passwords hashed using bcrypt (10 rounds)

Password field excluded from queries by default

Token Management

JWT tokens expire in 3 days

Blacklisted tokens stored in database

Automatic cleanup of expired blacklisted tokens (TTL index)

Data Integrity

Ledger entries are immutable (cannot be updated/deleted)

MongoDB transactions for atomic operations

Idempotency keys prevent duplicate transactions

Input Validation

Email format validation

Password minimum length (6 characters)

Account status enum validation

Transaction amount must be positive

📊 Database Schema
User Model
javascript
{
    email: String (unique, required),
    name: String (required),
    password: String (required, min:6, select: false),
    systemUser: Boolean (default: false, immutable)
}
Account Model
javascript
{
    user: ObjectId (ref: User, required),
    status: String (enum: ACTIVE/FROZEN/CLOSED, default: ACTIVE),
    currency: String (default: INR)
}
Transaction Model
javascript
{
    fromAccount: ObjectId (ref: Account, required),
    toAccount: ObjectId (ref: Account, required),
    status: String (enum: PENDING/COMPLETED/FAILED/REVERSED),
    amount: Number (required, min: 0),
    idempotencyKey: String (required, unique)
}
Ledger Model
javascript
{
    account: ObjectId (ref: Account, required, immutable),
    amount: Number (required, immutable),
    transaction: ObjectId (ref: Transaction, required, immutable),
    type: String (enum: CREDIT/DEBIT, required, immutable)
}
🧪 Testing
Run tests:

bash
npm test
🚦 Error Handling
The API returns appropriate HTTP status codes:

200 - Success

201 - Created

400 - Bad Request (invalid input)

401 - Unauthorized (missing/invalid token)

403 - Forbidden (insufficient privileges)

404 - Not Found

409 - Conflict (duplicate entry)

422 - Unprocessable Entity (validation error)

500 - Internal Server Error

📈 Performance Considerations
Database indexes on frequently queried fields

Aggregation pipeline for balance calculation

TTL index for automatic cleanup of blacklisted tokens

Connection pooling with MongoDB driver

🔧 Environment Variables
Variable	Description	Required
MONGO_URI	MongoDB connection string	Yes
JWT_SECRET	Secret for JWT signing	Yes
EMAIL_USER	Gmail address for notifications	Yes
CLIENT_ID	Google OAuth2 client ID	Yes
CLIENT_SECRET	Google OAuth2 client secret	Yes
REFRESH_TOKEN	Google OAuth2 refresh token	Yes
🤝 Contributing
Fork the repository

Create your feature branch (git checkout -b feature/amazing-feature)

Commit your changes (git commit -m 'Add some amazing feature')

Push to the branch (git push origin feature/amazing-feature)

Open a Pull Request

📝 License
This project is licensed under the ISC License.

👨‍💻 Author
Ayush Soni

🙏 Acknowledgments
MongoDB for the excellent database

Express.js community

Node.js developers
