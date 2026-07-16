# Employee Management System (EMS)

A Full Stack Employee Management System built with Next.js, Node.js, Express, and Prisma. This project was built to fulfill a full-stack developer hiring assignment.

## Features

- **Premium Glassmorphism UI:** Stunning, state-of-the-art UI utilizing translucent panels, blurred backgrounds, and vibrant gradients.
- **Role-Based Access Control (RBAC):** Secure authentication with JWT. Roles include Super Admin, HR Manager, and Employee, each with distinct permissions.
- **Public Sign Up:** New users can securely sign up and create their own employee accounts using the `/signup` route.
- **Employee Management:** Full CRUD operations for employees with server-side pagination, search, and filtering.
- **Attendance & Analytics Dashboard:** Real-time data visualization (Recharts), dynamic employee counters, and a dedicated Attendance tracking module showing active vs. inactive employees.
- **Organizational Hierarchy:** Visual representation of the reporting structure and cycle-detection to prevent circular reporting assignments.
- **Soft Delete:** Employees are softly deleted (flagged as deleted in the database) instead of permanently removed, ensuring data integrity.

## Tech Stack

- **Frontend:** Next.js 14 (App Router), React, TypeScript, Tailwind CSS, shadcn/ui, Recharts.
- **Backend:** Node.js, Express.js, TypeScript, Zod (Validation), Prisma ORM.
- **Database:** SQLite (Default for easy local setup). A `docker-compose.yml` for PostgreSQL is also provided.

## Live Demo

- **Frontend (Vercel):** [https://ems-assignment.vercel.app](https://ems-assignment.vercel.app)
- **Backend API (Render):** [https://ems-assignment-oszn.onrender.com/api](https://ems-assignment-oszn.onrender.com/api)

## Default Credentials

To explore the live application or test locally, log in with the following seeded Super Admin account:

- **Email:** `admin@ems.com`
- **Password:** `admin123`

---

## Getting Started

Follow these instructions to run the project locally.

### Prerequisites

- Node.js (v18+)
- npm

### 1. Backend Setup

Navigate to the `backend` directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Set up the database and seed it with a Super Admin user:

```bash
npx prisma db push
npx tsx prisma/seed.ts
```

Start the backend server:

```bash
npm run dev
```

The backend server will run on `http://localhost:5000`.

### 2. Frontend Setup

Open a new terminal and navigate to the `frontend` directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the frontend development server:

```bash
npm run dev
```

The frontend application will run on `http://localhost:3000`.

## API Documentation

For a detailed list of all endpoints, authentication requirements, and JSON payload structures, please refer to the dedicated [API Documentation](./API_DOCUMENTATION.md) file included in this repository.

## License

This project is licensed under the MIT License.
