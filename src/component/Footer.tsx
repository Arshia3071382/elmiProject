import React from "react";
import Container from "./Container";
import Link from "next/link";
import Image from "next/image";
import telegram from "./../../public/image/telegram-icon_488108-1-removebg-preview.png";
import aparat from "./../../public/image/Aparat_Icon.png";
import rubika from "./../../public/image/Rubika_Icon.png";
import enamad from "./../../public/image/enamad-logo.png";

function Footer() {
  return (
    <div className="font-[iranSans-r]">
      <div className="bg-primary w-full h-50 mt-20">
        <div className="hidden w-5/6 pt-10 sm:flex flex-row-reverse justify-between  items-center ">
          <div >
            <div className="text-white text-right flex flex-col  items-end sm:ml-0 ml-10 ">
              <h2>دسترسی سریع</h2>
              <hr className="w-50 text-right mt-3" />
              <div className="pt-4 text-sm">
                <p>
                  <Link href={"/aboutUS"}>ارتباط با ما</Link>
                </p>
                <p>
                  <Link href={"/contactUS"}>درباره ما</Link>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 mt-3  sm:mb-15 justify-end">
              <Link href={"#"}>
                <Image width={50} src={telegram} alt="telIcon" />
              </Link>
              <Link
                href={
                  "https://web.rubika.ir/#c=c0BNeq5092020abb1a7cb6c37d532657"
                }
              >
                <Image width={30} src={rubika} alt="rubikaIcon" />
              </Link>
              <Link href={"https://www.aparat.com/elmiMontazeran"}>
                <Image
                  width={30}
                  className="ml-3"
                  src={aparat}
                  alt="aparatIcon"
                />
              </Link>
            </div>
          </div>

          <div className="mb-20 ml-15 sm:ml-40">
            <Image src={enamad} alt="enamad" />
          </div>
        </div>
      </div>
      <div className="bg-secondary w-full h-13">
        <h1 className="text-white text-center pt-3">کلیه حقوق محفوظ میباشد</h1>
      </div>
    </div>
  );
}

export default Footer;
