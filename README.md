# NeuroLink — Real-Time Expert Session Booking Platform

NeuroLink is a full-stack session booking platform where users can browse experts, view available slots, and book sessions in real time.

The application focuses on scalable backend architecture, real-time slot synchronization, and race-condition-safe booking management using Socket.io and MongoDB.

Built using React, Node.js, Express, MongoDB, and Socket.io.

---

# Features

## Expert Discovery

* Browse experts
* Search experts by name
* Filter experts by category
* Pagination support
* Responsive expert cards

## Real-Time Session Booking

* View available slots grouped by date
* Book consultation sessions
* Real-time slot updates using Socket.io
* Instantly disable booked slots across clients

## Double Booking Prevention

* Database-level booking protection
* Handles race conditions properly
* Unique compound index enforcement on:

  * expertId
  * date
  * slot

## Booking Management

* View bookings by email
* Booking status tracking:

  * Pending
  * Confirmed
  * Completed

## UI/UX

* Responsive design
* Loading states
* Error handling
* Toast notifications
* Clean and modern interface

---

# Tech Stack

## Frontend

* React.js (Vite)
* Tailwind CSS
* React Router
* Axios
* Socket.io Client

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* Socket.io

---

# Project Structure

## Backend

backend/

├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── sockets/
├── utils/

## Frontend

frontend/src/
├── components/
├── pages/
├── layouts/
├── services/
├── hooks/
├── socket/
├── utils/

---

# API Endpoints

## Experts

* GET /experts
* GET /experts/:id

## Bookings

* POST /bookings
* PATCH /bookings/:id/status
* GET /bookings?email=

---

# Environment Variables

Create a `.env` file inside backend:

PORT=5000

MONGO_URI=your_mongodb_connection_string

CLIENT_URL=http://localhost:5173

---

# Installation & Setup

## Clone Repository

```bash
git clone <your-repo-url>
```

## Backend Setup

```bash
cd backend
npm install
npm run dev
```

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

# Key Engineering Highlights

* Real-time synchronization using Socket.io
* Race-condition-safe booking system
* Centralized error handling
* Scalable REST API architecture
* Modular folder structure
* Reusable frontend components

---

# Future Improvements

* Authentication & Authorization
* Payment Integration
* Video Consultation Integration
* Admin Dashboard
* Email Notifications
* Calendar Sync

---

# Author

Built as part of a full-stack internship assignment focused on real-time systems and scalable backend architecture.
