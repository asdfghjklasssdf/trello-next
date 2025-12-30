"use client";

import "./globals.css";
import Navbar from "../components/Navbar";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }) {
  const pathname = usePathname();

  const hideNavbarRoutes = ["/login", "/signup", "/"];

  const shouldHideNavbar = hideNavbarRoutes.includes(pathname);

  return (
    <html lang="en">
      <body>
        {!shouldHideNavbar && <Navbar />}
        {children}
      </body>
    </html>
  );
}
