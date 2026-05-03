import { useState } from "react";


export default function ForgotPassword({ onBack }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSent(true);  // Affiche le message AVANT la requête
    setLoading(true);

    try {
      await fetch(
        `${import.meta.env.VITE_API_URL}/password-forgot/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (sent) return (
    <div className="login-container">
      <div className="login-form">
        <h2>Email envoyé ✓</h2>
        <p className="success-message">
          Si cet email existe, un lien vous
          a été envoyé. Voir votre boite mails.
        </p>
        <button className="btn-link"
          onClick={onBack}>
          Retour à la connexion
        </button>
      </div>
    </div>
  );

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}
            className="login-form">
        <h2>Récupération</h2>
        <p>Saisissez votre email.</p>
        <input type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required />
        <button type="submit"
          className="btn-login"
          disabled={loading}>
          {loading ? "Envoi..." : "Envoyer"}
        </button>
        <button type="button"
          className="btn-link"
          onClick={onBack}>
          Retour à la connexion
        </button>
      </form>
    </div>
  );
}