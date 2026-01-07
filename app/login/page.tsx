"use client";

import { useState, FormEvent, ChangeEvent, JSX } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "../css/login.css";



interface User {
  id: string;      
  email: string;
  password: string;
  name?: string;
}




export default function LoginPage(): JSX.Element {
  const router = useRouter();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    const storedUsers = localStorage.getItem("users");
    const users: User[] = storedUsers
      ? (JSON.parse(storedUsers) as User[])
      : [];

    const foundUser = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!foundUser) {
      setError("Invalid email or password");
      return;
    }

localStorage.setItem("loggedInUserId", foundUser.id);
localStorage.setItem("loggedInUser", JSON.stringify(foundUser)); 
    router.push("/dashboard");
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Login</h1>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              placeholder="Enter your email"
              title="Email address"
              required
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              placeholder="Enter your password"
              title="Password"
              required
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
            />
          </div>

          {error && <p className="error" role="alert">{error}</p>}

          <button className="btn-login" type="submit">
            Login
          </button>
        </form>

        <p className="signuplink">
          Don&apos;t have an account?{" "}
          <Link href="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
