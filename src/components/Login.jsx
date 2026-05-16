import React, { useState } from "react";
import API from "../api";
import { indiaData } from "../data/indiaData";
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  Link,
} from "react-router-dom";
import { useAuth } from "../context/AuthContext";

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

const InputField = ({ label, type, name, value, onChange, toggleShow, showPassword }) => (
  <div style={styles.inputGroup}>
    <label style={styles.label}>{label}</label>

    <div style={{ position: 'relative' }}>
      <input
        type={type === 'password' && showPassword ? 'text' : type}
        name={name}
        value={value}
        onChange={onChange}
        required
        style={styles.input}
      />
      {type === 'password' && (
        <button
          type="button"
          onClick={toggleShow}
          style={{
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            color: 'rgba(255,255,255,0.5)',
            cursor: 'pointer',
            padding: '4px',
            fontSize: '12px'
          }}
        >
          {showPassword ? 'HIDE' : 'SHOW'}
        </button>
      )}
    </div>
  </div>
);

const SelectField = ({ label, name, value, onChange, options }) => (
  <div style={styles.inputGroup}>
    <label style={styles.label}>{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      required
      style={styles.select}
    >
      <option value="">Select {label}</option>
      {options.map((opt) => (
        <option key={opt} value={opt} style={{ background: '#111', color: 'white' }}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

export const Signup = () => {
  const [form, setForm] = useState({
    email: "",
    fullName: "",
    password: "",
    confirmPassword: "",
    state: "",
    city: "",
    phone: "",
    gender: "",
    dob: "",
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [availableCities, setAvailableCities] = useState([]);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });

    if (name === "state") {
      setAvailableCities(indiaData[value] || []);
      setForm(prev => ({ ...prev, state: value, city: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await API.post("/auth/signup", form);

      alert("Signup successful!");

      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Signup failed");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h2 style={styles.heading}>Create Account</h2>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <InputField
            label="Full Name"
            type="text"
            name="fullName"
            value={form.fullName || ""}
            onChange={handleChange}
          />

          <InputField
            label="Email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
          />

          <InputField
            label="Password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            showPassword={showPassword}
            toggleShow={() => setShowPassword(!showPassword)}
          />

          <InputField
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            showPassword={showPassword}
            toggleShow={() => setShowPassword(!showPassword)}
          />

          <SelectField
            label="State"
            name="state"
            value={form.state}
            onChange={handleChange}
            options={Object.keys(indiaData)}
          />

          <SelectField
            label="City"
            name="city"
            value={form.city}
            onChange={handleChange}
            options={availableCities}
          />

          <InputField
            label="Phone"
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
          />

          {/* Gender */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Gender</label>

            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              required
              style={styles.select}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="non-binary">Non-binary</option>
              <option value="other">Other</option>
            </select>
          </div>

          <InputField
            label="Date of Birth"
            type="date"
            name="dob"
            value={form.dob}
            onChange={handleChange}
          />

          <button style={styles.button}>Signup</button>
        </form>

        <p style={styles.text}>
          Already have an account?{" "}
          <Link style={styles.link} to="/login">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export const Login = () => {
  const { login, token } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (token) {
      navigate("/dashboard");
    }
  }, [token, navigate]);

  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);



  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    try {
      const res = await API.post("/auth/login", form);

      if (res.data.requires2FA) {
        navigate('/login-otp', {
          state: {
            email: res.data.email
          }
        });
        return;
      }

      login(res.data.token);

      if (res.data.mustChangePassword) {
        alert("You must change your password!");
      } else {
        alert("Login successful!");
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h2 style={styles.heading}>Welcome Back</h2>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <InputField
            label="Email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
          />

          <InputField
            label="Password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            showPassword={showPassword}
            toggleShow={() => setShowPassword(!showPassword)}
          />

          <InputField
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            showPassword={showPassword}
            toggleShow={() => setShowPassword(!showPassword)}
          />

          <button style={styles.button}>Login</button>
        </form>

        <p style={styles.text}>
          Don't have an account?{" "}
          <Link style={styles.link} to="/signup">
            Signup
          </Link>
        </p>

        <p style={styles.text}>
          <Link style={styles.link} to="/request-reset">
            Forgot Password?
          </Link>
        </p>
      </div>
    </div>
  );
};

export const LoginOTP = () => {
  const { login } = useAuth();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const verifyOTP = async () => {
    try {
      const res = await API.post(
        "/auth/verify-login-otp",
        {
          email,
          otp
        }
      );

      login(res.data.token);
      alert("Login successful");
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.error
      );
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        <h2 style={styles.heading}>
          Verify Login OTP
        </h2>

        {error && (
          <p style={styles.error}>
            {error}
          </p>
        )}

        <InputField
          label="Enter OTP"
          type="text"
          name="otp"
          value={otp}
          onChange={(e) =>
            setOtp(e.target.value)
          }
        />

        <button
          style={styles.button}
          onClick={verifyOTP}
        >
          Verify OTP
        </button>

      </div>
    </div>
  );
};

export const Verify2FA = () => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const verify = async () => {
    try {
      await API.post(
        '/auth/verify-enable-2fa',
        { otp }
      );
      alert('2FA Enabled');
      navigate('/dashboard');
    } catch (err) {
      alert(
        err.response?.data?.error
      );
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        <h2 style={styles.heading}>
          Verify 2FA
        </h2>

        <InputField
          label="OTP"
          type="text"
          name="otp"
          value={otp}
          onChange={(e) =>
            setOtp(e.target.value)
          }
        />

        <button
          style={styles.button}
          onClick={verify}
        >
          Verify OTP
        </button>

      </div>
    </div>
  );
};

// Dashboard moved to SecurityDashboard.jsx

export const RequestReset = () => {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMsg("");

    try {
      const res = await API.post("/auth/request-reset", { email });
      alert("If an account exists, a verification code was sent to your email.");
      navigate("/reset-password", { state: { email } });
    } catch (err) {
      alert("If an account exists, a verification code was sent to your email.");
      navigate("/reset-password", { state: { email } });
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h2 style={styles.heading}>Forgot Password</h2>
        <p style={{...styles.text, marginBottom: '24px'}}>Enter your email and we'll send you a 6-digit code to reset your password.</p>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <InputField
            label="Email Address"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button style={styles.button}>Send Code</button>
        </form>

        <p style={styles.text}>
          <Link style={styles.link} to="/login">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: location.state?.email || "",
    token: "",
    newPassword: "",
  });

  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMsg("");

    try {
      const res = await API.post("/auth/reset-password", form);
      alert("Password has been reset successfully!");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Reset failed. Please check your code.");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h2 style={styles.heading}>New Password</h2>
        <p style={{...styles.text, marginBottom: '24px'}}>Check your email for the 6-digit verification code.</p>

        {msg && <p style={styles.success}>{msg}</p>}
        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <InputField
            label="Email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
          />

          <InputField
            label="Verification Code"
            type="text"
            name="token"
            value={form.token}
            onChange={handleChange}
          />

          <InputField
            label="New Password"
            type="password"
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
          />

          <button style={styles.button}>Update Password</button>
        </form>
        <p style={styles.text}>
          <Link style={styles.link} to="/login">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export const ChangePassword = () => {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const [msg, setMsg] = useState("");

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMsg("");

    try {
      const res = await API.post("/auth/change-password", form);

      setMsg(res.data.message);
    } catch (err) {
      setError(err.response?.data?.error || "Change failed");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h2 style={styles.heading}>Change Password</h2>

        {msg && <p style={styles.success}>{msg}</p>}

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <InputField
            label="Current Password"
            type="password"
            name="currentPassword"
            value={form.currentPassword}
            onChange={handleChange}
          />

          <InputField
            label="New Password"
            type="password"
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
          />

          <button style={styles.button}>Change Password</button>
        </form>
        <p style={styles.text}>
          <Link style={styles.link} to="/login">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    background: "#000",
  },
  container: {
    width: "100%",
    maxWidth: "420px",
    padding: "40px 35px",
    borderRadius: "24px",
    background: "rgba(255, 255, 255, 0.03)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    animation: "fadeIn 0.5s ease-out",
    boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
    color: "white",
  },
  heading: {
    textAlign: "center",
    marginBottom: "30px",
    fontSize: "32px",
    fontWeight: "700",
    color: "#bef264",
    letterSpacing: "-0.5px",
  },
  inputGroup: {
    marginBottom: "20px",
    textAlign: "left",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: "14px",
    fontWeight: "500",
  },
  input: {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "12px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    background: "rgba(255, 255, 255, 0.05)",
    color: "white",
    outline: "none",
    fontSize: "15px",
    transition: "0.2s ease",
    boxSizing: "border-box",
  },
  select: {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "12px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    background: "rgba(255, 255, 255, 0.05)",
    color: "white",
    outline: "none",
    fontSize: "15px",
    transition: "0.2s ease",
    boxSizing: "border-box",
  },
  button: {
    width: "100%",
    padding: "16px",
    marginTop: "10px",
    border: "none",
    borderRadius: "12px",
    background: "#bef264",
    color: "#000",
    fontWeight: "700",
    fontSize: "16px",
    cursor: "pointer",
    transition: "0.2s ease",
  },
  link: {
    color: "#bef264",
    textDecoration: "none",
    fontWeight: "600",
  },
  text: {
    textAlign: "center",
    marginTop: "20px",
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: "14px",
  },
  error: {
    background: "rgba(255, 59, 48, 0.1)",
    color: "#ff3b30",
    padding: "12px",
    borderRadius: "12px",
    marginBottom: "20px",
    border: "1px solid rgba(255, 59, 48, 0.2)",
    textAlign: "center",
    fontSize: "14px",
  },
  success: {
    background: "rgba(52, 199, 89, 0.1)",
    color: "#34c759",
    padding: "12px",
    borderRadius: "12px",
    marginBottom: "20px",
    border: "1px solid rgba(52, 199, 89, 0.2)",
    textAlign: "center",
    fontSize: "14px",
  },
};
