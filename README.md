# TaskFlow - Task Management System

A full-stack, production-ready Task Management System built with **Next.js**, **Node.js**, **Express**, **TypeScript**, and **Prisma**. This application provides a seamless and secure experience for managing tasks with a premium UI, JWT authentication, and comprehensive CRUD functionality.

## 🌐 Live Demo

- **Frontend:** https://task-management-system-one-cyan.vercel.app/dashboard
- **Backend API:** https://task-management-system-1-6o8j.onrender.com/api

## 🏗️ Architecture

```text
Frontend (Next.js) → Backend API (Express.js) → SQLite Database (via Prisma ORM)
```

## 🛠️ Tech Stack

| Layer     | Technology                                      |
| --------- | ----------------------------------------------- |
| Frontend  | Next.js, React, TypeScript, Tailwind CSS        |
| Backend   | Node.js, Express.js, TypeScript                 |
| ORM       | Prisma v5                                       |
| Database  | SQLite                                          |
| Auth      | JWT (Access + Refresh Tokens), bcryptjs         |
| Tools     | Axios, React Hot Toast                          |

## 📸 Screenshots

*(Add screenshots of your application here to showcase your premium UI)*
- **Dashboard:** `![Dashboard View](/docs/dashboard.png)`
- **Task Creation:** `![Add Task Modal](/docs/add_task.png)`
- **Authentication:** `![Login Page](/docs/login.png)`

## 📁 Project Structure

```text
Task Management System/
├── backend/
│   ├── prisma/             # Database schema (schema.prisma)
│   ├── src/
│   │   ├── config/         # DB client & env config
│   │   ├── controllers/    # API request handlers
│   │   ├── middleware/     # Auth & error middleware
│   │   ├── routes/         # Express routes
│   │   ├── services/       # Business logic (Token/Task/User)
│   │   ├── types/          # TypeScript interfaces
│   │   └── index.ts        # Server entry point
│   ├── .env                # Backend environment variables
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/            # Next.js App Router (Dashboard, Auth)
│   │   ├── components/     # Reusable UI components (TaskCard, Modals)
│   │   ├── context/        # React Context (AuthContext)
│   │   ├── lib/            # Axios instance with Interceptors
│   │   └── globals.css     # Tailwind CSS & Custom Animations
│   ├── .env.local          # Frontend environment variables
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### 1. Clone the repository
```bash
git clone https://github.com/Guptsonu22/Task-Management-System.git
cd "Task Management System"
```

### 2. Configure Backend
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` folder (see Environment Variables).
Generate the database:
```bash
npx prisma generate
npx prisma db push
npm run dev
```
*Backend runs on http://localhost:5000*

### 3. Configure Frontend
```bash
cd ../frontend
npm install
```
Create a `.env.local` file in the `frontend` folder (see Environment Variables).
```bash
npm run dev
```
*Frontend runs on http://localhost:3000*

## ⚙️ Environment Variables

### Backend (`backend/.env`)

```env
DATABASE_URL="file:./dev.db"
JWT_ACCESS_SECRET="your_secure_access_secret_key"
JWT_REFRESH_SECRET="your_secure_refresh_secret_key"
PORT=5000
FRONTEND_URL="http://localhost:3000"
```

### Frontend (`frontend/.env.local`)

```env
NEXT_PUBLIC_API_URL="http://localhost:5000/api"
```

## 🗄️ Database Schema

### User
- `id` (String, Primary Key)
- `email` (String, Unique)
- `password` (String, Hashed)
- `createdAt` (DateTime)

### Task
- `id` (String, Primary Key)
- `title` (String)
- `description` (String, Optional)
- `status` (Enum: PENDING, IN_PROGRESS, COMPLETED)
- `priority` (Enum: LOW, MEDIUM, HIGH)
- `dueDate` (DateTime, Optional)
- `userId` (String, Foreign Key)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/refresh` | Refresh access token |
| POST | `/api/auth/logout` | Logout user |

### Tasks (Protected - requires JWT)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | `/api/tasks` | Get all tasks (Supports pagination, search, filter) |
| POST | `/api/tasks` | Create a new task |
| GET | `/api/tasks/:id` | Get task by ID |
| PATCH | `/api/tasks/:id` | Update a task |
| DELETE| `/api/tasks/:id` | Delete a task |

## 🔐 Authentication Flow

1. User logs in with email and password.
2. Backend validates credentials using bcrypt.
3. Backend generates:
   - **Access Token** (Short-lived: 15 min)
   - **Refresh Token** (Long-lived: 7 days) stored securely in `httpOnly` cookies.
4. The frontend stores the access token and attaches it to Authorization headers for protected API requests.
5. If the access token expires, an Axios interceptor automatically catches the `401 Unauthorized` error.
6. The interceptor calls the `/auth/refresh` endpoint silently, receives a new access token, and retries the original failed request without interrupting the user.

## 🔒 Security Features
- **Stateless JWT Authentication** with short-lived tokens.
- **Refresh Token Rotation** mechanisms.
- **bcrypt Hashing** for passwords (12 salt rounds).
- **CORS Configuration** strictly allowing the frontend domain.
- **Validation** protecting database schema queries and requests.

## 🎨 Frontend Features
- **Premium UI/UX:** Sleek dark mode, colorful badges, and smooth hover micro-interactions (`translateY`).
- **Real-time Feedback:** Toast notifications (`react-hot-toast`) and custom modal animations (`scaleIn`).
- **Advanced Data Handling:** Smart search debounce, status parsing, and pagination handling.
- **Skeleton Loading States:** Professional loading skeleton blocks replacing generic spinners.

## ✨ Key Features

- Full authentication system (JWT + refresh tokens)
- Complete CRUD operations for tasks
- Pagination, search, filtering, sorting
- Secure API with middleware protection
- Professional SaaS dashboard UI
- RESTful API architecture
- Scalable folder structure
- Token auto-refresh handling

## 🚀 Deployment

### Frontend
Can be deployed on:
- Vercel (recommended)
- Netlify

### Backend
Can be deployed on:
- Render
- Railway
- VPS (DigitalOcean, AWS)

### Database
- SQLite locally or PostgreSQL/MySQL via Prisma.

## 👨‍💻 Author

**Sonu Gupta**

GitHub: [https://github.com/Guptsonu22](https://github.com/Guptsonu22)  
Email:sonugupta411093@gmail.com

## 📄 License

This project is licensed under the MIT License.
