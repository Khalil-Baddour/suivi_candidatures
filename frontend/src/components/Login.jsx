import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import '../assets/styleAuth.css'

const API_URL = import.meta.env.VITE_API_URL

export default function Login({ onSwitch, onForgot }) {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError]     = useState("");   // 
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // efface l'erreur dès que l'user retape
  };

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_URL}/token/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        })
      });
      const data = await response.json();
      if (response.ok) {
        login(data.access);
      } else {
        setError("Identifiants incorrects. Vérifiez votre nom d'utilisateur et mot de passe.");
      }
    } catch {
      setError("Impossible de joindre le serveur. Réessayez.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-form">
        <h2>Connexion</h2>

        {/* Message d'erreur inline */}
        {error && <p className="error-message">{error}</p>}

        <div className="input-group">
          <input
            name="username"
            type="text"
            placeholder="Nom d'utilisateur"
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-group">
          <input
            name="password"
            type="password"
            placeholder="Mot de passe"
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn-login" disabled={loading}>
          {loading ? "Connexion..." : "Se connecter"}
        </button>

        <div className="login-footer">
          <p>
            <a href="#" onClick={(e) => { e.preventDefault(); onForgot(); }}>
              Mot de passe oublié ?
            </a>
          </p>
          <hr />
          <p>
            Pas encore de compte ?
            <button type="button" className="btn-link" onClick={onSwitch}>
              Créer un compte
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}