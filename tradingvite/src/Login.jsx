import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  // If Home sent us here with { state: { mode: 'register' } }, open that tab immediately.
  // Otherwise default to "login".
  const initialMode = location.state?.mode === "register" ? "register" : "login";

  const [mode,    setMode]    = useState(initialMode);
  const [form,    setForm]    = useState({ email: "", password: "", name: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    setError("");

    if (mode === "register" && form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/");
    }, 1500);
  };

  const switchMode = (next) => {
    setMode(next);
    setError("");
  };

  return (
    <div className="auth-root">
      {/* Background effects */}
      <div className="auth-bg">
        <div className="auth-orb auth-orb-1" />
        <div className="auth-orb auth-orb-2" />
        <div className="auth-grid" />
      </div>

      <div className="auth-card">
        {/* Logo */}
        <div className="auth-logo">
          <span className="auth-logo-icon">📊</span>
          <span className="auth-logo-text">TradeX</span>
        </div>

        {/* Tabs */}
        <div className="auth-tabs">
          <button
            className={`auth-tab ${mode === "login" ? "active" : ""}`}
            onClick={() => switchMode("login")}
          >
            Sign In
          </button>
          <button
            className={`auth-tab ${mode === "register" ? "active" : ""}`}
            onClick={() => switchMode("register")}
          >
            Create Account
          </button>
        </div>

        <p className="auth-tagline">
          {mode === "login"
            ? "Welcome back. Markets never sleep."
            : "Join 500,000+ traders worldwide."}
        </p>

        {/* Form */}
        <form className="auth-form" onSubmit={submit}>
          {mode === "register" && (
            <div className="auth-field">
              <label>Full Name</label>
              <input
                name="name"
                type="text"
                placeholder="John Doe"
                value={form.name}
                onChange={handle}
                required
                autoComplete="name"
              />
            </div>
          )}

          <div className="auth-field">
            <label>Email Address</label>
            <input
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handle}
              required
              autoComplete="email"
            />
          </div>

          <div className="auth-field">
            <label>Password</label>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handle}
              required
              autoComplete={mode === "login" ? "current-password" : "new-password"}
            />
          </div>

          {mode === "register" && (
            <div className="auth-field">
              <label>Confirm Password</label>
              <input
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={form.confirmPassword}
                onChange={handle}
                required
                autoComplete="new-password"
              />
            </div>
          )}

          {mode === "login" && (
            <div className="auth-forgot">
              <a href="#">Forgot password?</a>
            </div>
          )}

          {error && <div className="auth-error">{error}</div>}

          <button
            type="submit"
            className={`auth-submit ${loading ? "loading" : ""}`}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="auth-spinner" />
                {mode === "login" ? "Signing in..." : "Creating account..."}
              </>
            ) : (
              mode === "login" ? "Sign In →" : "Create Account →"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="auth-divider"><span>or continue with</span></div>

        {/* Social buttons */}
        <div className="auth-socials">
          <button className="auth-social-btn">
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google
          </button>
          <button className="auth-social-btn">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            GitHub
          </button>
        </div>

        <p className="auth-switch">
          {mode === "login" ? (
            <>Don't have an account? <button onClick={() => switchMode("register")}>Create one</button></>
          ) : (
            <>Already have an account? <button onClick={() => switchMode("login")}>Sign in</button></>
          )}
        </p>

        <p className="auth-legal">
          By continuing, you agree to our <a href="#">Terms</a> and <a href="#">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
}