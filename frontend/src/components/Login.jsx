import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import '../assets/styleAuth.css';
import { BsStars } from "react-icons/bs";
import { HiOutlineClipboardList, HiOutlineCalendar, HiOutlineChartBar } from "react-icons/hi";

const API_URL = import.meta.env.VITE_API_URL;

export default function Login({ onSwitch, onForgot }) {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
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
    <div className="login-page">

      {/* ── HERO ── */}
      <div className="login-hero">
        <div className="login-hero__badge">
          <BsStars size={13} />
          Suivi de candidatures
        </div>
        <h1 className="login-hero__title">
          Bienvenue dans <em>Suivre mes candidatures</em>
        </h1>
        <p className="login-hero__desc">
          Centralisez et pilotez toutes vos candidatures en un seul endroit.
          Suivez chaque étape — envoi du CV, relance, prépation de l'entretien... —,
          gardez un œil sur vos relances et ne laissez plus aucune opportunité
          vous échapper.
        </p>
        <div className="login-hero__features">
          <div className="login-feature">
            <span className="login-feature__icon">
              <HiOutlineClipboardList size={20} color="var(--blue)" />
            </span>
            <span>Répertoriez et organisez vos candidatures</span>
          </div>
          <div className="login-feature">
            <span className="login-feature__icon">
              <HiOutlineCalendar size={20} color="var(--blue)" />
            </span>
            <span>Suivez vos relances et échéances</span>
          </div>
          <div className="login-feature">
            <span className="login-feature__icon">
              <HiOutlineChartBar size={20} color="var(--blue)" />
            </span>
            <span>Visualisez votre progression</span>
          </div>
        </div>
      </div>

      {/* ── FORMULAIRE ── */}
      <div className="login-container">
        <form onSubmit={handleLogin} className="login-form">
          <div>
            <h2>Connexion</h2>
            <p style={{ marginTop: "8px" }}>Accédez à votre espace personnel.</p>
          </div>

          {error && <p className="error-message">{error}</p>}

          <div className="input-group">
            <input
              name="username"
              type="text"
              placeholder="Nom d'utilisateur"
              onChange={handleChange}
              autoComplete="username"
              required
            />
          </div>
          <div className="input-group">
            <input
              name="password"
              type="password"
              placeholder="Mot de passe"
              onChange={handleChange}
              autoComplete="current-password"
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
            <p>
              Pas encore de compte ?
              <button type="button" className="btn-link" onClick={onSwitch}>
                Créer un compte
              </button>
            </p>
          </div>
        </form>
      </div>

    </div>
  );
}