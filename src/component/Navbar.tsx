"use client";

import React, { useState, useEffect } from "react";
import Container from "./Container";
import logo from "./../../public/image/-2147483648_-212076-removebg-preview.png";
import { useRouter } from "next/navigation";

// Dynamic imports from sub-folder
import DesktopNavbar from "./navbarDet/DesktopNavbar";
import MobileNavbar from "./navbarDet/MobileNavbar";
import ResponsiveDrawer from "./navbarDet/ResponsiveDrawer";

function Navbar() {
  const router = useRouter();

  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const [showLogo, setShowLogo] = useState(false);
  const [showHome, setShowHome] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showCourses, setShowCourses] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    setTimeout(() => setShowLogo(true), 100);
    setTimeout(() => setShowHome(true), 600);
    setTimeout(() => setShowContact(true), 900);
    setTimeout(() => setShowAbout(true), 1200);
    setTimeout(() => setShowCourses(true), 1500);
    setTimeout(() => setShowLogin(true), 1800);
  }, []);

  const handleLogin = async () => {
    try {
      const res = await fetch("/api/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.success) {
        setShowModal(false);
        setPassword("");
        router.push("/admin");
      } else {
        alert("رمز عبور اشتباه است");
        setPassword("");
      }
    } catch (error) {
      console.error(error);
      alert("خطا در ارتباط با سرور");
      setPassword("");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setPassword("");
  };

  return (
    <>
      <div className="bg-primary h-40 w-full rounded-b-full relative z-40">
        <Container>
          {/* ۱. نمایش مخصوص دسکتاپ (کلاس داخل کامپوننت: hidden lg:flex) */}
          <DesktopNavbar
            logo={logo}
            showLogo={showLogo}
            showHome={showHome}
            showContact={showContact}
            showAbout={showAbout}
            showCourses={showCourses}
          />

         

          {/* ۳. نمایش مخصوص موبایل (کلاس داخل کامپوننت: flex md:hidden) */}
          <MobileNavbar
            logo={logo}
            showLogo={showLogo}
            showCourses={showCourses}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
          />
        </Container>
      </div>

      <ResponsiveDrawer isOpen={isOpen} setIsOpen={setIsOpen} />

      
    </>
  );
}

export default Navbar;