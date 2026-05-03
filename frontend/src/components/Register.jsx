import { useState } from "react";
import '../assets/styleAuth.css'

const API_URL = import.meta.env.VITE_API_URL

export default function Register({ onSwitch }) { 
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // efface l'erreur dès que l'user retape
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/register/`, {  
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password
        })
      });

      if (response.ok) {
        setSuccess(true);
      } else {
        const errorData = await response.json();
        setError(errorData.detail || "Erreur lors de l'inscription, réessayez.");
      }
    } catch {
      setError("Impossible de joindre le serveur. Réessayez.");
    } finally {
      setLoading(false);
    }
  };

  // Écran de succès
  if (success) return (
    <div className="login-container">
      <div className="login-form">
        <div className="auth-success-icon">✓</div>
        <h2>Compte créé !</h2>
        <p className="success-message">
          Votre compte a bien été créé. Vous pouvez maintenant vous connecter.
        </p>
        <button className="btn-login" onClick={onSwitch}>
          Se connecter
        </button>
      </div>
    </div>
  );

  return (
    <div className="login-container">
      <form onSubmit={handleRegister} className="login-form">
        <h2>Créer un compte</h2>

        {/* Message d'erreur inline */}
        {error && <p className="error-message">{error}</p>}

        <input
          name="username"
          type="text"
          placeholder="Nom d'utilisateur"
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Adresse email"
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Mot de passe"
          onChange={handleChange}
          required
        />
        <input
          name="confirmPassword"
          type="password"
          placeholder="Confirmer le mot de passe"
          onChange={handleChange}
          required
        />

        <button type="submit" className="btn-login" disabled={loading}>
          {loading ? "Inscription..." : "S'inscrire"}
        </button>

        <div className="login-footer">
          <p>
            Déjà un compte ?
            <button type="button" className="btn-link" onClick={onSwitch}>
              Se connecter
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}