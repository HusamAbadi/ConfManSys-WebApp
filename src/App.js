import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { FirebaseProvider } from "./contexts/FirebaseContext";
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
import PasscodeEntry from "./components/PasscodeEntry";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handlePasscodeSubmit = (status) => {
    setIsAuthenticated(status);
  };

  return (
    <AuthProvider>
      <FirebaseProvider>
        <Router>
          <div className="min-h-screen bg-gray-100 text-gray-900">
            {/* {isAuthenticated ? ( */}
              <>
                <Navbar />
                <div className="container mx-auto p-4">
                  {/* <h1 className="text-3xl font-bold text-center mb-6">
                    Conference Management System
                  </h1> */}
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/conferences" element={<ConferencesPage />} />
                    <Route
                      path="/conferences/new"
                      element={<ConferenceForm />}
                    />
                    <Route
                      path="/conferences/:id"
                      element={<ConferenceDetail />}
                    />
                    <Route
                      path="/conferences/:conferenceId/sessions"
                      element={<SessionsPage />}
                    />
                    <Route path="/papers" element={<PapersPage />} />
                    <Route path="/papers/:id" element={<PaperDetail />} />
                    <Route path="/authors" element={<AuthorsPage />} />
                    {/* <Route path="/authors/:id" element={<AuthorDetail />} /> */}
                    <Route path="/keywords" element={<KeywordsPage />} />
                  </Routes>
                </div>
              </>
            {/* ) : (
              <PasscodeEntry onSubmit={handlePasscodeSubmit} />
            )} */}
          </div>
        </Router>
      </FirebaseProvider>
    </AuthProvider>
  );
};

export default App;
