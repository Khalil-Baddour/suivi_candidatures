import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

import '../assets/styleAuth.css'


export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) navigate("/");
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    setLoading(true); setError("");
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/password-forgot/confirm/`,
        {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({ token, password }),
        }
      );
      if (!res.ok) {
        const data = await res.json();
        setError(data?.detail ||
          "Lien invalide ou expiré.");
        return;
      }
      setSuccess(true);
      setTimeout(() => navigate("/"), 3000);
    } catch {
      setError("Erreur réseau, réessayez.");
    } finally {
      setLoading(false);
    }
  };

  if (success) return (
    <div className="login-container">
      <div className="login-form">
        <div className="auth-success-icon">✓</div>  
        <h2>Mot de passe mis à jour</h2>
        <p className="success-message">
          Votre mot de passe a bien été modifié. Vous allez être redirigé vers la connexion...
        </p>
      </div>
    </div>
  );

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form" autoComplete="off" >
        <h2>Nouveau mot de passe</h2>

        {/* erreur inline */}
        {error && <p className="error-message">{error}</p>}

        <input
          type="password"
          placeholder="Nouveau mot de passe"
          value={password}
          onChange={(e) => { setPassword(e.target.value); setError(""); }}
          autoComplete="new-password"
          minLength={8}
          required
        />
        <input
          type="password"
          placeholder="Confirmer le mot de passe"
          value={confirm}
          onChange={(e) => { setConfirm(e.target.value); setError(""); }}
          autoComplete="new-password"
          required
        />
        <button type="submit" className="btn-login" disabled={loading}>
          {loading ? "Enregistrement..." : "Réinitialiser"}
        </button>
      </form>
    </div>
  );
}