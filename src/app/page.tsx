"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useIsPWA } from "./../../hooks/useIsPWA";

// کامپوننت‌های ضروری وب
import Preloader from "@/component/Preloader";
import HeroSec from "@/component/HeroSec";
import StudentAuthButtons from "@/component/auth/StudentAuthButtons";
import EliteLeagueBanner from "@/component/EliteLeagueBanner";
import ScrollAnimation from "@/component/ScrollAnimation";

// مودال‌های احراز هویت
import StudentLoginModal from "@/component/auth/StudentLoginModal";
import StudentRegisterModal from "@/component/auth/StudentRegisterModal";

// کامپوننت‌های PWA
import AppCountdownBanner from "@/component/app/AppCountdownBanner";
import AppQuickActions from "@/component/app/AppQuickActions";
import AppLeagueCard from "@/component/app/AppLeagueCard";
import AppQuickAccess from "@/component/app/AppQuickAccess";

const CounterStats = dynamic(() => import("@/component/CounterStats"), { ssr: false });
const ScienceHub = dynamic(() => import("@/component/ScienceHub"), { ssr: false });
const PuzzleActionSection = dynamic(() => import("@/component/PuzzleButton"), { ssr: false });
const PopularClasses = dynamic(() => import("@/component/classBox/PopularClasses"), { ssr: false });
const StudentComments = dynamic(() => import("@/component/StudentComments"), { ssr: false });
const Questions = dynamic(() => import("@/component/Questions"), { ssr: false });

const getScientificBadgeInfo = (score: number) => {
  if (score <= 500) return { title: "باید بیشتر تلاش کنی", imageUrl: "/image/hero11.png" };
  if (score <= 2500) return { title: "شهید رضایی نژاد", imageUrl: "/image/levels/le1.png" };
  if (score <= 5000) return { title: "شهید علیمحمدی", imageUrl: "/image/levels/le2.png" };
  if (score <= 7500) return { title: "شهید احمدی روشن", imageUrl: "/image/levels/le3.png" };
  if (score <= 10000) return { title: "شهید شهریاری", imageUrl: "/image/levels/le4.png" };
  if (score <= 12500) return { title: "شهید طهرانی مقدم", imageUrl: "/image/levels/le5.png" };
  return { title: "شهید فخری زاده", imageUrl: "/image/levels/le6.png" };
};

// نسخه وب عادی سایت
function ExistingWebsiteHome() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem("hasSeenPreloader")) {
      setIsLoaded(true);
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsLoginModalOpen(false);
    window.location.assign("/student/dashboard");
  };

  const handleRegisterSuccess = () => {
    setIsRegisterModalOpen(false);
    window.location.assign("/student/dashboard");
  };

  return (
    <>
      <Preloader onComplete={() => setIsLoaded(true)} />
      <div dir="rtl" className="w-full dir-rtl text-right overflow-x-hidden flex-grow bg-white pb-16 sm:pb-24">
        <div className="space-y-6 sm:space-y-10 pt-4 sm:pt-6 Container mb-12 sm:mb-20">
          <HeroSec isLoaded={true} />
          <div className="mt-8 sm:mt-16">
            <StudentAuthButtons 
              onOpenLoginModal={() => setIsLoginModalOpen(true)}
              onOpenRegisterModal={() => setIsRegisterModalOpen(true)}
            />
          </div>
          <EliteLeagueBanner />
        </div>

        {isLoaded && (
          <div className="space-y-12 mt-30 sm:mt-40 sm:space-y-24">
            <ScrollAnimation direction="up" delay={0.05}><CounterStats /></ScrollAnimation>
            <div className="mt-30 sm:mt-40">
              <ScrollAnimation direction="up" delay={0.1}><ScienceHub /></ScrollAnimation>
            </div>
            <div className="mt-30 sm:mt-40">
              <ScrollAnimation direction="up" delay={0.15}><PuzzleActionSection /></ScrollAnimation>
            </div>
            <div className="mt-30 sm:mt-40">
              <ScrollAnimation direction="up" delay={0.2}><PopularClasses /></ScrollAnimation>
            </div>
            <div className="mt-30 sm:mt-35">
              <ScrollAnimation direction="up" delay={0.25}><StudentComments /></ScrollAnimation>
            </div>
            <ScrollAnimation direction="up" delay={0.3}><Questions /></ScrollAnimation>
          </div>
        )}
      </div>

      <StudentLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={handleLoginSuccess}
        onLoginSuccess={handleLoginSuccess}
        onSwitchToRegister={() => {
          setIsLoginModalOpen(false);
          setIsRegisterModalOpen(true);
        }}
      />

      <StudentRegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onSuccess={handleRegisterSuccess}
        onSwitchToLogin={() => {
          setIsRegisterModalOpen(false);
          setIsLoginModalOpen(true);
        }}
      />
    </>
  );
}

// نسخه PWA (اپلیکیشن موبایل)
function PWAAppHome() {
  const router = useRouter();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [studentData, setStudentData] = useState({
    name: "دانش‌آموز",
    inEliteLeague: false,
    eliteRank: 0,
    eliteTotal: 50,
    basicRank: 1,
    basicTotal: 30,
    medalImageUrl: "/image/hero11.png",
    medalTitle: "باید بیشتر تلاش کنی",
  });

  // تابع کمکی برای پاکسازی کامل اطلاعات و ریست کردن رتبه‌ها در حالت خروج
  const handleLoggedOutState = () => {
    setIsLoggedIn(false);
    setStudentData({
      name: "دانش‌آموز",
      inEliteLeague: false,
      eliteRank: 0,
      eliteTotal: 50,
      basicRank: 1,
      basicTotal: 30,
      medalImageUrl: "/image/hero11.png",
      medalTitle: "باید بیشتر تلاش کنی",
    });
  };

  const fetchUserData = async () => {
    const studentPhone = localStorage.getItem("studentPhone");
    const studentNationalId = localStorage.getItem("studentNationalId");
    if (!studentPhone && !studentNationalId) {
      handleLoggedOutState();
      return;
    }

    try {
      const res = await fetch("/api/student/dashboard", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "Pragma": "no-cache",
          "Expires": "0",
        },
      });

      if (res.ok) {
        const json = await res.json();
        if (json?.success && json?.data) {
          const { profile, gradeLeague, eliteLeague } = json.data;
          setIsLoggedIn(true);

          const name = profile?.name || "دانش‌آموز";
          const totalScore = profile?.totalScore || 0;
          const badgeInfo = getScientificBadgeInfo(totalScore);

          const basicRank = gradeLeague?.rank || 1;
          const basicTotal = gradeLeague?.totalStudents || 30;
          const inEliteLeague = Boolean(eliteLeague && eliteLeague.rank > 0);
          const eliteRank = eliteLeague?.rank || 0;
          const eliteTotal = eliteLeague?.totalStudents || 50;

          setStudentData({
            name,
            inEliteLeague,
            eliteRank,
            eliteTotal,
            basicRank,
            basicTotal,
            medalImageUrl: badgeInfo.imageUrl,
            medalTitle: badgeInfo.title,
          });
        } else {
          handleLoggedOutState();
        }
      } else {
        handleLoggedOutState();
      }
    } catch (error) {
      console.error("Error fetching PWA student data:", error);
      handleLoggedOutState();
    }
  };

  useEffect(() => {
    fetchUserData();

    const handleStorageChange = () => {
      fetchUserData();
    };
    window.addEventListener("storage", handleStorageChange);

    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        fetchUserData();
      }
    };
    window.addEventListener("pageshow", handlePageShow);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, []);

  const handleLoginSuccess = () => {
    setIsLoginModalOpen(false);
    setIsLoggedIn(true);
    window.location.assign("/student/dashboard");
  };

  const handleRegisterSuccess = () => {
    setIsRegisterModalOpen(false);
    setIsLoggedIn(true);
    window.location.assign("/student/dashboard");
  };

  return (
    <>
      <div className="space-y-4 p-4 pb-12">
        <AppCountdownBanner
          targetDate="2027-05-22T00:00:00+03:30"
          targetUrl="/elite-league"
          imageSrc="/image/appHero.jpg"
        />

        <AppQuickActions
          onActionClick={(id) => {
            if (id === "quizzes") router.push("/under-construction");
            if (id === "league") router.push("/elite-league");
            if (id === "courses") router.push("/courses");
            if (id === "goftino") router.push("/chat-guidance/chat");
          }}
        />

        <AppLeagueCard
          isLoggedIn={isLoggedIn}
          inEliteLeague={studentData.inEliteLeague}
          eliteRank={studentData.eliteRank}
          eliteTotal={studentData.eliteTotal}
          basicRank={studentData.basicRank}
          basicTotal={studentData.basicTotal}
          medalImageUrl={studentData.medalImageUrl}
          medalTitle={studentData.medalTitle}
        />

        <AppQuickAccess
          onItemClick={(id) => {
            if (id === "honors") router.push("/student/dashboard");
            if (id === "notes") router.push("/student/dashboard");
            if (id === "calendar") router.push("/calendar");
            if (id === "videos") router.push("/courses");
          }}
        />
      </div>

      <StudentLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={handleLoginSuccess}
        onLoginSuccess={handleLoginSuccess}
        onSwitchToRegister={() => {
          setIsLoginModalOpen(false);
          setIsRegisterModalOpen(true);
        }}
      />

      <StudentRegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onSuccess={handleRegisterSuccess}
        onSwitchToLogin={() => {
          setIsRegisterModalOpen(false);
          setIsLoginModalOpen(true);
        }}
      />
    </>
  );
}

// کامپوننت اصلی مدیریت مسیر که نسخه وب و PWA را تفکیک می‌کند
export default function Home() {
  const { isPWA, isMounted } = useIsPWA();

  if (!isMounted) {
    return <div className="min-h-screen bg-white" />;
  }

  if (isPWA) {
    return <PWAAppHome />;
  }

  return <ExistingWebsiteHome />;
}