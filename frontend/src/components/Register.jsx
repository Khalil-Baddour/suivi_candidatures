import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import '../assets/styleAuth.css'

const API_URL = import.meta.env.VITE_API_URL

export default function Register({ onSwitch }) {
  const { t } = useLanguage();
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
    setError("");
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError(t('register.error_password_match'));
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
        setError(errorData.detail || t('register.error_register'));
      }
    } catch {
      setError(t('common.error_server'));
    } finally {
      setLoading(false);
    }
  };

  if (success) return (
    <div className="login-container">
      <div className="login-form">
        <div className="auth-success-icon">✓</div>
        <h2>{t('register.success_title')}</h2>
        <p className="success-message">{t('register.success_message')}</p>
        <button className="btn-login" onClick={onSwitch}>
          {t('register.login_link')}
        </button>
      </div>
    </div>
  );

  return (
    <div className="login-container">
      <form onSubmit={handleRegister} className="login-form">
        <h2>{t('register.form_title')}</h2>

        {error && <p className="error-message">{error}</p>}

        <input
          name="username"
          type="text"
          placeholder={t('register.username_placeholder')}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder={t('register.email_placeholder')}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder={t('register.password_placeholder')}
          onChange={handleChange}
          required
        />
        <input
          name="confirmPassword"
          type="password"
          placeholder={t('register.confirm_placeholder')}
          onChange={handleChange}
          required
        />

        <button type="submit" className="btn-login" disabled={loading}>
          {loading ? t('register.submit_loading') : t('register.submit')}
        </button>

        <div className="login-footer">
          <p>
            {t('register.has_account')}
            <button type="button" className="btn-link" onClick={onSwitch}>
              {t('register.login_link')}
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}
