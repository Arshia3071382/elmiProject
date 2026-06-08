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
      <div className="bg-primary h-40 w-full rounded-b-full">
        <Container>
          <div className="hidden md:flex justify-between items-center w-full h-40 relative">
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

                {/* 🔑 حذف Link و فقط دکمه ساده */}
                <button
                  onClick={() => setShowModal(true)}
                  className="rounded cursor-pointer text-white bg-success hover:text-success hover:border hover:border-success hover:bg-white px-3 py-1 transition"
                  style={{
                    opacity: showLogin ? 1 : 0,
                    transform: showLogin ? "translateX(0)" : "translateX(30px)",
                    transition: "all 0.5s ease-out",
                  }}
                >
                  ورود
                </button>
              </div>
            </div>
          </div>
        </Container>
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