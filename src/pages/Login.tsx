import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import "./Register.css"; // We can reuse the exact same sleek styles!

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  const { setUser } = useUser();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to log in");
      }

      // Update global state and local storage
      setUser({
        email: data.email, 
        displayName: data.displayName,
        experiencePoints: data.experiencePoints
      });

      // Send them to the modules page
      navigate("/");
      
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="auth">
      <div className="auth__card">
        <h1 className="auth__title">Welcome Back</h1>
        
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
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}