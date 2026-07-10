"use client";

import React, { useState, useEffect } from "react";
import Container from "./Container";
import logo from "./../../public/image/-2147483648_-212076-removebg-preview.png";
import { useRouter } from "next/navigation";

// Importing dynamic parts from the sub-folder
import DesktopNavbar from "./navbarDet/DesktopNavbar";
import MobileNavbar from "./navbarDet/MobileNavbar";
import ResponsiveDrawer from "./navbarDet/ResponsiveDrawer";
import AdminLoginModal from "./navbarDet/AdminLoginModal";

function Navbar() {
  const router = useRouter();

  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState("");
  const [isOpen, setIsOpen] = useState(false); // Mobile menu toggle control

  const [showLogo, setShowLogo] = useState(false);
  const [showHome, setShowHome] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showCourses, setShowCourses] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  // Trigger element delays sequentially
  useEffect(() => {
    setTimeout(() => setShowLogo(true), 100);
    setTimeout(() => setShowHome(true), 600);
    setTimeout(() => setShowContact(true), 900);
    setTimeout(() => setShowAbout(true), 1200);
    setTimeout(() => setShowCourses(true), 1500);
    setTimeout(() => setShowLogin(true), 1800);
  }, []);

  // Request authentication payload handler
  const handleLogin = async () => {
    try {
      const res = await fetch("/api/admin-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (data.success) {
        setShowModal(false);
        setPassword(""); // Clear field
        router.push("/admin");
      } else {
        alert("رمز عبور اشتباه است");
        setPassword(""); // Clear field
      }
    } catch (error) {
      console.error(error);
      alert("خطا در ارتباط با سرور");
      setPassword("");
    }
  };

  // Close and flush password field state
  const handleCloseModal = () => {
    setShowModal(false);
    setPassword(""); // Clear field
  };

  return (
    <>
      <div className="bg-primary h-40 w-full rounded-b-full relative z-40">
        <Container>
          {/* Main Desktop layout section */}
          <DesktopNavbar
            logo={logo}
            showLogo={showLogo}
            showHome={showHome}
            showContact={showContact}
            showAbout={showAbout}
            showCourses={showCourses}
          />

          {/* Mobile adaptive navigation layout */}
          <MobileNavbar
            logo={logo}
            showLogo={showLogo}
            showCourses={showCourses}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
          />
        </Container>
      </div>

      {/* Floating mobile slide-out container */}
      <ResponsiveDrawer isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* Authentication gate verification view */}
      <AdminLoginModal
        showModal={showModal}
        password={password}
        setPassword={setPassword}
        handleCloseModal={handleCloseModal}
        handleLogin={handleLogin}
      />
    </>
  );
}

export default Navbar;