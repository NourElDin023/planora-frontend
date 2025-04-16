# Life Tracker – Frontend (React + Vite)

The frontend for **Life Tracker**, a productivity web application designed to help users build better habits, manage tasks efficiently, and collaborate in real-time. This app integrates AI features and Google Calendar for a smarter, more streamlined experience.

## 🌐 Live Preview

Coming soon...

---

## 🚀 Tech Stack

- **Framework:** React + Vite
- **Routing:** React Router DOM
- **HTTP Client:** Axios
- **Styling:** TailwindCSS (optional), CSS Modules or SCSS
- **State Management:** Context API (can scale to Redux)
- **Form Handling:** React Hook Form / Controlled Components
- **AI Integration:** Google Generative AI (via backend)
- **Calendar Sync:** Google Calendar API (via backend)

---

## 📦 Project Structure

```
src/
├── assets/             # Static files (images, logos, etc.)
├── components/         # Reusable UI components
├── pages/              # Page-level components (e.g., Home, Dashboard)
├── utils/              # Axios instance, helpers, constants
├── App.jsx             # Main application file
└── main.jsx            # React DOM root
```

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/Ayat166/Life_Tracker_Frontend.git
cd Life_Tracker_Frontend
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Run the Application

```bash
npm run dev
# or
yarn dev
```

The app should be live at `http://localhost:5173`.

---

## 🔧 Axios Configuration

All API requests are handled through a centralized Axios instance located in:

```
src/utils/axios.js
```

Sample:

```javascript
// src/utils/axios.js
import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8000/api", // Update if deployed
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;
```

---

## 🧭 Routing Setup

Routes are configured in `App.jsx` using React Router:

```jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

---

## 🧪 Sample Page: Hello World

Created inside `src/pages/Home.jsx`:

```jsx
function Home() {
  return <h1>Hello World from Life Tracker Frontend!</h1>;
}

export default Home;
```

---

## 🧠 Features Preview

- ✅ JWT Authentication with Backend
- ✅ Task & Habit Management UI
- ✅ Dark / Light Mode Toggle
- ✅ Google Calendar Integration (via backend)
- 🚧 AI Summarization & Smart Search (WIP)
- ✅ Responsive UI for mobile & desktop

---

## 📡 Backend Setup

The backend is available in this repo:  
👉 [Life Tracker Backend](https://github.com/Ayat166/Life_Tracker_Backend)

Make sure it's running on `http://localhost:8000` (or update Axios base URL).

---

