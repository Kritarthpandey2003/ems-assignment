# API Documentation

This document provides a detailed overview of the REST API endpoints available in the Employee Management System (EMS).

## Base URL
All API requests should be prefixed with the `/api` route.
- Local Development: `http://localhost:5000/api`
- Production: `https://ems-assignment-oszn.onrender.com/api`

## Authentication

All protected routes require a JWT token to be passed in the `Authorization` header.
**Format:** `Authorization: Bearer <your_token_here>`

---

## 1. Auth Endpoints

### 1.1 Login
Authenticate a user and receive a JWT.
- **URL:** `/auth/login`
- **Method:** `POST`
- **Body payload:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Success Response (200 OK):** Returns the JWT token and basic user info.

### 1.2 Sign Up
Public route for new users to create an employee account.
- **URL:** `/auth/signup`
- **Method:** `POST`
- **Body payload:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "department": "Engineering"
  }
  ```
- **Success Response (201 Created):** Returns the JWT token and the created user info.

### 1.3 Get Current User (Me)
Retrieve details of the currently authenticated user.
- **URL:** `/auth/me`
- **Method:** `GET`
- **Headers:** `Authorization: Bearer <token>`
- **Success Response (200 OK):** Returns full user details excluding password.

---

## 2. Employee Endpoints

### 2.1 List Employees
Retrieve a paginated list of employees. Supports filtering and searching.
- **URL:** `/employees`
- **Method:** `GET`
- **Headers:** `Authorization: Bearer <token>`
- **Query Parameters:**
  - `page` (default: 1)
  - `limit` (default: 10)
  - `search` (Search by name or email)
  - `department` (Filter by exact department name)
  - `role` (Filter by `SUPER_ADMIN`, `HR_MANAGER`, or `EMPLOYEE`)
  - `status` (Filter by `ACTIVE` or `INACTIVE`)
- **Success Response (200 OK):** Returns `{ data: [...], pagination: {...} }`

### 2.2 Get Specific Employee
Retrieve details for a single employee by their ID.
- **URL:** `/employees/:id`
- **Method:** `GET`
- **Headers:** `Authorization: Bearer <token>`
- **Success Response (200 OK):** Returns the employee object.

### 2.3 Create Employee
Create a new employee directly (requires HR or Super Admin privileges).
- **URL:** `/employees`
- **Method:** `POST`
- **Headers:** `Authorization: Bearer <token>`
- **Body payload:**
  ```json
  {
    "name": "Jane Smith",
    "email": "jane@example.com",
    "password": "temp_password",
    "role": "EMPLOYEE",
    "department": "Marketing"
  }
  ```
- **Success Response (201 Created):** Returns the created employee.

### 2.4 Update Employee
Update an existing employee's details.
- **URL:** `/employees/:id`
- **Method:** `PUT`
- **Headers:** `Authorization: Bearer <token>`
- **Body payload:** Fields to update (e.g., `name`, `department`, `salary`, `status`). Note: Regular employees can only update their own profile and cannot modify their salary or role.
- **Success Response (200 OK):** Returns the updated employee.

### 2.5 Soft Delete Employee
Mark an employee as deleted (requires Super Admin privileges).
- **URL:** `/employees/:id`
- **Method:** `DELETE`
- **Headers:** `Authorization: Bearer <token>`
- **Success Response (200 OK):** Returns `{ "message": "Employee deleted successfully" }`

### 2.6 Assign Reporting Manager
Assign or change the reporting manager for an employee. Includes circular dependency protection.
- **URL:** `/employees/:id/manager`
- **Method:** `PATCH`
- **Headers:** `Authorization: Bearer <token>`
- **Body payload:**
  ```json
  {
    "managerId": "uuid-of-manager"
  }
  ```
- **Success Response (200 OK):** Returns `{ "message": "Manager assigned successfully" }`

---

## 3. Organization Endpoints

### 3.1 Organization Tree
Retrieve the full organizational reporting hierarchy.
- **URL:** `/organization/tree`
- **Method:** `GET`
- **Headers:** `Authorization: Bearer <token>`
- **Success Response (200 OK):** Returns a nested JSON structure representing the reporting chain. Top-level nodes are employees with no reporting manager.
