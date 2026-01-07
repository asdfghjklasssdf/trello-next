"use client";

import { useState, ChangeEvent, JSX } from "react";
import { useRouter } from "next/navigation";
import "@/app/globals.css";
import "../css/UserPages.css";



interface User {
  id: number;
  fullName: string;
  username: string;
  email: string;
  phone: string;
  bio: string;
}

interface EditForm {
  fullName: string;
  username: string;
  email: string;
  phone: string;
  bio: string;
}



export default function EditProfilePage(): JSX.Element {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem("loggedInUser");
      return stored ? (JSON.parse(stored) as User) : null;
    } catch {
      return null;
    }
  });

  const [form, setForm] = useState<EditForm>(() => {
    try {
      const stored = localStorage.getItem("loggedInUser");
      const parsed = stored ? (JSON.parse(stored) as User) : null;

      return {
        fullName: parsed?.fullName ?? "",
        username: parsed?.username ?? "",
        email: parsed?.email ?? "",
        phone: parsed?.phone ?? "",
        bio: parsed?.bio ?? "",
      };
    } catch {
      return {
        fullName: "",
        username: "",
        email: "",
        phone: "",
        bio: "",
      };
    }
  });

  if (!user) {
    return (
      <div className="profile-container">
        <div className="profile-card">
          <h2>Not signed in</h2>
          <p>Please login first.</p>
          <button
            className="btn"
            type="button"
            onClick={() => router.push("/login")}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }



  const handleSave = (): void => {
    const users: User[] = JSON.parse(
      localStorage.getItem("users") || "[]"
    );

    if (!form.email.trim() || !form.username.trim()) {
      alert("Email and username are required");
      return;
    }

    const conflict = users.find(
      (u) =>
        (u.email === form.email.trim() ||
          u.username === form.username.trim()) &&
        u.id !== user.id
    );

    if (conflict) {
      alert("Another user already uses that email or username");
      return;
    }

    const updatedUser: User = {
      ...user,
      ...form,
      email: form.email.trim(),
      username: form.username.trim(),
    };

    localStorage.setItem(
      "users",
      JSON.stringify(
        users.map((u) => (u.id === user.id ? updatedUser : u))
      )
    );
    localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));

    setUser(updatedUser);
    router.push("/profile");
  };



  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>Edit Profile</h2>

        <div className="form-group">
          <label htmlFor="fullName">Full Name</label>
          <input
            id="fullName"
            value={form.fullName}
            placeholder="Enter full name"
            title="Full name"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setForm((f) => ({ ...f, fullName: e.target.value }))
            }
          />
        </div>

        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            value={form.username}
            placeholder="Enter username"
            title="Username"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setForm((f) => ({ ...f, username: e.target.value }))
            }
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={form.email}
            placeholder="Enter email"
            title="Email address"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setForm((f) => ({ ...f, email: e.target.value }))
            }
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone</label>
          <input
            id="phone"
            value={form.phone}
            placeholder="Enter phone number"
            title="Phone number"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setForm((f) => ({ ...f, phone: e.target.value }))
            }
          />
        </div>

        <div className="form-group">
          <label htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            value={form.bio}
            placeholder="Tell us about yourself"
            title="Bio"
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setForm((f) => ({ ...f, bio: e.target.value }))
            }
          />
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <button className="btn" type="button" onClick={handleSave}>
            Save
          </button>
          <button
            className="btn"
            type="button"
            onClick={() => router.push("/profile")}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
