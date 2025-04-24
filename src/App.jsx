// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail'; // Import the new VerifyEmail page
import ForgotPassword from './pages/ForgotPassword'; // Import the ForgotPassword page
import ResetPassword from './pages/ResetPassword'; // Import the ResetPassword page
import Navbar from './components/Navbar';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Notes from './pages/Notes';
import Tasks from './pages/Tasks';
import './index.css';
import NotificationsPage from './pages/NotificationsPage';
import ThemeToggleButton from './components/ThemeToggle';
import AddCollection from './pages/AddCollection';
import CollectionsList from './pages/CollectionsList';
import Profile from './pages/Profile'; // Import the new Profile component
import SharedCollectionList from './pages/SharedCollectionList'; 
function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/notifications" element={<NotificationsPage />} />

          {/* Protected routes - requires authentication */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Add more protected routes as needed */}
          <Route
            path="/tasks"
            element={
              <ProtectedRoute>
                <Tasks />
              </ProtectedRoute>
            }
          />
          <Route
            path="/addcollections"
            element={
              <ProtectedRoute>
                <AddCollection />
              </ProtectedRoute>
            }
          />
          <Route
            path="/viewcollections"
            element={
              <ProtectedRoute>
                <CollectionsList />
              </ProtectedRoute>
            }
          />
          {/* <Route
            path="/shared-page/:token"
            element={
              <ProtectedRoute>
                <SharedPage />
              </ProtectedRoute>
            }
          /> */}

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
            path="/shared-collections"
            element={
              <ProtectedRoute>
                <SharedCollectionList />
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
