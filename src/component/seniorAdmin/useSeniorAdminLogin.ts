"use client";

import { useState, useCallback } from "react";

interface UseSeniorAdminLoginReturn {
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  handleLoginSuccess: () => void;
}

export function useSeniorAdminLogin(): UseSeniorAdminLoginReturn {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const openLoginModal = useCallback(() => {
    setIsLoginModalOpen(true);
  }, []);

  const closeLoginModal = useCallback(() => {
    setIsLoginModalOpen(false);
  }, []);

  const handleLoginSuccess = useCallback(() => {
    // هر عملیات اضافی پس از ورود موفق
    console.log("Senior admin logged in successfully");
  }, []);

  return {
    isLoginModalOpen,
    openLoginModal,
    closeLoginModal,
    handleLoginSuccess,
  };
}