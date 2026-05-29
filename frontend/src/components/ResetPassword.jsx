import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import '../assets/styleAuth.css'


export default function ResetPassword() {
  const { t } = useLanguage();
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
      setError(t('reset_password.error_password_match'));
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
        setError(data?.detail || t('reset_password.error_link_expired'));
        return;
      }
      setSuccess(true);
      setTimeout(() => navigate("/"), 3000);
    } catch {
      setError(t('reset_password.error_network'));
    } finally {
      setLoading(false);
    }
  };

  if (success) return (
    <div className="login-container">
      <div className="login-form">
        <div className="auth-success-icon">✓</div>
        <h2>{t('reset_password.success_title')}</h2>
        <p className="success-message">{t('reset_password.success_message')}</p>
      </div>
    </div>
  );

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form" autoComplete="off">
        <h2>{t('reset_password.form_title')}</h2>

        {error && <p className="error-message">{error}</p>}

        <input
          type="password"
          placeholder={t('reset_password.new_password_placeholder')}
          value={password}
          onChange={(e) => { setPassword(e.target.value); setError(""); }}
          autoComplete="new-password"
          minLength={8}
          required
        />
        <input
          type="password"
          placeholder={t('reset_password.confirm_placeholder')}
          value={confirm}
          onChange={(e) => { setConfirm(e.target.value); setError(""); }}
          autoComplete="new-password"
          required
        />
        <button type="submit" className="btn-login" disabled={loading}>
          {loading ? t('reset_password.submit_loading') : t('reset_password.submit')}
        </button>
      </form>
    </div>
  );
}
