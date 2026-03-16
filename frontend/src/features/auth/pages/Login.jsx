import React from "react";
import { useNavigate, Link } from "react-router";
import "../auth.form.scss";

const Login = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const navigate = useNavigate();
  return (
    <main>
      <div className="form-container">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter your email"
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Enter your password"
            />
          </div>

          <button className="button primary-button" type="submit">
            Login
          </button>
        </form>

        <p>
          Don't have an account? <Link to="/register">Create Account</Link>
        </p>
      </div>
    </main>
  );
};

export default Login;
