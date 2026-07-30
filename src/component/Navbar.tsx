"use client";

import React from "react";
import DesktopNavbar from "./../component/navbarDet/DesktopNavbar";
import MobileNavbar from "./../component/navbarDet/MobileNavbar";
import logoImg from "./../../public/image/logo4.png"; 

export default function Navbar() {
  return (
    <>
      <DesktopNavbar logo={logoImg} />
      <MobileNavbar logo={logoImg} />
    </>
  );
}