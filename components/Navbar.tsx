"use client";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import "../app/css/Navbar.css";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
<nav className="navbar">
  <div className="navbar-inner">
    {/* LOGO */}
    <Link href="/" className="nav-logo">
      <Image
        src="/TRELLO.png"
        alt="Trello Logo"
        width={36}
        height={36}
        priority
        className="logo-img"
      />
      <span className="logo-text">My Trello App</span>
    </Link>

    {/* DESKTOP + MOBILE LINKS */}
    <div className={`nav-links ${open ? "open" : ""}`}>
      <Link href="/profile" onClick={() => setOpen(false)}>Profile</Link>
      <Link href="/dashboard" onClick={() => setOpen(false)}>Dashboard</Link>
      <Link href="/edit-profile" onClick={() => setOpen(false)}>Edit</Link>
    </div>

    {/* MENU BUTTON */}
    <button
      className="menu-btn"
      onClick={() => setOpen(!open)}
      aria-label="Toggle menu"
    >
      {open ? <CloseIcon /> : <MenuIcon />}
    </button>
  </div>
</nav>

  );
}
