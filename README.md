🚀 StackPeak - Full Stack Job Portal Web Application

StackPeak is a modern Full Stack Job Portal Platform built using React, Spring Boot, and MySQL.
It allows students/job seekers to explore jobs, apply for opportunities, and manage their profiles, while admins can manage companies, jobs, applicants, and users through a dedicated dashboard.

🌟 Features

👨‍💻 User Features

✅ User Registration & Login
🔐 JWT Authentication & Authorization
🔍 Browse Jobs with Search & Filters
📄 View Detailed Job Information
📨 Apply for Jobs
📊 Track Applied Job Status
👤 Update Profile & Resume
🧠 Skills & Bio Management

🛠️ Admin Features

📊 Admin Dashboard
🏢 Manage Companies

Add Company
Update Company
Delete Company


💼 Manage Jobs

Create Job
Update Job
Delete Job


👥 Manage Applicants

Shortlist Candidates
Reject Applications


🔑 Manage Users & Roles


🧠 Tech Stack

Frontend

TechnologyPurposeReact.jsUI FrameworkViteBuild ToolRedux ToolkitState ManagementReact Router DOMClient-side RoutingAxiosHTTP RequestsCSS / Tailwind CSSStyling

Backend

TechnologyPurposeSpring BootBackend FrameworkSpring SecuritySecurity LayerJWT AuthenticationSecure AuthREST APIsAPI ArchitectureMavenBuild Tool

Database

TechnologyPurposeMySQLRelational Database

🔐 Authentication

The project uses JWT (JSON Web Token) based authentication for secure login and protected routes.

On login, server returns a JWT token
Token is stored in client (localStorage / Redux state)
Every protected API request sends Authorization: Bearer <token> header
Spring Security validates token on every request


📸 Screenshots

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

bashgit clone https://github.com/ashusingh41537-arch/StackPeak.git
cd StackPeak

2️⃣ Frontend Setup

bashcd frontend

npm install
npm run dev
Frontend runs on: http://localhost:5173

3️⃣ Backend Setup

bashcd backend

Configure src/main/resources/application.properties:
propertiesspring.datasource.url=YOUR_DATABASE_URL
spring.datasource.username=YOUR_DB_USERNAME
spring.datasource.password=YOUR_DB_PASSWORD

jwt.secret=YOUR_SECRET_KEY
Run backend:
bash./mvnw spring-boot:run
Backend runs on: http://localhost:8080

🌐 API Modules

👤 User APIs

EndpointMethodDescription/api/auth/registerPOSTRegister new user/api/auth/loginPOSTLogin & get JWT token/api/user/profileGETGet user profile/api/user/updatePUTUpdate profile

🏢 Company APIs

EndpointMethodDescription/api/company/registerPOSTAdd new company/api/company/update/{id}PUTUpdate company/api/company/delete/{id}DELETEDelete company

💼 Job APIs

EndpointMethodDescription/api/job/createPOSTCreate job/api/job/update/{id}PUTUpdate job/api/job/delete/{id}DELETEDelete job/api/job/allGETGet all jobs

📨 Application APIs

EndpointMethodDescription/api/application/applyPOSTApply for job/api/application/manageGETManage applicants/api/application/statusPUTUpdate status

🔮 Future Improvements

 📧 Email Notifications
 💬 Real-Time Chat
 📄 Resume Analyzer
 🤖 AI Job Recommendation
 📊 Admin Analytics Dashboard
 🌙 Dark Mode UI
 📑 Pagination & Advanced Filters


🎨 Color Palette

NameHexBackground#0d1b2e (Deep Navy)Primary Accent#00e5a0 (Electric Green)Purple Accent#7b6ef6Amber Accent#f59e0bText Primary#ffffffText Mutedrgba(255,255,255,0.45)

👨‍🎓 Author

Akshay Pratap Singh

🎓 BCA Final Year Student
💻 Java Full Stack Developer
🐙 GitHub: @ashusingh41537-arch


📝 License

This project is open source and available under the MIT License.


Made with ❤️ by Akshay Pratap Singh
