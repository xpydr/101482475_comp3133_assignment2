# Employee Management System

A comprehensive Employee Management System built with GraphQL, Node.js, MongoDB, and Cloudinary. This system provides secure user authentication and full CRUD operations for managing employee records with photo uploads.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [GraphQL Queries and Mutations](#graphql-queries-and-mutations)
- [Authentication](#authentication)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)

## Features

- **User Authentication**: Secure signup and login with JWT tokens
- **Employee Management**: Full CRUD operations for employee records
- **Image Upload**: Employee photo management using Cloudinary
- **Search Functionality**: Search employees by designation or department
- **Data Validation**: Comprehensive input validation for all operations
- **GraphQL API**: Flexible and efficient API using GraphQL
- **GraphQL Playground**: Interactive API testing interface

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Apollo Server (GraphQL)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) with bcryptjs
- **Image Storage**: Cloudinary
- **Validation**: Validator.js
- **Environment Management**: dotenv

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **npm** or **yarn** package manager
- **Cloudinary Account** (free tier available) - [Sign up](https://cloudinary.com/)

## Installation

1. **Clone the repository** (if applicable) or navigate to the project directory:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up MongoDB**:
   - Make sure MongoDB is running on your local machine
   - Default connection: `mongodb://localhost:27017/comp3133_101482475_assignment1`
   - Or use MongoDB Atlas (cloud) and update the connection string in `.env`

4. **Configure environment variables** (see [Configuration](#configuration) section)

## Configuration

Create a `.env` file in the `backend` directory with the following variables:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/comp3133_101482475_assignment1

# JWT Secret Key (change this in production)
JWT_SECRET=your-secret-key-change-in-production

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name

# Server Port (optional, defaults to 4000)
PORT=4000
```

### Getting Cloudinary Credentials

1. Sign up for a free account at [cloudinary.com](https://cloudinary.com/)
2. Navigate to your Dashboard
3. Copy your Cloud Name, API Key, and API Secret
4. Add them to your `.env` file

## Running the Application

### Development Mode (with auto-reload)

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

The server will start on `http://localhost:4000` (or the port specified in your `.env` file).

Once running, you can access:
- **GraphQL Playground**: `http://localhost:4000` - Interactive GraphQL interface for testing queries and mutations

## API Documentation

### GraphQL Endpoint

- **URL**: `http://localhost:4000`
- **GraphQL Playground**: `http://localhost:4000` (enabled in development)

## GraphQL Queries and Mutations

### Authentication

#### Signup (Mutation)

Create a new user account.

```graphql
mutation Signup {
  signup(
    username: "johndoe"
    email: "john@example.com"
    password: "password123"
  ) {
    token
    user {
      id
      username
      email
      created_at
      updated_at
    }
  }
}
```

#### Login (Query)

Authenticate and receive a JWT token.

```graphql
query Login {
  login(
    usernameOrEmail: "johndoe"
    password: "password123"
  ) {
    token
    user {
      id
      username
      email
      created_at
      updated_at
    }
  }
}
```

### Employee Operations

#### Get All Employees (Query)

Retrieve all employees. **Requires authentication**.

```graphql
query GetAllEmployees {
  getAllEmployees {
    id
    first_name
    last_name
    email
    gender
    designation
    salary
    date_of_joining
    department
    employee_photo
    created_at
    updated_at
  }
}
```

**Headers Required**:
```
Authorization: Bearer <your-jwt-token>
```

#### Get Employee by ID (Query)

Retrieve a specific employee by ID. **Requires authentication**.

```graphql
query GetEmployeeById {
  getEmployeeById(eid: "employee-id-here") {
    id
    first_name
    last_name
    email
    gender
    designation
    salary
    date_of_joining
    department
    employee_photo
    created_at
    updated_at
  }
}
```

#### Search Employees (Query)

Search employees by designation or department. **Requires authentication**.

```graphql
query SearchEmployees {
  searchEmployees(designation: "Manager", department: "Engineering") {
    id
    first_name
    last_name
    email
    designation
    department
    salary
  }
}
```

You can search by:
- `designation` only
- `department` only
- Both `designation` and `department`

#### Add Employee (Mutation)

Create a new employee record. **Requires authentication**.

```graphql
mutation AddEmployee {
  addEmployee(
    input: {
      first_name: "John"
      last_name: "Doe"
      email: "john.doe@example.com"
      gender: "Male"
      designation: "Software Engineer"
      salary: 75000
      date_of_joining: "2024-01-15"
      department: "Engineering"
      employee_photo: "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
    }
  ) {
    id
    first_name
    last_name
    email
    designation
    salary
    department
    employee_photo
  }
}
```

**Note**: `employee_photo` should be a base64-encoded image string (e.g., `data:image/jpeg;base64,...`) or a URL. The image will be uploaded to Cloudinary automatically.

#### Update Employee (Mutation)

Update an existing employee record. **Requires authentication**.

```graphql
mutation UpdateEmployee {
  updateEmployee(
    eid: "employee-id-here"
    input: {
      salary: 80000
      designation: "Senior Software Engineer"
      employee_photo: "data:image/jpeg;base64,..."
    }
  ) {
    id
    first_name
    last_name
    email
    designation
    salary
    department
    employee_photo
    updated_at
  }
}
```

**Note**: Only include fields you want to update. All fields except `id` are optional.

#### Delete Employee (Mutation)

Delete an employee record. **Requires authentication**.

```graphql
mutation DeleteEmployee {
  deleteEmployee(eid: "employee-id-here") {
    id
    first_name
    last_name
    email
  }
}
```

**Note**: This will also delete the employee's photo from Cloudinary if one exists.

## Authentication

Most operations require authentication. After signing up or logging in, you'll receive a JWT token. Include this token in the `Authorization` header for protected operations:

```
Authorization: Bearer <your-jwt-token>
```

### Token Expiration

JWT tokens expire after 7 days. You'll need to log in again to get a new token.

### Using GraphQL Playground

1. Open `http://localhost:4000` in your browser
2. For authenticated queries/mutations, click "HTTP HEADERS" at the bottom
3. Add:
   ```json
   {
     "Authorization": "Bearer <your-token-here>"
   }
   ```

## Project Structure

```
backend/
├── src/
│   ├── db/
│   │   └── connection.js          # MongoDB connection configuration
│   ├── models/
│   │   ├── User.js                 # User model schema
│   │   └── Employee.js             # Employee model schema
│   ├── schema/
│   │   ├── typeDefs.js             # GraphQL type definitions
│   │   └── resolvers.js            # GraphQL resolvers (business logic)
│   ├── utils/
│   │   ├── auth.js                 # JWT authentication utilities
│   │   ├── cloudinary.js           # Cloudinary image upload utilities
│   │   └── validation.js           # Input validation utilities
│   └── index.js                    # Application entry point
├── .env                            # Environment variables (not in git)
├── .gitignore                      # Git ignore rules
└── package.json                    # Dependencies and scripts
```

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `MONGODB_URI` | MongoDB connection string | Yes | `mongodb://localhost:27017/comp3133_101482475_assignment1` |
| `JWT_SECRET` | Secret key for JWT token signing | Yes | - |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | Yes | - |
| `CLOUDINARY_API_KEY` | Cloudinary API key | Yes | - |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | Yes | - |
| `CLOUDINARY_URL` | Full Cloudinary URL | Optional | - |
| `PORT` | Server port | No | `4000` |

## Data Models

### User Model

```javascript
{
  username: String (required, unique)
  email: String (required, unique)
  password: String (required, hashed)
  created_at: Date
  updated_at: Date
}
```

### Employee Model

```javascript
{
  first_name: String (required)
  last_name: String (required)
  email: String (required, unique)
  gender: String (enum: 'Male', 'Female', 'Other')
  designation: String (required)
  salary: Number (required, min: 1000)
  date_of_joining: Date (required)
  department: String (required)
  employee_photo: String (Cloudinary URL)
  created_at: Date
  updated_at: Date
}
```

## Validation Rules

### User Signup
- Username: Required, must be unique
- Email: Required, must be valid email format, must be unique
- Password: Required, minimum 6 characters

### Employee Creation/Update
- First Name: Required
- Last Name: Required
- Email: Required, must be valid email format, must be unique
- Designation: Required
- Salary: Required, must be a number, minimum 1000
- Date of Joining: Required, must be a valid date
- Department: Required
- Gender: Optional, must be one of: 'Male', 'Female', 'Other'
- Employee Photo: Optional, base64 image string or URL

## Troubleshooting

### MongoDB Connection Issues

**Error**: `MongoDB connection error`

**Solutions**:
1. Ensure MongoDB is running: `mongod` or check MongoDB service status
2. Verify the connection string in `.env` is correct
3. Check if MongoDB is listening on the default port (27017)
4. For MongoDB Atlas, ensure your IP is whitelisted

### Cloudinary Upload Issues

**Error**: `Failed to upload image`

**Solutions**:
1. Verify Cloudinary credentials in `.env` are correct
2. Check your Cloudinary account is active
3. Ensure the image format is supported (JPEG, PNG, etc.)
4. Verify base64 string format: `data:image/jpeg;base64,...`

### Authentication Errors

**Error**: `Authentication required` or `Invalid or expired token`

**Solutions**:
1. Ensure you're including the `Authorization` header
2. Check token format: `Bearer <token>`
3. Token may have expired (7 days), log in again
4. Verify `JWT_SECRET` in `.env` matches the one used to create the token

### Port Already in Use

**Error**: `EADDRINUSE: address already in use`

**Solutions**:
1. Change the `PORT` in `.env` to a different port
2. Stop the process using the port:
   - Windows: `netstat -ano | findstr :4000` then `taskkill /PID <pid> /F`
   - Mac/Linux: `lsof -ti:4000 | xargs kill`

### Module Not Found Errors

**Error**: `Cannot find module`

**Solutions**:
1. Run `npm install` to install dependencies
2. Ensure you're in the `backend` directory
3. Delete `node_modules` and `package-lock.json`, then run `npm install` again

## Development Tips

1. **GraphQL Playground**: Use the built-in GraphQL Playground at `http://localhost:4000` to test queries and mutations interactively.

2. **Image Upload**: When uploading images, use base64 encoding. You can convert images to base64 using online tools or Node.js:
   ```javascript
   const fs = require('fs');
   const image = fs.readFileSync('path/to/image.jpg');
   const base64 = image.toString('base64');
   const dataUri = `data:image/jpeg;base64,${base64}`;
   ```

3. **Testing Authentication**: Always test authentication flow first (signup/login) before testing protected endpoints.

4. **Error Messages**: The API returns descriptive error messages. Check the GraphQL error response for details.
