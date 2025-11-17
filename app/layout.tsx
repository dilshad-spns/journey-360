"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Inter } from "next/font/google";
import { TopNav } from "../components/TopNav";
import { Toaster } from "../components/ui/sonner";
import "../styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);

  // Initialize dark mode from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedDarkMode = localStorage.getItem("darkMode");
      const isDark = savedDarkMode !== null ? savedDarkMode === "true" : true;
      setDarkMode(isDark);
    }
  }, []);

  // Apply dark mode class to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    if (typeof window !== "undefined") {
      localStorage.setItem("darkMode", darkMode.toString());
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleNewProject = () => {
    // Clear session storage
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("requirements");
    }
    // Navigate to home
    router.push("/");
  };

  const handleGoHome = () => {
    router.push("/prompt");
  };

  // Show TopNav on all pages except landing page and login page
  const showTopNav = pathname !== "/" && pathname !== "/login";

  return (
    <html lang='en'>
      <body className={inter.className}>
        <div className='min-h-screen bg-background'>
          <Toaster />
          {showTopNav && (
            <TopNav
              darkMode={darkMode}
              onToggleDarkMode={toggleDarkMode}
              onNewProject={handleNewProject}
              onGoHome={handleGoHome}
            />
          )}
          {children}
        </div>
      </body>
    </html>
  );
}
