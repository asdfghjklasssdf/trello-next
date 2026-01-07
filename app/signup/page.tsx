"use client";

import { useState, FormEvent, ChangeEvent, JSX } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "@/app/globals.css";
import "../css/Signup.css";



interface User {
  id: number;
  fullName: string;
  username: string;
  email: string;
  phone: string;
  bio: string;
  password: string;
}

interface FormErrors {
  fullName?: string;
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  form?: string;
}


export default function SignupPage(): JSX.Element {
  const router = useRouter();

  const [fullName, setFullName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [errors, setErrors] = useState<FormErrors>({});

  

  const validate = (): FormErrors => {
    const e: FormErrors = {};

    if (!fullName) e.fullName = "Full name is required";
    if (!username) e.username = "Username is required";
    if (!email) e.email = "Email is required";
    if (!password) e.password = "Password is required";
    if (password !== confirmPassword) {
      e.confirmPassword = "Passwords do not match";
    }

    return e;
  };



  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    const newUser: User = {
      id: Date.now(),
      fullName,
      username,
      email,
      phone,
      bio,
      password,
    };

    const existingUsers: User[] = JSON.parse(
      localStorage.getItem("users") || "[]"
    );

    const duplicate = existingUsers.find(
      (u) => u.email === email || u.username === username
    );

    if (duplicate) {
      setErrors({
        form: "Account with this email or username already exists",
      });
      return;
    }

    existingUsers.push(newUser);
    localStorage.setItem("users", JSON.stringify(existingUsers));
    localStorage.setItem("loggedInUser", JSON.stringify(newUser));

    router.push("/dashboard");
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h1>Create Account</h1>

        <form onSubmit={handleSubmit} className="signup-form" noValidate>
          {/* Full Name */}
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              value={fullName}
              placeholder="Enter your full name"
              title="Full name"
              required
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setFullName(e.target.value)
              }
            />
            {errors.fullName && (
              <small className="error">{errors.fullName}</small>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              value={username}
              placeholder="Choose a username"
              title="Username"
              required
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setUsername(e.target.value)
              }
            />
            {errors.username && (
              <small className="error">{errors.username}</small>
            )}
          </div>

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
            {errors.email && (
              <small className="error">{errors.email}</small>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input
              id="phone"
              value={phone}
              placeholder="Enter phone number"
              title="Phone number"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setPhone(e.target.value)
              }
            />
          </div>

          <div className="form-group">
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              value={bio}
              placeholder="Tell us about yourself"
              title="Bio"
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                setBio(e.target.value)
              }
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              placeholder="Create a password"
              title="Password"
              required
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
            />
            {errors.password && (
              <small className="error">{errors.password}</small>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              placeholder="Confirm your password"
              title="Confirm password"
              required
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setConfirmPassword(e.target.value)
              }
            />
            {errors.confirmPassword && (
              <small className="error">{errors.confirmPassword}</small>
            )}
          </div>

          {errors.form && (
            <p className="error" role="alert">
              {errors.form}
            </p>
          )}

          <button className="btn-signup" type="submit">
            Sign Up
          </button>
        </form>

        <p className="login-link">
          Already have an account? <Link href="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
