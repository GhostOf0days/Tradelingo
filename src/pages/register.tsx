// Creates an account via POST /api/register and logs the user in immediately afterward.
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useUser } from "../contexts/UserContext";
import '../styles/Register.css';

const PASSWORD_RULES = [
  { label: 'At least 8 characters', test: (value: string) => value.length >= 8 },
  { label: 'One uppercase letter', test: (value: string) => /[A-Z]/.test(value) },
  { label: 'One lowercase letter', test: (value: string) => /[a-z]/.test(value) },
  { label: 'One number', test: (value: string) => /[0-9]/.test(value) },
  { label: 'One symbol', test: (value: string) => /[^A-Za-z0-9]/.test(value) },
];

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  
  const { setUser } = useUser();
  const navigate = useNavigate();
  const passwordChecks = useMemo(
    () => PASSWORD_RULES.map((rule) => ({ ...rule, valid: rule.test(password) })),
    [password]
  );
  const passwordScore = passwordChecks.filter((check) => check.valid).length;
  const passwordStrength =
    passwordScore <= 2 ? 'weak' : passwordScore <= 4 ? 'good' : 'strong';
  const hasPasswordIssues = password.length > 0 && passwordScore < PASSWORD_RULES.length;
  const hasConfirmPasswordIssue =
    confirmPassword.length > 0 && password !== confirmPassword;

  /** POST /api/register; server hashes password and returns the public profile fields. */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const missingRule = passwordChecks.find((check) => !check.valid);
    if (missingRule) {
      setError(`Password needs: ${missingRule.label.toLowerCase()}`);
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await fetch('/api/register', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to register");
      }

      setUser({
        email,
        displayName: data.displayName,
        experiencePoints: data.experiencePoints,
      });
      navigate("/");
      
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  return (
    <div className="auth">
      <div className="auth__card">
        <h1 className="auth__title">Create Account</h1>
        
        {error && <div className="auth__error">{error}</div>}

        <form className="auth__form" onSubmit={handleSubmit}>
          <div className="auth__field">
            <label className="auth__label">Email</label>
            <input
              className="auth__input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="trader@example.com"
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
                placeholder="Use a strong password"
                autoComplete="new-password"
                aria-invalid={hasPasswordIssues}
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
            {password.length > 0 && (
              <div className="auth__password-panel">
                <div className="auth__strength-row">
                  <span>Password strength</span>
                  <strong className={`auth__strength-label auth__strength-label--${passwordStrength}`}>
                    {passwordStrength}
                  </strong>
                </div>
                <div className="auth__strength-meter" aria-hidden="true">
                  <span style={{ width: `${(passwordScore / PASSWORD_RULES.length) * 100}%` }} />
                </div>
                <ul className="auth__password-rules">
                  {passwordChecks.map((check) => (
                    <li
                      key={check.label}
                      className={check.valid ? 'auth__password-rule--valid' : ''}
                    >
                      {check.valid ? '✓' : '•'} {check.label}
                    </li>
                  ))}
                </ul>
                {passwordScore < PASSWORD_RULES.length && (
                  <p className="auth__password-suggestion">
                    Strong example: MarketSaver27!
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="auth__field">
            <label className="auth__label">Confirm Password</label>
            <div className="auth__password-input">
              <input
                className="auth__input"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                autoComplete="new-password"
                aria-invalid={hasConfirmPasswordIssue}
                required
              />
              <button
                className="auth__password-toggle"
                type="button"
                onClick={() => setShowConfirmPassword((current) => !current)}
                aria-label={showConfirmPassword ? "Hide confirmed password" : "Show confirmed password"}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {hasConfirmPasswordIssue && (
              <p className="auth__field-help auth__field-help--error">Passwords do not match.</p>
            )}
          </div>

          <button className="auth__submit" type="submit">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}
