# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


# React Application

A responsive React frontend APP scaffolded with Vite, of Student management system

---

## Tech Stack

- **Framework:** React
- **Build Tool:** Vite
- **Routing:** React Router (`react-router-dom`)
- **HTTP Client:** Axios
- **Styling:** Responsive Pure CSS (Mobile-first layout)

---

## Getting Started

Follow these steps to run the project locally.

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed (version 18 or higher recommended).

### 1. Clone the repository

```bash
git clone https://github.com/INES-Capstone-Project/alpha-frontend-student-management.git
cd <your-project-folder>


### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
The development server proxies API requests to the backend origin configured here.

Copy the sample environment file to create your own `.env` file:
Open `.env` and verify or update the backend origin:
```env
VITE_API_BASE_URL=https://alpha-backend-student-management.onrender.com
```

### 4. Run the Development Server
Start the local Vite development server:
```bash
npm run dev
```
Open your browser and navigate to the local URL displayed in the terminal (usually `http://localhost:5173`).

---

## Available Scripts

* **`npm run dev`** – Starts the development server with Hot Module Replacement (HMR).
* **`npm run build`** – Compiles and bundles the application for production inside the `dist/` folder.
* **`npm run preview`** – Locally previews the production build.

---

## Project Structure

```text
├── src/
│   ├── assets/                #Static files like Images, (You will have to import them before using them)
│   ├── api/
│   │   └── client.js        # Centralized Axios instance pointing to VITE_API_BASE_URL
│   ├── components/         #for reusable components , we will be creating folders for related components to make more organized
│   ├── Layouts/
│   │   ├── MainLayout.css         # The mainLayout css file
│   │   └── MainLayout.jsx        # Main layout containing the static components and the outlet for the page components
│   ├── pages/
│   │   ├── AddStudent.jsx         # AddStudent page component
│   │   └── Home.jsx        # Home page component. This will be containing all pages 
│   ├── router.jsx              # Router definitions and route hierarchy
│   ├── main.jsx             # React DOM entry point
│   └── index.css            # Global CSS styles
├── .env.example             # Template for required environment variables
├── .env                     # Local environment variables (ignored by Git)
├── package.json             # Dependencies and project scripts
└── README.md                # Project documentation and setup guide
```

## API Requests

All backend requests use the shared Axios client in `src/api/client.js`. It sends requests to `/api/students`; Vite proxies that path to the origin in `VITE_API_BASE_URL`. For local development, set it to `http://localhost:3000`.

#### Here are some examples

```javascript
import apiClient from './api/client';

// GET: calls /api/students
const response = await apiClient.get('/');

// POST: calls /api/students with a student payload
const response = await apiClient.post('/', student);

```