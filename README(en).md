
---

#### 🇬🇧 README.en.md

```markdown
# HomeFlix

**HomeFlix** is a self-hosted media management platform designed for personal and family use. It allows you to organize, play, and manage your own library of movies and TV series through a modern and intuitive interface.

## ✨ Key Features

- **Privacy**: No authentication, local data, offline-first.
- **Performance**: Fast scanning, optimized streaming, instant search.
- **Modularity**: Independent and replaceable module architecture.
- **Scalability**: Support for thousands of movies, TV series, and personal videos.

## 🛠️ Technologies Used

### Backend
- **NestJS** (10.x) - Backend framework (TypeScript)
- **Prisma** (5.x) - ORM for PostgreSQL
- **PostgreSQL** (15.x) - Main database
- **WebSocket** (Socket.IO) - Real-time notifications
- **Axios** - HTTP requests to TMDB
- **TypeScript** (5.x) - Type safety
- **Multer** - File upload (collection images)

### Frontend
- **React** (18+) - UI framework
- **TypeScript** (5.x) - Type safety
- **Vite** (8.x) - Build tool
- **Tailwind CSS** (4.x) - Styling (dark theme)
- **React Router** (v6) - Routing
- **React Query** (5.x) - API management and caching
- **Zustand** (4.x) - Global state management
- **Video.js** (8.x) - Video player (with quality plugin)
- **Socket.IO Client** (4.x) - Real-time notifications
- **React Hook Form** (7.x) - Form management

## 📋 Prerequisites

Before you can run the application, you need to install the following software:

1.  **Node.js** (version 18 or higher) - [Download Node.js](https://nodejs.org/)
2.  **PostgreSQL** (version 15 or higher) - [Download PostgreSQL](https://www.postgresql.org/download/)
3.  **Git** (optional, but recommended for cloning the repository) - [Download Git](https://git-scm.com/)

> **⚠️ Important Note on Dependencies**
> This repository **does not include** the `node_modules` folders (the project dependencies). This is intentional to keep the repository lightweight and avoid compatibility issues. Before running the application, **you must install all dependencies** by running the `npm install` command in both the `backend` and `frontend` folders, as described below. Without this step, the application will not work.

## 🚀 Getting Started

Follow these steps to run the application on your computer.

### 1. Clone the repository (or download the ZIP)

```bash
git clone https://github.com/astronautdevelop/homeflix.git
cd homeflix
