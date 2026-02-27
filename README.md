# TaskFlow - Task Management System

A full-stack Task Management System built with **Node.js**, **Express**, **TypeScript**, **Prisma**, **MySQL** (backend) and **Next.js**, **TypeScript**, **Tailwind CSS** (frontend).

## 🏗️ Architecture

```
Frontend (Next.js :3000) → Backend API (Express :5000) → MySQL Database
```

## 🛠️ Tech Stack

| Layer     | Technology                                      |
| --------- | ----------------------------------------------- |
| Frontend  | Next.js 16, TypeScript, Tailwind CSS v4         |
| Backend   | Node.js, Express.js, TypeScript                 |
| ORM       | Prisma v7                                       |
| Database  | MySQL                                           |
| Auth      | JWT (Access + Refresh Tokens), bcrypt            |
| HTTP      | Axios with interceptors for auto token refresh   |

## 📁 Project Structure

```
Task Management System/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma          # Database schema
│   ├── src/
│   │   ├── config/                # DB client & env config
│   │   ├── controllers/           # HTTP request handlers
│   │   ├── middleware/            # Auth & error middleware
│   │   ├── routes/                # Express route definitions
│   │   ├── services/              # Business logic layer
│   │   ├── types/                 # TypeScript interfaces
│   │   ├── utils/                 # JWT, validators, errors
│   │   └── index.ts               # Server entry point
│   ├── .env                       # Environment variables
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── dashboard/         # Main dashboard page
│   │   │   ├── login/             # Login page
│   │   │   ├── register/          # Register page
│   │   │   ├── globals.css        # Design system
│   │   │   ├── layout.tsx         # Root layout
│   │   │   └── page.tsx           # Home (redirect)
│   │   ├── components/            # Reusable UI components
│   │   ├── context/               # Auth context provider
│   │   ├── lib/                   # API client & services
│   │   └── types/                 # TypeScript types
│   ├── .env.local                 # Frontend env
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18+)
- **MySQL** (via XAMPP, MySQL Server, or Docker)

### Step 1: Start MySQL Database

**Option A - XAMPP:**
1. Open XAMPP Control Panel
2. Click **Start** next to **MySQL**
3. Click **Start** next to **Apache** (for phpMyAdmin)
4. Open http://localhost/phpmyadmin
5. Create a new database called `task_management`

**Option B - MySQL CLI:**
```sql
CREATE DATABASE task_management;
```

### Step 2: Configure Backend

```bash
cd backend
```

Edit `.env` file with your MySQL credentials:
```env
DATABASE_URL="mysql://root:@localhost:3306/task_management"
```
> **Note:** XAMPP MySQL default is user `root` with empty password. Update accordingly.

### Step 3: Set Up Database Tables

```bash
cd backend
npx prisma db push
```

### Step 4: Start Backend Server

```bash
cd backend
npm run dev
```
Server will start at http://localhost:5000

### Step 5: Start Frontend

```bash
cd frontend
npm run dev
```
Frontend will start at http://localhost:3000

## 📡 API Endpoints

### Authentication
| Method | Endpoint            | Description            |
| ------ | ------------------- | ---------------------- |
| POST   | `/api/auth/register` | Register new user      |
| POST   | `/api/auth/login`    | Login user             |
| POST   | `/api/auth/refresh`  | Refresh access token   |
| POST   | `/api/auth/logout`   | Logout user            |

### Tasks (Protected - requires JWT)
| Method | Endpoint                | Description          |
| ------ | ----------------------- | -------------------- |
| GET    | `/api/tasks`            | List tasks (paginated, filtered) |
| POST   | `/api/tasks`            | Create task          |
| GET    | `/api/tasks/:id`        | Get single task      |
| PATCH  | `/api/tasks/:id`        | Update task          |
| DELETE | `/api/tasks/:id`        | Delete task          |
| PATCH  | `/api/tasks/:id/toggle` | Toggle task status   |

### Query Parameters for GET /api/tasks
| Param     | Type   | Description                          |
| --------- | ------ | ------------------------------------ |
| page      | number | Page number (default: 1)             |
| limit     | number | Items per page (default: 10)         |
| status    | string | PENDING, IN_PROGRESS, COMPLETED      |
| priority  | string | LOW, MEDIUM, HIGH                    |
| search    | string | Search by task title                 |
| sortBy    | string | Field to sort by (default: createdAt)|
| sortOrder | string | asc or desc (default: desc)          |

## 🔒 Security Features
- **JWT Access Token** (15min expiry) for API authentication
- **JWT Refresh Token** (7 day expiry) with rotation
- **bcrypt** password hashing (12 salt rounds)
- **CORS** configured for frontend origin
- **Input validation** on all endpoints

## 🎨 Frontend Features
- Dark theme with premium design
- Responsive layout (mobile + desktop)
- Toast notifications
- Animated transitions
- Search with debounce
- Filter by status & priority
- Pagination
- Create/Edit task modal
- Delete confirmation modal
- Auto token refresh on 401
