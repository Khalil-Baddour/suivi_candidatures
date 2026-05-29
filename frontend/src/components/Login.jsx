import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import '../assets/styleAuth.css';
import { BsStars } from "react-icons/bs";
import { HiOutlineClipboardList, HiOutlineCalendar, HiOutlineChartBar } from "react-icons/hi";

const API_URL = import.meta.env.VITE_API_URL;

export default function Login({ onSwitch, onForgot }) {
  const { login } = useAuth();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({ email: "", password: "" });
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
          email: formData.email,
          password: formData.password
        })
      });
      const data = await response.json();
      if (response.ok) {
        login(data.access);
      } else {
        setError(t('login.error_credentials'));
      }
    } catch {
      setError(t('common.error_server'));
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
          {t('login.badge')}
        </div>
        <h1 className="login-hero__title">
          {t('login.hero_title_part1')}<em>{t('login.hero_title_em')}</em>
        </h1>
        <p className="login-hero__desc">
          {t('login.hero_desc')}
        </p>
        <div className="login-hero__features">
          <div className="login-feature">
            <span className="login-feature__icon">
              <HiOutlineClipboardList size={20} color="var(--blue)" />
            </span>
            <span>{t('login.feature_1')}</span>
          </div>
          <div className="login-feature">
            <span className="login-feature__icon">
              <HiOutlineCalendar size={20} color="var(--blue)" />
            </span>
            <span>{t('login.feature_2')}</span>
          </div>
          <div className="login-feature">
            <span className="login-feature__icon">
              <HiOutlineChartBar size={20} color="var(--blue)" />
            </span>
            <span>{t('login.feature_3')}</span>
          </div>
        </div>
      </div>

      {/* ── FORMULAIRE ── */}
      <div className="login-container">
        <form onSubmit={handleLogin} className="login-form">
          <div>
            <h2>{t('login.form_title')}</h2>
            <p style={{ marginTop: "8px" }}>{t('login.form_subtitle')}</p>
          </div>

          {error && <p className="error-message">{error}</p>}

          <div className="input-group">
            <input
              name="email"
              type="email"
              placeholder={t('login.email_placeholder')}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>
          <div className="input-group">
            <input
              name="password"
              type="password"
              placeholder={t('login.password_placeholder')}
              onChange={handleChange}
              autoComplete="current-password"
              required
            />
          </div>

          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? t('login.submit_loading') : t('login.submit')}
          </button>

          <div className="login-footer">
            <p>
              <a href="#" onClick={(e) => { e.preventDefault(); onForgot(); }}>
                {t('login.forgot_password')}
              </a>
            </p>
            <p>
              {t('login.no_account')}
              <button type="button" className="btn-link" onClick={onSwitch}>
                {t('login.create_account')}
              </button>
            </p>
          </div>
        </form>
      </div>

    </div>
  );
}
