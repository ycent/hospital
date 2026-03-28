# Hospital Appointment Booking System

A full-stack web application designed as an academic project to manage hospital appointments. It features user roles (Patient, Doctor, Admin) and role-based access control.

## Tech Stack
-   **Frontend**: React, Vite, Tailwind CSS, React Router DOM
-   **Backend**: Node.js, Express, SQLite
-   **Authentication**: JWT (JSON Web Tokens)

## Prerequisites
- Node.js (v16 or higher)
- npm

## Installation & Setup

1. **Clone/Navigate to the directory**:
    Ensure you are in the `hospital-booking` root directory.

2. **Backend Setup**:
    ```bash
    cd backend
    npm install
    # Seed the database with sample data
    npm run seed
    # Run the backend server (runs on port 5000)
    npm start
    ```

3. **Frontend Setup** (Open a new terminal):
    ```bash
    cd frontend
    npm install
    # Run the frontend development server
    npm run dev
    ```

## Sample Credentials

The database is seeded with the following accounts for easy testing:

- **Admin Account:**
  - Email: `admin@hospital.com`
  - Password: `admin123`

- **Doctor Accounts:**
  - Email: `alice@hospital.com` / Password: `doc123`
  - Email: `bob@hospital.com` / Password: `doc123`
  - Email: `clara@hospital.com` / Password: `doc123`

- **Patient Account:**
  - Email: `patient@hospital.com`
  - Password: `pat123`

## Features & Roles

- **Patient**: Register, login, view doctors, book appointments, view/cancel own appointments. Prevented from double-booking.
- **Doctor**: Login, view assigned appointments, update status (Completed, Cancelled).
- **Admin**: View all system data, manage doctors.

## Testing Guidelines

1. Log in as **Admin**. Add a new doctor and verify they appear in the system.
2. Log in as the **Patient**. Go to "Book Appt" and schedule a visit. Try to book the exact same time slot to verify the double-booking check.
3. Log in as the corresponding **Doctor** and mark the newly created appointment as "Completed".
