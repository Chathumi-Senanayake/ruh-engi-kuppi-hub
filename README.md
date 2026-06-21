# RUHEngiKuppiHub 🎓

## Project Title
**RUHEngiKuppiHub**: A Centralized AI-Powered Educational Resource Platform for the Faculty of Engineering, University of Ruhuna.

---

## Problem Statement
Engineering students frequently struggle to find organized, reliable, and module-specific study materials. Notes, past papers, and video tutorials ("Kuppis") are scattered across multiple platforms (WhatsApp, Google Drive, personal drives). Furthermore, understanding complex engineering concepts often requires immediate tutor feedback, which is not always accessible outside of lecture hours.

## Solution Overview
RUHEngiKuppiHub is a modern, full-stack web application designed to act as a centralized repository for engineering students. It allows authorized admins to upload, organize, and share resources categorized by Departments and Modules. Crucially, the platform integrates an AI Assistant powered by Google Gemini, capable of instantly generating module-specific study guides and acting as a 24/7 personal tutor for student questions.

---

## Architectural Diagram

```mermaid
graph TD;
    Client[Web Browser Client] -->|HTTPS Requests| Frontend;
    
    subgraph Vercel [Frontend Deployment]
        Frontend[React + Vite Frontend\n(TailwindCSS UI)]
    end

    Frontend <-->|REST API via Axios| Backend;

    subgraph Render [Backend Deployment]
        Backend[Node.js + Express Backend\n(TypeScript)]
    end

    Backend <-->|Mongoose ODR| DB[(MongoDB Atlas\nCloud Database)];
    Backend <-->|@google/genai SDK| Gemini[Google Gemini API\n(gemini-2.5-flash)];
    Backend <-->|Multer SDK| Cloudinary[Cloudinary\n(File Storage)];
```

---

## Technologies Used with Evidence

* **Frontend:**
  * **React (TypeScript):** Component-based UI rendering. Evidence: `frontend/src/pages/`, `frontend/src/components/`.
  * **TailwindCSS:** Rapid, responsive UI styling. Evidence: `frontend/tailwind.config.js`, inline classes.
  * **Vite:** Blazing fast build tool. Evidence: `frontend/vite.config.ts`.
  * **Axios:** API request handling with interceptors for JWT tokens. Evidence: `frontend/src/api.ts`.
  
* **Backend:**
  * **Node.js & Express:** REST API architecture. Evidence: `backend/src/index.ts`, `backend/src/routes/`.
  * **TypeScript:** Strict typing for API responses and models. Evidence: `backend/tsconfig.json`.
  * **Mongoose:** Object Data Modeling for MongoDB. Evidence: `backend/src/models/`.
  * **JWT (JSON Web Tokens):** Secure route authentication. Evidence: `backend/src/middleware/auth.middleware.ts`.
  * **Google GenAI SDK:** Integration with Google Gemini for AI tutoring. Evidence: `backend/src/controllers/ai.controller.ts`.

* **Cloud Services & Databases:**
  * **MongoDB Atlas:** Secure, cloud-hosted NoSQL database.
  * **Vercel:** Edge network frontend hosting.
  * **Render.com:** Node.js backend hosting.
  * **Cloudinary:** Secure blob storage for uploaded student resources.

---

## Key Features
1. **Centralized Resource Hub:** Seamlessly browse resources by Department and specific Module codes.
2. **Categorized Uploads:** Resources are separated into distinct tabs: *Kuppis, Past Papers, Assignments, and Quizzes*.
3. **AI Study Assistant:** Automatically generate markdown-formatted study guides using Google Gemini.
4. **Context-Aware AI Tutor:** Chat instantly with an AI bot that understands the specific engineering module you are studying.
5. **Admin Access Control:** Secure JWT authentication ensuring only verified users can upload or delete files.
6. **Cloud File Storage:** Native integration with Cloudinary for safe, persistent file uploads.

---

## Deployment URL

**Live Web Application:** [http://ruh-engi-kuppi-hub.vercel.app]

*(Note: The backend is hosted on the Render Free Tier. It may take 30-50 seconds for the server to spin up when accessing the site for the first time).*
