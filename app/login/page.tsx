"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { LoginScreen } from "../../components/LoginScreen";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = () => {
    // Navigate to main prompt screen
    router.push("/prompt");
  };

  return <LoginScreen onLogin={handleLogin} />;
}
