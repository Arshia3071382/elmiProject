"use client";

import React, { useState, useEffect } from "react";
import Container from "./Container";
import logo from "./../../public/image/-2147483648_-212076-removebg-preview.png";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

function Navbar() {
  const router = useRouter();

  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState("");
  const [isOpen, setIsOpen] = useState(false); // مدیریت باز و بسته شدن همبرگری

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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (data.success) {
        setShowModal(false);
        setPassword(""); // خالی کردن اینپوت
        router.push("/admin");
      } else {
        alert("رمز عبور اشتباه است");
        setPassword(""); // خالی کردن اینپوت
      }
    } catch (error) {
      console.error(error);
      alert("خطا در ارتباط با سرور");
      setPassword("");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setPassword(""); // خالی کردن اینپوت
  };

  return (
    <>
      <div className="bg-primary h-40 w-full rounded-b-full relative z-40">
        <Container>
          {/* ================= ساختار اصلی دسکتاپ (بدون تغییر در کد قبلی شما) ================= */}
          <div className="hidden lg:flex justify-between items-center w-full h-40 relative">
            <div className="absolute top-25 left-1/2 -translate-x-1/2 rounded shadow flex flex-row-reverse w-5/6 justify-between bg-white items-center h-25 px-3">
              {/* لوگو */}
              <div
                className="transition-all duration-700 ease-out"
                style={{
                  opacity: showLogo ? 1 : 0,
                  transform: showLogo ? "translateX(0)" : "translateX(-30px)",
                }}
              >
                <Image width={119} src={logo} alt="sitelogo" />
              </div>

              {/* منوها */}
              <div className="flex flex-row-reverse items-center gap-10">
                <ul className="hidden md:flex flex-row-reverse gap-10 font-[iranSans-r] text-[16px] text-gray-500 cursor-pointer">
                  <Link href="/">
                    <li
                      className="hover:bg-secondary hover:text-white hover:rounded p-2 transition duration-200"
                      style={{
                        opacity: showHome ? 1 : 0,
                        transform: showHome
                          ? "translateX(0)"
                          : "translateX(30px)",
                        transition: "all 0.5s ease-out",
                      }}
                    >
                      صفحه اصلی
                    </li>
                  </Link>
                  <Link href="/contactUs">
                    <li
                      className="hover:bg-secondary hover:text-white hover:rounded p-2 transition duration-200"
                      style={{
                        opacity: showContact ? 1 : 0,
                        transform: showContact
                          ? "translateX(0)"
                          : "translateX(30px)",
                        transition: "all 0.5s ease-out",
                      }}
                    >
                      ارتباط با ما
                    </li>
                  </Link>
                  <Link href="/aboutUs">
                    <li
                      className="hover:bg-secondary hover:text-white hover:rounded p-2 transition duration-200"
                      style={{
                        opacity: showAbout ? 1 : 0,
                        transform: showAbout
                          ? "translateX(0)"
                          : "translateX(30px)",
                        transition: "all 0.5s ease-out",
                      }}
                    >
                      درباره ما
                    </li>
                  </Link>
                </ul>
              </div>

              {/* دکمه‌ها */}
              <div className="gap-3 flex flex-row items-center">
                <Link href="/courses">
                  <button
                    className="rounded cursor-pointer text-white p-2 bg-accent hover:bg-white hover:text-accent hover:border border-accent transition"
                    style={{
                      opacity: showCourses ? 1 : 0,
                      transform: showCourses
                        ? "translateX(0)"
                        : "translateX(30px)",
                      transition: "all 0.5s ease-out",
                    }}
                  >
                    دوره های آموزشی
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* ================= ساختار جدید تبلت و موبایل (ریسپانسیو سفارشی) ================= */}
          <div className="flex  lg:hidden justify-between items-center w-full h-40 px-4 relative">
            <div className="absolute top-20 left-0 right-0 mx-4 rounded shadow flex flex-row-reverse justify-between bg-white items-center h-25 px-4">
              
              {/* سمت راست: منوی همبرگری */}
              <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="flex flex-col justify-center items-center gap-1.5 w-8 h-8 cursor-pointer text-gray-600 order-first"
                aria-label="منو"
              >
                <span className={`h-0.5 w-6 bg-gray-600 rounded transition-transform ${isOpen ? "rotate-45 translate-y-2" : ""}`} />
                <span className={`h-0.5 w-6 bg-gray-600 rounded transition-opacity ${isOpen ? "opacity-0" : ""}`} />
                <span className={`h-0.5 w-6 bg-gray-600 rounded transition-transform ${isOpen ? "-rotate-45 -translate-y-2" : ""}`} />
              </button>

              {/* وسط: لوگو ادمین */}
              <div
                className="absolute left-1/2 -translate-x-1/2 transition-all duration-700"
                style={{ opacity: showLogo ? 1 : 0 }}
              >
                <Link href="/">
                  <Image width={85} src={logo} alt="sitelogo" priority />
                </Link>
              </div>

              {/* سمت چپ: دکمه دوره‌های آموزشی */}
              <Link href="/courses" className="order-last">
                <button
                  className="rounded text-xs text-white py-2 px-3 bg-accent hover:bg-opacity-90 transition font-[iranSans-r]"
                  style={{
                    opacity: showCourses ? 1 : 0,
                    transition: "opacity 0.5s ease-out",
                  }}
                >
                  دوره‌ها
                </button>
              </Link>
            </div>
          </div>
        </Container>
      </div>

      {/* کشوی منوی بازشونده ریسپانسیو */}
      <div 
        className={`fixed inset-0 bg-black/40 z-50 transition-opacity duration-300 lg:hidden ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      >
        <div 
          className={`bg-white w-64 h-full pt-28 px-6 shadow-2xl transition-transform duration-300 ease-in-out flex flex-col gap-6 ${
            isOpen ? "translate-x-0" : "translate-x-full"
          } mr-auto`}
          onClick={(e) => e.stopPropagation()}
          dir="rtl"
        >
          <ul className="flex flex-col gap-5 font-[iranSans-r] text-[16px] text-gray-600">
            <Link href="/" onClick={() => setIsOpen(false)}>
              <li className="hover:bg-secondary/10 hover:text-secondary p-2.5 rounded transition-colors">
                صفحه اصلی
              </li>
            </Link>
            <Link href="/aboutUs" onClick={() => setIsOpen(false)}>
              <li className="hover:bg-secondary/10 hover:text-secondary p-2.5 rounded transition-colors">
                درباره ما
              </li>
            </Link>
            <Link href="/contactUs" onClick={() => setIsOpen(false)}>
              <li className="hover:bg-secondary/10 hover:text-secondary p-2.5 rounded transition-colors">
                ارتباط با ما
              </li>
            </Link>
          </ul>
        </div>
      </div>

      {/* مودال */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-80">
            <h2 className="text-center mb-4">ورود به پنل مدیریت</h2>

            <input
              type="password"
              placeholder="رمز عبور"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border w-full p-2 rounded"
            />

            <div className="flex gap-2 mt-4">
              <button
                onClick={handleCloseModal}
                className="flex-1 bg-gray-300 p-2 rounded"
              >
                انصراف
              </button>

              <button
                onClick={handleLogin}
                className="flex-1 bg-green-500 text-white p-2 rounded"
              >
                ورود
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;