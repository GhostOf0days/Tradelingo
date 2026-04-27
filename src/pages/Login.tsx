// Email/password login; on success we stash the profile in UserContext and go home.
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useUser } from "../contexts/UserContext";
import '../styles/Register.css';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  
  const { setUser } = useUser();
  const navigate = useNavigate();

  /** POST /api/login then hydrate UserContext from JSON (no tokens — session is localStorage). */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const normalizedEmail = email.trim().toLowerCase();
    if (!EMAIL_PATTERN.test(normalizedEmail)) {
      setError("Enter a valid email address");
      return;
    }

    try {
      const response = await fetch('/api/login', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail, password }),
      });

      const text = await response.text();
      let data: { error?: string; email?: string; displayName?: string; experiencePoints?: number } = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        data = { error: "Login service returned an invalid response" };
      }

      if (!response.ok) {
        throw new Error(data.error || "Failed to log in");
      }

      setUser({
        email: data.email ?? normalizedEmail,
        displayName: data.displayName ?? normalizedEmail.split("@")[0],
        experiencePoints: data.experiencePoints ?? 0,
      });
      navigate("/");
      
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      if (message.includes("expected pattern") || message.includes("Failed to fetch")) {
        setError("Login service is unavailable. Please try again in a moment.");
        return;
      }
      setError(message);
    }
  };

  return (
    <div className="auth">
      <div className="auth__card">
        <h1 className="auth__title">Welcome Back</h1>
        
        {error && <div className="auth__error">{error}</div>}

        <form className="auth__form" onSubmit={handleSubmit} noValidate>
          <div className="auth__field">
            <label className="auth__label">Email</label>
            <input
              className="auth__input"
              type="text"
              inputMode="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="trader@example.com"
              autoCapitalize="none"
              autoComplete="email"
              required
            />
          </div>

          <div className="auth__field">
            <label className="auth__label">Password</label>
            <div className="auth__password-input">
              <input
                className="auth__input"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                autoComplete="current-password"
                required
              />
              <button
                className="auth__password-toggle"
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button className="auth__submit" type="submit">
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}
