# 🚀 StackPeak - Full Stack Job Portal Web Application

StackPeak is a modern **Full Stack Job Portal Platform** built using **React, Spring Boot, and MySQL**.

It allows students/job seekers to explore jobs, apply for opportunities, and manage their profiles, while admins can manage companies, jobs, applicants, and users through a dedicated dashboard.

---

# 🌟 Features

## 👨‍💻 User Features

- User Registration & Login
- JWT Authentication & Authorization
- Browse Jobs with Search & Filters
- View Detailed Job Information
- Apply for Jobs
- Track Applied Job Status
- Update Profile & Resume
- Skills & Bio Management

---

## 🛠️ Admin Features

- Admin Dashboard
- Manage Companies
  - Add Company
  - Update Company
  - Delete Company
- Manage Jobs
  - Create Job
  - Update Job
  - Delete Job
- Manage Applicants
  - Shortlist Candidates
  - Reject Applications
- Manage Users & Roles

---

# 🧠 Tech Stack

## Frontend

- React.js
- Vite
- Redux Toolkit
- React Router DOM
- Axios
- CSS / Tailwind CSS

## Backend

- Spring Boot
- Spring Security
- JWT Authentication
- REST APIs
- Maven

## Database

- MySQL

---

# 📂 Project Structure

```bash
StackPeak/
│
├── frontend/          # React Frontend
│
├── backend/           # Spring Boot Backend
│
└── README.md
🔐 Authentication

The project uses JWT (JSON Web Token) based authentication for secure login and protected routes.

# 📸 Screenshots
🏠 Home Page
<img width="1920" height="1008" alt="Home Page" src="https://github.com/user-attachments/assets/96600292-144e-405a-9de5-364c45a926c0" />
🛠️ Admin Dashboard
<img width="960" height="504" alt="Admin Dashboard" src="https://github.com/user-attachments/assets/1b6bd22f-50b4-43f7-a785-dc4bb7a3fed9" />
💼 Jobs Page
<img width="960" height="504" alt="Jobs Page" src="https://github.com/user-attachments/assets/e4b3bc17-bd46-450c-a44a-9a887d2c10c6" />
👤 User Profile
<img width="1920" height="1008" alt="User Profile" src="https://github.com/user-attachments/assets/0f056ca6-d848-4ad7-9637-fb89211cf1b6" />
🔑 Login Page
<img width="1920" height="1008" alt="Login Page" src="https://github.com/user-attachments/assets/01af82a2-1cf2-4fb2-a746-cc3436500dd5" />
⚙️ Installation & Setup
1️⃣ Clone Repository
git clone https://github.com/ashusingh41537-arch/StackPeak.git
2️⃣ Frontend Setup
cd frontend
npm install
npm run dev

Frontend runs on:

http://localhost:5173
# 3️⃣ Backend Setup
cd backend

Configure application.properties

spring.datasource.url=YOUR_DATABASE_URL
spring.datasource.username=YOUR_DB_USERNAME
spring.datasource.password=YOUR_DB_PASSWORD

jwt.secret=YOUR_SECRET_KEY

Run backend:

./mvnw spring-boot:run

Backend runs on:

http://localhost:8080
🌐 API Modules
User APIs
Register
Login
Profile
Update Profile
Company APIs
Register Company
Update Company
Delete Company
Job APIs
Create Job
Update Job
Delete Job
Get Jobs
Application APIs
Apply Job
Manage Applicants
Update Status
# 🔮 Future Improvements
Email Notifications
Real-Time Chat
Resume Analyzer
AI Job Recommendation
Admin Analytics Dashboard
Dark Mode UI
Pagination & Advanced Filters
# 👨‍🎓 Author
Akshay Pratap Singh
BCA Final Year Student
Java Full Stack Developer
