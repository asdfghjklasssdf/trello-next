"use client";

import { useRouter } from "next/navigation";
import { useState, JSX } from "react";
import "../css/ProfilePage.css";

/* =======================
   Types
======================= */

interface User {
  fullName?: string;
  email?: string;
  username?: string;
  phone?: string;
  bio?: string;
}

/* =======================
   Component
======================= */

export default function ProfilePage(): JSX.Element {
  const router = useRouter();

  const [user] = useState<User>(() => {
    try {
      const storedUser = localStorage.getItem("loggedInUser");
      return storedUser ? (JSON.parse(storedUser) as User) : {};
    } catch {
      return {};
    }
  });

  const handleLogout = (): void => {
    localStorage.removeItem("loggedInUser");
    router.push("/login");
  };

  const avatarLetter: string =
    user.fullName?.charAt(0).toUpperCase() ?? "U";

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div
          className="avatar"
          aria-label="User avatar"
          title="User avatar"
        >
          {avatarLetter}
        </div>

        <h2>{user.fullName ?? "User"}</h2>

        <p>
          <strong>Email:</strong> {user.email ?? "Not added"}
        </p>

        <p>
          <strong>Username:</strong> {user.username ?? "Not added"}
        </p>

        <p>
          <strong>Phone:</strong> {user.phone ?? "Not added"}
        </p>

        <p>
          <strong>Bio:</strong> {user.bio ?? "No bio added"}
        </p>

        <button
          className="logout-btn"
          type="button"
          onClick={handleLogout}
        >
          Logout
        </button>

        <button
          className="back-btn"
          type="button"
          onClick={() => router.back()}
        >
          Go Back
        </button>
      </div>
    </div>
  );
}
