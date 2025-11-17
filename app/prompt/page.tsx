"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { MainPromptScreen } from "../../components/MainPromptScreen";

export default function PromptPage() {
  const router = useRouter();

  const handleContinue = (requirements: string) => {
    // Store requirements in sessionStorage
    if (typeof window !== "undefined") {
      sessionStorage.setItem("requirements", requirements);
    }

    // Navigate to builder page
    router.push("/builder");
  };

  return <MainPromptScreen onContinue={handleContinue} />;
}
