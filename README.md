# Smart Food Waste Management System 🍲

A full-stack **MERN (MongoDB, Express.js, React.js, Node.js)** web application built to eliminate urban food wastage by connecting food donors (restaurants, hotels, households) with NGOs and volunteer couriers who collect and distribute surplus food to communities in need.

---

## 🌟 Key Features

- **4 Role-Based Dashboards & Workflows:**
  - **Donor:** Create food donations, track status, view active vs history.
  - **NGO:** Smart priority available food feed, accept donations.
  - **Volunteer:** Pickup request feed, claim tasks, real-time status progression (`PICKUP_ASSIGNED` ➔ `PICKED_UP` ➔ `DELIVERED`).
  - **Admin:** Comprehensive KPIs, user account activation/deactivation, donation lifecycle monitor, and Recharts graphical analytics.
- **Smart Matching Engine:** Ranks available food listings for NGOs & volunteers based on location proximity, food quantity, and time remaining until expiry.
- **Food Expiry System:** Dynamic remaining time countdowns ("45m left", "Expired"), with automatic backend cron checks marking overdue food as `EXPIRED`.
- **Notification Subsystem:** Real-time in-app notifications & unread counter badges for every state transition in the donation lifecycle.
- **Dynamic Recharts Analytics:** Visual data charts for monthly donation trends, status distributions, and user role demographics.

---

## 🛠️ Technology Stack

- **Frontend:** React.js (Vite), React Router DOM v6, Tailwind CSS v4, Lucide Icons, Recharts, Axios.
- **Backend:** Node.js, Express.js, MongoDB (Mongoose ORM), JWT Authentication, bcryptjs password hashing, CORS.
- **Database:** MongoDB (Supports standard MongoDB local or automatic fallback to `mongodb-memory-server` out-of-the-box).

---

## 🔑 Demo Accounts (For Presentation & Evaluation)

All demo accounts are pre-configured in the database seeder script. For quick evaluation, the login page features **1-Click Auto-Fill Demo Buttons**!

| Role | Email | Password | Purpose |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@smartfood.org` | `Password123!` | System monitoring & analytics |
| **Donor** | `donor@restaurant.com` | `Password123!` | Post surplus food donations |
| **NGO** | `ngo@hopefoundation.org` | `Password123!` | Accept food donations |
| **Volunteer** | `volunteer@community.org` | `Password123!` | Claim pickup & deliver food |

---

## 📁 Project Folder Structure

```
foodwaste/
├── backend/
│   ├── config/          # Database configuration (with memory fallback)
│   ├── controllers/     # Auth, Donation, Pickup, Notification & Admin controllers
│   ├── middleware/      # JWT Protect, Role Authorize, Error Handlers
│   ├── models/          # User, Donation, Pickup & Notification Mongoose schemas
│   ├── routes/          # Express REST API routes
│   ├── services/        # Smart matching algorithm & Expiry checker
│   ├── utils/           # JWT generator & Geo distance utilities
│   ├── seed.js          # Database seeder script
│   └── server.js        # Express server entrypoint
│
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable UI cards, badges, navbar, sidebar, stats
│   │   ├── context/     # AuthContext & ToastContext
│   │   ├── layouts/     # PublicLayout & DashboardLayout
│   │   ├── pages/       # Public & Role-specific Dashboard pages
│   │   ├── services/    # Axios API client
│   │   ├── utils/       # Countdown & date helpers
│   │   ├── App.jsx      # Router & Protected Route Guards
│   │   └── main.jsx
│   └── vite.config.js
│
└── README.md
```

---

## 🚀 Quick Start & Running Locally

### Prerequisites
- Node.js (v16+ recommended)
- npm or yarn

### 1. Backend Setup
```bash
cd backend
npm install
npm run seed     # Seeds database with demo accounts & sample donations
npm run dev      # Starts Express server on http://localhost:5000
```

### 2. Frontend Setup
In a new terminal window:
```bash
cd frontend
npm install
npm run dev      # Starts Vite dev server on http://localhost:5173
```

Access the application in your browser at `http://localhost:5173`.

---

## 🔄 End-to-End Workflow Demonstration

1. **Log in as Donor** (`donor@restaurant.com`):
   - Click **"Donate Food"**.
   - Submit a new donation (e.g. *50 Veg Biryani Meal Boxes*). Status starts as `PENDING`.
2. **Log in as NGO** (`ngo@hopefoundation.org`):
   - Go to **"Available Food"**. The new donation appears at the top due to **Smart Matching**.
   - Click **"Accept Donation"**. Status updates to `ACCEPTED`.
3. **Log in as Volunteer** (`volunteer@community.org`):
   - Go to **"Pickup Requests"**.
   - Click **"Accept Pickup Task"**. Status updates to `PICKUP_ASSIGNED`.
   - On **"Active Delivery"**, click **"Mark Collected (PICKED_UP)"**, then **"Mark Delivered (DELIVERED)"**.
4. **Log in as Admin** (`admin@smartfood.org`):
   - View updated **Dashboard Analytics**, total meals delivered, and live donation monitors.

---

## 📡 Backend REST API Overview

- `POST /api/auth/register` — Register new Donor/NGO/Volunteer
- `POST /api/auth/login` — Authenticate & get JWT token
- `GET /api/donations` — Fetch all donations
- `POST /api/donations` — Create new food donation (Donor)
- `GET /api/donations/available` — Smart-matched feed for NGOs
- `POST /api/donations/:id/accept` — Accept donation (NGO)
- `GET /api/pickups/available` — Available pickups for Volunteers
- `POST /api/pickups/:id/accept` — Claim pickup task (Volunteer)
- `PUT /api/pickups/:id/status` — Update transit status (`PICKED_UP` / `DELIVERED`)
- `GET /api/admin/statistics` — Real-time aggregate platform statistics
- `GET /api/notifications` — Fetch user notification feed
