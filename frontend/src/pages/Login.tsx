import { useState } from "react";
import api from "../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem(
        "token",
        res.data.access_token
      );

      window.location.href = "/dashboard";
    } catch {
      alert("Invalid Credentials");
    }
  };

  return (
    <div>
      <h1>Smart Billing Login</h1>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) =>
          setEmail(e.target.value)
        }
      />

      <br />
      <br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) =>
          setPassword(e.target.value)
        }
      />

      <br />
      <br />

      <button onClick={login}>
        Login
      </button>
    </div>
  );
}