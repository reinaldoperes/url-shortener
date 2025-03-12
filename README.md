# URL Shortener

This project is a **URL shortening service** built with **Node.js, Express, MongoDB**, and a **React + Vite frontend**. Users can create shortened URLs, track clicks, and manage their links via authentication.

## Features

✅ User authentication (register/login)\
✅ Shorten URLs with optional custom slugs\
✅ Track visits to shortened URLs\
✅ View all created URLs\
✅ Edit or delete shortened URLs\
✅ Set expiration time for shortened URLs\
✅ Rate-limiting to prevent abuse\
✅ Fully responsive frontend using **Material UI**\
✅ API documentation with **Swagger**

---

## 🚀 Getting Started

Fist of all, there's a copy of the .env file in each project. Just remove the *"copy"* from the name.

You can run the project using **Docker (recommended)** or **manually**.

### 1️⃣ Running with Docker (Recommended)

Ensure you have **Docker** and **Docker Compose** installed.

```
docker-compose up --build
```

- The **backend** will run on: `http://localhost:5000`
- The **frontend** will run on: `http://localhost:3000`
- **Swagger API Docs**: `http://localhost:5000/docs`

### 2️⃣ Running Manually

#### Backend Setup

```
cd backend
yarn install
yarn dev
```

#### Frontend Setup

```
cd frontend
yarn install
yarn dev
```

---

## 🔗 API Documentation

### 🔥 Swagger UI

Once the backend is running, access **Swagger** at:

📌 [**http://localhost:5000/docs**](http://localhost:5000/docs)

### 🔒 Authentication

Some endpoints require **authentication**. After logging in, include your **JWT token** in requests:

```
Authorization: Bearer YOUR_TOKEN_HERE
```

---

## 📂 Project Structure

```
.
├── backend
│   ├── Dockerfile
│   ├── src
│   │   ├── app.ts
│   │   ├── server.ts
│   │   ├── application (use cases)
│   │   ├── infrastructure (database/repositories)
│   │   ├── presentation (routes/controllers/middleware)
│   │   ├── types (TypeScript typings)
│   ├── tsconfig.json
│   ├── package.json
│   ├── yarn.lock
│   ├── dist (build folder)
├── frontend
│   ├── Dockerfile
│   ├── src
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   ├── api (API calls)
│   │   ├── components (UI components)
│   │   ├── context (Auth & state management)
│   │   ├── hooks (custom React hooks)
│   │   ├── pages (React pages)
│   ├── tsconfig.json
│   ├── package.json
│   ├── yarn.lock
├── docker-compose.yml
```

---

## 🚀 Future Improvements

- ✅ **Unit and integration tests** for both backend & frontend
- ✅ **Enhance API security** with better validation & authentication
- ✅ **Improve error handling** across the application
- ✅ **Optimize MongoDB queries** for better performance
- ✅ **Add bulk URL shortening** for power users
