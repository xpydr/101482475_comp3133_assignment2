# Employee Management System (Angular + GraphQL)

This repository contains a full-stack Employee Management System with an Angular frontend and a Node.js GraphQL backend. The app supports authentication, employee record management, and employee photo handling.

## Tech Stack

- Frontend: Angular 21, TypeScript
- Backend: Node.js, Apollo Server (GraphQL), MongoDB, JWT, Cloudinary

## Repository Structure

```text
.
|- frontend/   # Angular client application
`- backend/    # GraphQL API server
```

## Quick Start

### 1) Install Dependencies

In two separate terminals:

```bash
cd backend
npm install
```

```bash
cd frontend
npm install
```

### 2) Configure Backend Environment

Create `backend/.env` with the required values:

```env
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

### 3) Run the App

Start backend:

```bash
cd backend
npm run dev
```

Start frontend:

```bash
cd frontend
npm start
```

## Default URLs

- Frontend: `http://localhost:4200`
- Backend GraphQL endpoint/playground: `http://localhost:4000`

## More Details

For complete backend API usage, GraphQL examples, and troubleshooting, see [backend/README.md](backend/README.md).
