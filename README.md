# Kapusta Financial Tracker API

Kapusta Financial Tracker API is a backend application for managing financial transactions, allowing users to register, log in, add income and expenses, and retrieve transaction statistics.

![Node.js Badge](https://img.shields.io/badge/Node.js-5FA04E?logo=nodedotjs&logoColor=fff&style=flat)
![Express Badge](https://img.shields.io/badge/Express-000?logo=express&logoColor=fff&style=flat)
![MongoDB Badge](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=fff&style=flat)
![Mongoose Badge](https://img.shields.io/badge/Mongoose-800?logo=mongoose&logoColor=fff&style=flat)
![JSON Web Tokens Badge](https://img.shields.io/badge/JSON%20Web%20Tokens-000?logo=jsonwebtokens&logoColor=fff&style=flat)
![.ENV Badge](https://img.shields.io/badge/.ENV-ECD53F?logo=dotenv&logoColor=000&style=flat)

## Built With

- **Node.js** - JavaScript runtime built on Chrome's V8 JavaScript engine
- **Express.js** - Fast, unopinionated, minimalist web framework for Node.js
- **MongoDB** - NoSQL database for storing user and transaction data
- **Mongoose** - Elegant MongoDB object modeling for Node.js
- **JSON Web Token (JWT)** - Compact, URL-safe means of representing claims to be transferred between two parties
- **Bcrypt** - Library to help hash passwords
- **Nanoid** - Secure, URL-friendly unique string ID generator
- **Joi** - Powerful schema description language and data validator for JavaScript
- **Dotenv** - Module to load environment variables from a `.env` file into `process.env`

## Getting Started

To get a local copy up and running, follow these steps.

### Prerequisites

Ensure you have the following installed on your machine:

- Node.js (v14 or later)
- npm (v6 or later)
- MongoDB (local or hosted)

### Installation

1. Clone the Repository

```bash
git clone https://github.com/valik3201/kapusta-nodejs-server.git
cd kapusta-nodejs-server
```

2. Install Dependencies

```bash
npm install
```

### Environment Configuration

Create a `.env` file in the root directory and add the following variables:

```env
PORT=3000
DB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### Running the Application

To start the application in development mode, use:

```bash
npm run start:dev
```

To start the application in production mode, use:

```bash
npm start
```

## API Endpoints

### Authentication

- **Register**: `POST /api/auth/register`

  - Request body: `{ "email": "user@example.com", "password": "password123" }`
  - Response: `201 Created` with user data

- **Login**: `POST /api/auth/login`

  - Request body: `{ "email": "user@example.com", "password": "password123" }`
  - Response: `200 OK` with tokens and user data

- **Logout**: `POST /api/auth/logout`
  - Requires authentication
  - Response: `204 No Content`

### User

- **Get User Data**: `GET /api/user/`

  - Requires authentication
  - Response: `200 OK` with user data and transactions

- **Update Balance**: `PATCH /api/user/balance`
  - Requires authentication
  - Request body: `{ "newBalance": 1000 }`
  - Response: `200 OK` with new balance

### Transactions

- **Add Income**: `POST /api/transaction/income`

  - Requires authentication
  - Request body: `{ "date": "2023-01-01", "description": "Salary", "category": "Salary", "amount": 5000 }`
  - Response: `200 OK` with new transaction and updated balance

- **Add Expense**: `POST /api/transaction/expense`

  - Requires authentication
  - Request body: `{ "date": "2023-01-01", "description": "Groceries", "category": "Products", "amount": 100 }`
  - Response: `200 OK` with new transaction and updated balance

- **Delete Transaction**: `DELETE /api/transaction/:transactionId`

  - Requires authentication
  - Response: `200 OK` with updated balance

- **Get Income Transactions**: `GET /api/transaction/income`

  - Requires authentication
  - Response: `200 OK` with income transactions and statistics

- **Get Expense Transactions**: `GET /api/transaction/expense`

  - Requires authentication
  - Response: `200 OK` with expense transactions and statistics

- **Get Income Categories**: `GET /api/transaction/income-categories`

  - Requires authentication
  - Response: `200 OK` with income categories

- **Get Expense Categories**: `GET /api/transaction/expense-categories`

  - Requires authentication
  - Response: `200 OK` with expense categories

- **Get Transactions by Date**: `GET /api/transaction/period-data?date=YYYY-MM`
  - Requires authentication
  - Response: `200 OK` with transactions grouped by categories

## Frontend

The frontend for this application can be found at [Kapusta React Client](https://github.com/Valik3201/kapusta-react-client).
