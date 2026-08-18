# 💰 Smart Budget Tracker

A full-stack personal finance application built with **Spring Boot**, **React.js**, and **MySQL**.

![Smart Budget Tracker](https://via.placeholder.com/800x400/0a0a14/a855f7?text=Smart+Budget+Tracker)

---

## 🚀 Features

- **🔐 JWT Authentication** — Secure login/register with token-based auth
- **📊 Interactive Dashboard** — Real-time stats, area charts, pie charts
- **💸 Transaction Management** — Full CRUD with filters, search, and sorting
- **📈 Analytics & Insights** — 6-month trends, category breakdowns, savings rate
- **🎯 Budget Goals** — Set monthly limits per category, get over-budget alerts
- **🏷️ Custom Categories** — Create categories with icons and colors
- **🌙 Dark Glassmorphism UI** — Premium dark theme with purple/emerald palette

---

## 🛠️ Tech Stack

| Layer      | Technology                                     |
|------------|------------------------------------------------|
| Frontend   | React 18 + Vite, React Router, Recharts, Lucide |
| Backend    | Spring Boot 3.2, Spring Security, JWT          |
| Database   | MySQL 8 / H2 (dev), Spring Data JPA           |
| Build      | Maven 3.x (backend), npm (frontend)            |

---

## ⚡ Quick Start — Frontend Only (No Java needed)

```bash
cd frontend
npm install
npm run dev
```

Open: **http://localhost:5173**

> Login with any email + password (min 6 characters).

---

## 🖥️ Backend Setup (Requires JDK 17 + Maven)

### 1. Install Prerequisites
- [JDK 17+](https://adoptium.net/)
- [Apache Maven](https://maven.apache.org/download.cgi)

### 2. Run with H2 (no MySQL needed)
```bash
cd backend
mvn spring-boot:run
```
Backend starts on: **http://localhost:8080**
H2 Console: **http://localhost:8080/h2-console**

### 3. Switch to MySQL
Update `application.properties`:
```properties
spring.profiles.active=mysql
spring.datasource.url=jdbc:mysql://localhost:3306/budget_db
spring.datasource.username=root
spring.datasource.password=yourpassword
spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
spring.jpa.hibernate.ddl-auto=update
```

---

## 📡 REST API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login, get JWT token |

### Transactions *(JWT required)*
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/transactions` | List all transactions |
| GET | `/api/transactions/month/{year}/{month}` | Filter by month |
| POST | `/api/transactions` | Create transaction |
| PUT | `/api/transactions/{id}` | Update transaction |
| DELETE | `/api/transactions/{id}` | Delete transaction |

### Dashboard *(JWT required)*
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard/stats/{year}/{month}` | Monthly income/expense stats |
| GET | `/api/dashboard/trend` | 6-month trend data |

---

## 🗄️ Database Schema

```sql
CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at DATETIME
);

CREATE TABLE categories (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  icon VARCHAR(10),
  color VARCHAR(20),
  type ENUM('INCOME','EXPENSE') NOT NULL,
  user_id BIGINT REFERENCES users(id)
);

CREATE TABLE transactions (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  amount DECIMAL(15,2) NOT NULL,
  description VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  type ENUM('INCOME','EXPENSE') NOT NULL,
  category_id BIGINT REFERENCES categories(id),
  user_id BIGINT REFERENCES users(id),
  created_at DATETIME
);

CREATE TABLE budgets (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  limit_amount DECIMAL(15,2) NOT NULL,
  month INT NOT NULL,
  year INT NOT NULL,
  category_id BIGINT REFERENCES categories(id),
  user_id BIGINT REFERENCES users(id)
);
```

---

## 📁 Project Structure

```
smart-budget-tracker/
├── frontend/                     ← React + Vite
│   └── src/
│       ├── context/              ← AppContext, AuthContext
│       ├── data/                 ← mockData.js
│       ├── components/           ← Sidebar, ToastContainer
│       └── pages/                ← Dashboard, Transactions, Analytics, Budgets, Categories
│
└── backend/                      ← Spring Boot
    └── src/main/java/com/budget/tracker/
        ├── model/                ← User, Transaction, Category, Budget
        ├── repository/           ← JPA interfaces
        ├── controller/           ← Auth, Transaction, Dashboard
        ├── security/             ← JwtUtil, JwtAuthFilter
        ├── dto/                  ← Request/Response records
        └── config/               ← SecurityConfig
```

---

## 📸 Pages

| Page | Description |
|------|-------------|
| **Login/Register** | Auth with password strength indicator |
| **Dashboard** | Balance, income/expense cards, area chart, pie chart |
| **Transactions** | Searchable table with add/edit/delete |
| **Analytics** | Bar charts, line charts, savings rate, category breakdowns |
| **Budgets** | Progress bars with over-budget alerts |
| **Categories** | Card grid with icon/color picker |

---

## 👨‍💻 Author

Built as a full-stack portfolio project demonstrating Spring Boot REST APIs, React.js, JWT authentication, and MySQL database design.
