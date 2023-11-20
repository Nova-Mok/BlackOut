import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from './pages/Login/Login';
import Home from './pages/Home/home';
import Info from './pages/Info/Info';
import { AuthProvider } from "./contexts/Authcontext"; // Corrected import statement

const isAuthenticated = () => {
  const authToken = localStorage.getItem('googleAuthToken');
  return authToken != null;
};

const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <AuthProvider> {/* Using AuthProvider */}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route 
            path="/" 
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/info" 
            element={
              <PrivateRoute>
                <Info />
              </PrivateRoute>
            } 
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
