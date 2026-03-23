import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import '../styles/Register.css';

// Class to encapsulate registration logic
class AuthManager {
  static async register(email: string, password: string) {
    const response = await fetch('/api/register', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to register");
    }

    return data;
  }
}

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  const { setUser } = useUser();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const data = await AuthManager.register(email, password);

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
            <input
              className="auth__input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button className="auth__submit" type="submit">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}
