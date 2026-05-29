import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";

export default function ForgotPassword({ onBack }) {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSent(true);
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
        <h2>{t('forgot_password.sent_title')}</h2>
        <p className="success-message">{t('forgot_password.sent_message')}</p>
        <button className="btn-link" onClick={onBack}>
          {t('forgot_password.back_to_login')}
        </button>
      </div>
    </div>
  );

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>{t('forgot_password.form_title')}</h2>
        <p>{t('forgot_password.form_subtitle')}</p>
        <input type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required />
        <button type="submit"
          className="btn-login"
          disabled={loading}>
          {loading ? t('forgot_password.submit_loading') : t('forgot_password.submit')}
        </button>
        <button type="button"
          className="btn-link"
          onClick={onBack}>
          {t('forgot_password.back_to_login')}
        </button>
      </form>
    </div>
  );
}
