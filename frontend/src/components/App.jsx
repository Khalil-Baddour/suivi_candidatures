import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import ShowApplications from "./Home";
import Details from "./detailCandidature";
import Login from "./Login";
import Register from "./Register";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";

function AuthWrapper() {
  const [authView, setAuthView] = useState("login");

  return (
    <div className="auth-wrapper">
      {authView === "register" && (
        <Register onSwitch={() => setAuthView("login")} />
      )}
      {authView === "forgot" && (
        <ForgotPassword onBack={() => setAuthView("login")} />
      )}
      {authView === "login" && (
        <Login
          onSwitch={() => setAuthView("register")}
          onForgot={() => setAuthView("forgot")}
        />
      )}
    </div>
  );
}

function ProtectedApp() {
  const [selectedApplication, setSelectedApplication] = useState(null);

  return (
    <div className="app-container">
      {selectedApplication ? (
        <Details
          candidature={selectedApplication}
          onBack={() => setSelectedApplication(null)}
          onDeleteSuccess={() => setSelectedApplication(null)}
          onModifySuccess={(updatedData) => setSelectedApplication(updatedData)}
        />
      ) : (
        <ShowApplications onSelectApplication={setSelectedApplication} />
      )}
    </div>
  );
}

export default function App() {
  const { isAuthenticated } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        {/* Cette route est interceptée AVANT le check auth */}
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Toutes les autres routes passent par le check auth */}
        <Route
          path="*"
          element={isAuthenticated ? <ProtectedApp /> : <AuthWrapper />}
        />
      </Routes>
    </BrowserRouter>
  );
}