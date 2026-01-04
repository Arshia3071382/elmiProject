import PopularClasses from "@/component/classBox/PopularClasses";
import Container from "@/component/Container";
import Footer from "@/component/Footer";
import HeroSec from "@/component/HeroSec";
import Navbar from "@/component/Navbar";
import Questions from "@/component/Questions";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <Navbar />
      <HeroSec />
      <div>
        <PopularClasses />
      </div>
      <Questions />
      <Footer />

    </>
  );
}
