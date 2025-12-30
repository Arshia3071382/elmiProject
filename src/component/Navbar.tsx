"use client";

import React, { useState } from "react";
import Container from "./Container";
import logo from "./../../public/image/-2147483648_-212076-removebg-preview.png";
import Image from "next/image";
import closeBtn from "./../../public/image/close_38dp_434343_FILL0_wght400_GRAD0_opsz40.png";
import menuBtn from "./../../public/image/menu_34dp_434343_FILL0_wght400_GRAD0_opsz40.png";
import classBtn from "./../../public/image/school_31dp_2854C5_FILL0_wght400_GRAD0_opsz24.png";
import Link from "next/link";
import { INavbar } from "@/type/page";

function Navbar() {
  const [modal, setModal] = useState(false);

  const handleOpenModal = () => {
    setModal((prev) => !prev);
  };
  const closeModal = () => {
    setModal(false);
  };

  const navItem: INavbar[] = [
    {
      id: 1,
      title: "صفحه اصلی",
      link: "/",
    },
    {
      id: 2,
      title: " ارتباط با ما",
      link: "/contactUs",
    },
    {
      id: 3,
      title: "درباره ما",
      link: "/aboutUs",
    },
  ];
  return (
    <div className="bg-primary h-40 w-full lg:rounded-bl-full lg:rounded-br-full">
      <Container>
        <div className="hidden md:flex w-full  h-40 relative">
          <div className="absolute top-25 left-1/2  -translate-x-1/2 rounded shadow flex flex-row-reverse w-5/6 justify-between  bg-white items-center  x-6 h-25 px-3">
            <div className="hidden md:flex flex-row-reverse items-center gap-20 ">
              <div>
                <Image width={119} src={logo} alt="sitelogo" />
              </div>
              <div>
                <ul className="hidden md:flex flex-row-reverse gap-10 font-[iranSans-r] text-[16px] text-gray-500 cursor-pointer ">
                  {navItem.map((item) => (
                    <Link href={item.link}>
                      <li
                        key={item.id}
                        className="hover:bg-secondary hover:text-white  hover:rounded p-2 hover:transition duration-200  "
                      >
                        {item.title}
                      </li>
                    </Link>
                  ))}
                </ul>
              </div>
            </div>
            <div>
              <button className="cursor-pointer hover:scale-120">
                <Image src={classBtn} alt="bookBtn" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex md:hidden w-full  h-40 relative">
          <div className="absolute top-25 left-1/2  -translate-x-1/2 rounded shadow flex flex-row-reverse w-5/6 justify-between  bg-white items-center  x-6 h-25 px-3">
            <div>
              <button onClick={handleOpenModal}>
                {modal ? (
                  <Image src={closeBtn} alt="menuBtn" />
                ) : (
                  <Image src={menuBtn} alt="menuBtn" onClick={closeModal} />
                )}
              </button>
            </div>
            <div className="pb-4">
              <Image width={119} src={logo} alt="sitelogo" />
            </div>
            <div>
              <button className="cursor-pointer hover:scale-120">
                <Image src={classBtn} alt="bookBtn" />
              </button>
            </div>
          </div>
        </div>
        <div className="relative w-5/6 mt-10 mx-auto  bg-sky-400 ">
          {modal && (
            <div className="z-20 flex md:hidden w-full rounded  border-t-0 ">
              <ul className="text-white text-center w-full rounded">
                {navItem.map((item) => (
                  <Link href={item.link}>
                    <li
                      key={item.id}
                      className="w-full cursor-pointer mb-5 py-5 hover:bg-white hover:text-sky-400"
                    >
                      {item.title}
                    </li>
                  </Link>
                ))}
              </ul>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}

export default Navbar;
