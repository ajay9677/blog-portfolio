
import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";

import { onAuthStateChanged } from "firebase/auth";
import auth from "./config/firebase";

import Home from "./components/Home";
import Blogs from "./components/Blogs";
import Navbar from "./components/common/Navbar";
import Login from "./components/Login";
import Signup from "./components/Signup";
import About from "./components/About";
import Contact from "./components/Contact";

// Protect pages until user logs in
function ProtectedRoute({ user, loading, children }) {
  const location = useLocation();

  if (loading) {
    return <p className="text-center mt-10">Checking login...</p>;
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  return children;
}

function AppContent() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {!loading && user && <Navbar />}

      <div className="px-4 sm:px-6 lg:px-10">
        <Routes>
          {/* Login and Signup pages */}
          <Route
            path="/login"
            element={
              loading ? (
                <p className="text-center mt-10">Loading...</p>
              ) : user ? (
                <Navigate to="/home" replace />
              ) : (
                <Login />
              )
            }
          />

          <Route
            path="/signup"
            element={
              loading ? (
                <p className="text-center mt-10">Loading...</p>
              ) : user ? (
                <Navigate to="/home" replace />
              ) : (
                <Signup />
              )
            }
          />

          {/* Protected pages */}
          <Route
            path="/home"
            element={
              <ProtectedRoute user={user} loading={loading}>
                <Home />
              </ProtectedRoute>
            }
          />

          <Route
            path="/blogs"
            element={
              <ProtectedRoute user={user} loading={loading}>
                <Blogs />
              </ProtectedRoute>
            }
          />

          <Route
            path="/about"
            element={
              <ProtectedRoute user={user} loading={loading}>
                <About />
              </ProtectedRoute>
            }
          />

          <Route
            path="/contact"
            element={
              <ProtectedRoute user={user} loading={loading}>
                <Contact />
              </ProtectedRoute>
            }
          />

          {/* Default page */}
          <Route
            path="/"
            element={
              <Navigate
                to={loading ? "/login" : user ? "/home" : "/login"}
                replace
              />
            }
          />

          {/* Unknown URLs */}
          <Route
            path="*"
            element={
              <Navigate
                to={loading ? "/login" : user ? "/home" : "/login"}
                replace
              />
            }
          />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
