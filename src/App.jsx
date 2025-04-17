// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/Navbar';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected routes - requires authentication */}
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                {/* Profile component will be added later */}
                <div className="container mt-4">
                  <h1>Profile Page</h1>
                  <p>This is a protected route that only authenticated users can access.</p>
                </div>
              </ProtectedRoute>
            } 
          />
          
          {/* Add more protected routes as needed */}
          <Route 
            path="/tasks" 
            element={
              <ProtectedRoute>
                <div className="container mt-4">
                  <h1>Tasks</h1>
                  <p>Your tasks will appear here.</p>
                </div>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/habits" 
            element={
              <ProtectedRoute>
                <div className="container mt-4">
                  <h1>Habits</h1>
                  <p>Your habits will appear here.</p>
                </div>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/calendar" 
            element={
              <ProtectedRoute>
                <div className="container mt-4">
                  <h1>Calendar</h1>
                  <p>Your calendar will appear here.</p>
                </div>
              </ProtectedRoute>
            } 
          />
          
          {/* Catch-all route for 404 */}
          <Route 
            path="*" 
            element={
              <div className="container mt-4 text-center">
                <h1>404 - Page Not Found</h1>
                <p>The page you are looking for does not exist.</p>
              </div>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
