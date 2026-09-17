"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useIsPWA } from "./../../hooks/useIsPWA";

// کامپوننت‌های ضروری
import Preloader from "@/component/Preloader";
import HeroSec from "@/component/HeroSec";
import StudentAuthButtons from "@/component/auth/StudentAuthButtons";
import EliteLeagueBanner from "@/component/EliteLeagueBanner";
import ScrollAnimation from "@/component/ScrollAnimation";

// کامپوننت مودال ورود دانش‌آموز (آدرس ایمپورت را در صورت نیاز با مسیر پروژه خود تطبیق دهید)
import StudentLoginModal from "@/component/auth/StudentLoginModal";

// کامپوننت‌های PWA
import AppHome from "@/component/app/AppHome";
import AppHeader from "@/component/app/AppHeader";
import AppQuickActions from "@/component/app/AppQuickActions";
import AppLeagueCard from "@/component/app/AppLeagueCard";
import AppQuickAccess from "@/component/app/AppQuickAccess";
import AppBottomNav, { TabType } from "@/component/app/AppBottomNav";
import AppPreloader from "@/component/app/AppPreloader";

const AppCountdownBanner = dynamic(
  () => import("@/component/app/AppCountdownBanner"),
  { ssr: false }
);

const CounterStats = dynamic(() => import("@/component/CounterStats"), { ssr: false });
const ScienceHub = dynamic(() => import("@/component/ScienceHub"), { ssr: false });
const PuzzleActionSection = dynamic(() => import("@/component/PuzzleButton"), { ssr: false });
const PopularClasses = dynamic(() => import("@/component/classBox/PopularClasses"), { ssr: false });
const StudentComments = dynamic(() => import("@/component/StudentComments"), { ssr: false });
const Questions = dynamic(() => import("@/component/Questions"), { ssr: false });

// تابع محاسبه مدال و تصویر دقیقاً مطابق امتیاز و پنل (شهدای هسته‌ای و علمی)
const getScientificBadgeInfo = (score: number) => {
  if (score <= 500) return { title: "باید بیشتر تلاش کنی", imageUrl: "/image/hero11.png" };
  if (score <= 2500) return { title: "شهید رضایی نژاد", imageUrl: "/image/levels/le1.png" };
  if (score <= 5000) return { title: "شهید علیمحمدی", imageUrl: "/image/levels/le2.png" };
  if (score <= 7500) return { title: "شهید احمدی روشن", imageUrl: "/image/levels/le3.png" };
  if (score <= 10000) return { title: "شهید شهریاری", imageUrl: "/image/levels/le4.png" };
  if (score <= 12500) return { title: "شهید طهرانی مقدم", imageUrl: "/image/levels/le5.png" };
  return { title: "شهید فخری زاده", imageUrl: "/image/levels/le6.png" };
};

// --- UI نسخه وب اصلی ---
function ExistingWebsiteHome() {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      sessionStorage.getItem("hasSeenPreloader")
    ) {
      setIsLoaded(true);
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsLoginModalOpen(false);
    router.refresh();
  };

  return (
    <>
      <Preloader onComplete={() => setIsLoaded(true)} />
      <div dir="rtl" className="w-full dir-rtl text-right overflow-x-hidden flex-grow bg-white pb-16 sm:pb-24">
        <div className="space-y-6 sm:space-y-10 pt-4 sm:pt-6 Container mb-12 sm:mb-20">
          <HeroSec isLoaded={true} />
          <div className="mt-8 sm:mt-16">
            <StudentAuthButtons onOpenLoginModal={() => setIsLoginModalOpen(true)} />
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

      {/* مودال ورود برای نسخه وب */}
      <StudentLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={handleLoginSuccess}
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  );
}

// --- UI اختصاصی PWA ---
function PWAAppHome() {
  const router = useRouter();

  // استیت کنترل باز/بسته بودن مودال ورود
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // بررسی فوری عدم اجرای مجدد پریلودر
  const [showPwaPreloader, setShowPwaPreloader] = useState(() => {
    if (typeof window !== "undefined") {
      return !localStorage.getItem("pwa_preloader_seen");
    }
    return false;
  });

  // خواندن آنی وضعیت لاگین از لوکال استوریج در رندر اولیه برای جلوگیری از پرش
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    if (typeof window !== "undefined") {
      return Boolean(
        localStorage.getItem("studentPhone") || 
        localStorage.getItem("studentNationalId") || 
        localStorage.getItem("studentToken") || 
        localStorage.getItem("token")
      );
    }
    return false;
  });

  const [activeTab, setActiveTab] = useState<TabType>("home");

  const [studentData, setStudentData] = useState(() => {
    if (typeof window !== "undefined") {
      return {
        name: localStorage.getItem("studentName") || "دانش‌آموز",
        inEliteLeague: localStorage.getItem("studentInEliteLeague") === "true",
        eliteRank: Number(localStorage.getItem("studentEliteRank")) || 0,
        eliteTotal: Number(localStorage.getItem("studentEliteTotal")) || 50,
        basicRank: Number(localStorage.getItem("studentBasicRank")) || 1,
        basicTotal: Number(localStorage.getItem("studentBasicTotal")) || 30,
        medalImageUrl: localStorage.getItem("studentMedalImageUrl") || "/image/hero11.png",
        medalTitle: localStorage.getItem("studentMedalTitle") || "باید بیشتر تلاش کنی",
      };
    }
    return {
      name: "دانش‌آموز",
      inEliteLeague: false,
      eliteRank: 0,
      eliteTotal: 50,
      basicRank: 1,
      basicTotal: 30,
      medalImageUrl: "/image/hero11.png",
      medalTitle: "باید بیشتر تلاش کنی",
    };
  });

  const fetchUserData = async () => {
    try {
      const res = await fetch("/api/student/dashboard", {
        method: "GET",
        credentials: "include",
      });
      if (res.ok) {
        const json = await res.json();
        if (json?.success && json?.data) {
          const { profile, gradeLeague, eliteLeague } = json.data;
          setIsLoggedIn(true);

          const name = profile?.name || "دانش‌آموز";
          const totalScore = profile?.totalScore || 0;
          
          // محاسبه مدال بر اساس امتیاز واقعی پروفایل
          const badgeInfo = getScientificBadgeInfo(totalScore);

          const basicRank = gradeLeague?.rank || 1;
          const basicTotal = gradeLeague?.totalStudents || 30;
          
          const inEliteLeague = Boolean(eliteLeague && eliteLeague.rank > 0);
          const eliteRank = eliteLeague?.rank || 0;
          const eliteTotal = eliteLeague?.totalStudents || 50;

          const updatedData = {
            name,
            inEliteLeague,
            eliteRank,
            eliteTotal,
            basicRank,
            basicTotal,
            medalImageUrl: badgeInfo.imageUrl,
            medalTitle: badgeInfo.title,
          };

          setStudentData(updatedData);

          localStorage.setItem("studentName", name);
          localStorage.setItem("studentInEliteLeague", String(inEliteLeague));
          localStorage.setItem("studentEliteRank", String(eliteRank));
          localStorage.setItem("studentEliteTotal", String(eliteTotal));
          localStorage.setItem("studentBasicRank", String(basicRank));
          localStorage.setItem("studentBasicTotal", String(basicTotal));
          localStorage.setItem("studentMedalTitle", badgeInfo.title);
          localStorage.setItem("studentMedalImageUrl", badgeInfo.imageUrl);
        }
      } else if (res.status === 401) {
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error("Error fetching PWA student data:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleLoginSuccess = () => {
    setIsLoginModalOpen(false);
    setIsLoggedIn(true);
    fetchUserData();
    router.refresh();
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/student/logout", { 
        method: "POST",
        credentials: "include" 
      });
    } catch (error) {
      console.error("Error logging out:", error);
    }
    
    const keysToRemove = [
      "studentPhone", "studentNationalId", "studentName", 
      "studentToken", "token", "studentInEliteLeague", 
      "studentEliteRank", "studentEliteTotal", "studentBasicRank", 
      "studentBasicTotal", "studentMedalImageUrl", "studentMedalTitle"
    ];
    keysToRemove.forEach(key => localStorage.removeItem(key));

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
    router.refresh();
  };

  const handlePreloaderComplete = () => {
    localStorage.setItem("pwa_preloader_seen", "true");
    setShowPwaPreloader(false);
  };

  return (
    <>
      {showPwaPreloader && (
        <AppPreloader
          duration={3000}
          onComplete={handlePreloaderComplete}
        />
      )}

      <AppHome
        header={
          <AppHeader
            isLoggedIn={isLoggedIn}
            studentName={studentData.name}
            onLogout={handleLogout}
            onOpenLoginModal={() => setIsLoginModalOpen(true)}
          />
        }
        quickActions={
          <div className="space-y-3 pt-1 -mt-1">
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
          </div>
        }
        leagueCard={
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
        }
        quickAccess={
          <AppQuickAccess
            onItemClick={(id) => {
              if (id === "honors") router.push("/student/dashboard");
              if (id === "notes") router.push("/student/dashboard");
              if (id === "calendar") router.push("/calendar");
              if (id === "videos") router.push("/courses");
            }}
          />
        }
        bottomNav={
          <AppBottomNav
            activeTab={activeTab}
            onOpenLoginModal={() => setIsLoginModalOpen(true)}
            onTabChange={(tab) => {
              setActiveTab(tab);
              if (tab === "home") router.push("/");
              if (tab === "news") router.push("/news");
              if (tab === "about") router.push("/aboutUs");
              if (tab === "contact") router.push("/contactUs");
              if (tab === "login") {
                if (!isLoggedIn) {
                  setIsLoginModalOpen(true);
                } else {
                  router.push("/student/dashboard");
                }
              }
            }}
          />
        }
      />

      <StudentLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={handleLoginSuccess}
        onLoginSuccess={handleLoginSuccess}
        onSwitchToRegister={() => {
          setIsLoginModalOpen(false);
          router.push("/auth/register");
        }}
      />
    </>
  );
}

export default function Home() {
  const { isPWA, isMounted } = useIsPWA();

  if (isMounted && isPWA) {
    return <PWAAppHome />;
  }

  return <ExistingWebsiteHome />;
}