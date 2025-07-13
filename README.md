# 💳 REST-API Payment Dashboard

A full-stack payment management dashboard built with **React Native (Expo)** and **NestJS**, featuring secure JWT authentication, real-time metrics, user management, and transaction operations.

---

## 📦 Project Structure

REST-API/
├── client/ # React Native (Expo) frontend
├── server/ # NestJS backend
└── README.md


---

## 🚀 Features

- 🔐 JWT-based Authentication
- 📊 Dashboard with payment statistics and chart
- 🧾 Transaction listing with filters
- ➕ Add new payments
- 👥 Admin-only user management (view/add users)
- 📱 Mobile-first, responsive design

---

## 🧪 Sample Credentials

| Role  | Username | Password   |
|-------|----------|------------|
| Admin | `admin`  | `admin123` |
| User  | `demo`   | `demo123`  |

---

## 🛠️ Tech Stack

| Layer     | Technology            |
|-----------|------------------------|
| Frontend  | React Native + Expo   |
| Backend   | NestJS (Node.js)      |
| Auth      | JWT                   |
| Database  | PostgreSQL (TypeORM)  |
| Charts    | react-native-chart-kit |
| Mobile    | Expo Go               |

---

## 📲 Frontend Setup

```bash
cd client
npm install
npx expo start
