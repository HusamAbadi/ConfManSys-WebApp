import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { FirebaseProvider } from "./contexts/FirebaseContext";
import { useAuth } from "./contexts/AuthContext";
import Dashboard from "./pages/Dashboard";
import ConferencesPage from "./pages/ConferencesPage";
import PapersPage from "./pages/PapersPage";
import AuthorsPage from "./pages/AuthorsPage";
import SessionsPage from "./pages/SessionsPage";
import ConferenceForm from "./components/Conference/ConferenceForm";
import ConferenceDetail from "./components/Conference/ConferenceDetail";
import Navbar from "./components/Shared/Navbar";
import PaperDetail from "./components/Paper/PaperDetail";
import KeywordsPage from "./pages/KeywordsPage";
import Reports from "./pages/Reports";
import Login from "./pages/Login";

// Protected Route wrapper component
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <FirebaseProvider>
        <Router>
          <div className="min-h-screen bg-gray-100 text-gray-900">
            <Routes>
              <Route path="/login" element={<Login />} />
              
              {/* Protected Routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Navbar />
                    <div className="container mx-auto p-4">
                      <Dashboard />
                    </div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/conferences"
                element={
                  <ProtectedRoute>
                    <Navbar />
                    <div className="container mx-auto p-4">
                      <ConferencesPage />
                    </div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/conferences/new"
                element={
                  <ProtectedRoute>
                    <Navbar />
                    <div className="container mx-auto p-4">
                      <ConferenceForm />
                    </div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/conferences/:id"
                element={
                  <ProtectedRoute>
                    <Navbar />
                    <div className="container mx-auto p-4">
                      <ConferenceDetail />
                    </div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/conferences/:conferenceId/sessions"
                element={
                  <ProtectedRoute>
                    <Navbar />
                    <div className="container mx-auto p-4">
                      <SessionsPage />
                    </div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/papers"
                element={
                  <ProtectedRoute>
                    <Navbar />
                    <div className="container mx-auto p-4">
                      <PapersPage />
                    </div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/papers/:id"
                element={
                  <ProtectedRoute>
                    <Navbar />
                    <div className="container mx-auto p-4">
                      <PaperDetail />
                    </div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/authors"
                element={
                  <ProtectedRoute>
                    <Navbar />
                    <div className="container mx-auto p-4">
                      <AuthorsPage />
                    </div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/keywords"
                element={
                  <ProtectedRoute>
                    <Navbar />
                    <div className="container mx-auto p-4">
                      <KeywordsPage />
                    </div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reports"
                element={
                  <ProtectedRoute>
                    <Navbar />
                    <div className="container mx-auto p-4">
                      <Reports />
                    </div>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </Router>
      </FirebaseProvider>
    </AuthProvider>
  );
};

export default App;
