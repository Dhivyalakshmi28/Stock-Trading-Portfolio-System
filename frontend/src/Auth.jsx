import { useState } from "react";
import { loginUser, registerUser } from "./authApi";

function Auth({ onLogin }) {
  const [mode, setMode] = useState("login");

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }

  function switchMode(newMode) {
    setMode(newMode);
    setError("");
    setSuccess("");
  }

async function handleSubmit(event) {
  event.preventDefault();

  setError("");
  setSuccess("");

  if (mode === "register") {
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (form.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (!/[A-Za-z]/.test(form.password)) {
      setError("Password must contain at least one letter.");
      return;
    }

    if (!/[0-9]/.test(form.password)) {
      setError("Password must contain at least one number.");
      return;
    }
  }

  setLoading(true);

  try {
    if (mode === "register") {
      await registerUser({
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        phone: form.phone,
      });

      setSuccess(
        "Account created successfully. You can now sign in."
      );

      setForm({
        fullName: "",
        email: form.email,
        phone: "",
        password: "",
        confirmPassword: "",
      });

      setMode("login");
    } else {
      const result = await loginUser(form.email, form.password);

localStorage.setItem("token", result.token);

onLogin(result.user);
    }
  } catch (err) {
    const message = err.message || "Something went wrong.";

    if (
      mode === "register" &&
      message.toLowerCase().includes("email already registered")
    ) {
      setError(
        "An account with this email already exists. Please sign in instead."
      );
    } else {
      setError(message);
    }
  } finally {
    setLoading(false);
  }
}

  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-brand">
          <div className="auth-logo">
            ST
          </div>

          <div>
            <h1>Stock Trading</h1>
            <p>Portfolio Management System</p>
          </div>
        </div>

        <div className="auth-heading">
          <h2>
            {mode === "login"
              ? "Welcome back"
              : "Create your account"}
          </h2>

          <p>
            {mode === "login"
              ? "Sign in to access your trading dashboard."
              : "Create an account to manage your portfolio."}
          </p>
        </div>

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        {success && (
          <div className="auth-success">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {mode === "register" && (
            <>
              <label>
                Full Name
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />
              </label>

              <label>
                Phone
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  required
                />
              </label>
            </>
          )}

          <label>
            Email
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </label>

          {mode === "register" && (
            <label>
              Confirm Password
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
              />
            </label>
          )}

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : mode === "login"
              ? "Sign In"
              : "Create Account"}
          </button>
        </form>

        <div className="auth-switch">
          {mode === "login" ? (
            <>
              Don't have an account?
              <button
                type="button"
                onClick={() => switchMode("register")}
              >
                Create account
              </button>
            </>
          ) : (
            <>
              Already have an account?
              <button
                type="button"
                onClick={() => switchMode("login")}
              >
                Sign in
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
}

export default Auth;