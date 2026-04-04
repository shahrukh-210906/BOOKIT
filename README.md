# 📅 BookIt: Advanced Academic Scheduling Platform

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

**BookIt** is a comprehensive, full-stack application engineered to optimize the appointment booking lifecycle between students and faculty members. Built with modern web technologies, it features secure role-based access, real-time schedule synchronization, and advanced image-processing capabilities.

---

## ✨ Key Features

* **👥 Role-Based Architecture:** Dedicated, secure dashboards tailored specifically for `faculty` and `student` workflows.
* **⚡ Real-Time Data Synchronization:** Implements intelligent AJAX polling to ensure schedules and appointment slots are constantly up-to-date without manual page refreshes.
* **🔐 Enterprise-Grade Security:** Utilizes robust session management with `express-session` and authentication strategies via `Passport.js` (Local), backed by `bcryptjs` for secure password hashing.
* **📱 QR Code Integration:** Built-in utilities for generating and scanning QR codes, facilitating frictionless check-ins and quick profile sharing.
* **🔍 Optical Character Recognition (OCR):** Integrates Tesseract.js for intelligent image-to-text processing, allowing automated data extraction from uploaded documents or IDs.

---

## 🛠️ Technology Stack

### **Frontend (Client)**
* ⚛️ **React 18:** Core UI library for building dynamic, reactive components.
* ⚡ **Vite:** Next-generation frontend tooling for lightning-fast HMR and optimized builds.
* 🌊 **Tailwind CSS:** Utility-first CSS framework for rapid, responsive styling.
* 🌐 **Axios:** Promise-based HTTP client for seamless backend communication.
* 📸 **HTML5-QRCode & QRCode.React:** Libraries for robust QR code generation and live camera scanning.
* 👁️ **Tesseract.js:** Pure Javascript OCR for client-side text recognition.
* ✨ **Lucide React:** Beautiful, consistent iconography.

### **Backend (Server)**
* 🟢 **Node.js:** JavaScript runtime environment executing the backend logic.
* 🚂 **Express.js:** Fast, unopinionated web framework for building robust RESTful APIs.
* 🍃 **MongoDB & Mongoose:** NoSQL database paired with elegant object modeling for structured data storage.
* 🎫 **Passport.js:** Highly flexible authentication middleware.
* 🛡️ **Bcryptjs:** Library to help hash passwords for secure database storage.

---

## 📂 Project Structure

```text
bookit/
├── server/                     # 🟢 Node.js Backend 
│   ├── config/                 # Database (db.js) & Environment Configurations
│   ├── controllers/            # Business logic (Auth, Users, Appointments, Schedules)
│   ├── middleware/             # Route protection and authentication checks
│   ├── models/                 # Mongoose Data Schemas
│   ├── routes/                 # Express API Endpoints (apiRoutes, authRoutes)
│   ├── server.js               # Application entry point
│   └── package.json            
├── src/                        # ⚛️ React Frontend
│   ├── components/             # Reusable UI (Navbar, Sidebar, Modals, Forms)
│   │   ├── faculty/            # Faculty-specific UI components
│   │   ├── student/            # Student-specific UI components
│   │   └── layout/             # Structural components
│   ├── pages/                  # Top-level route components (Login, Dashboards)
│   ├── services/               # API abstraction layer (api.js)
│   ├── App.jsx                 # Root component & state management
│   ├── index.css               # Global Tailwind directives
│   └── main.jsx                # React DOM injection
├── package.json                
└── vite.config.js
