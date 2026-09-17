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

// --- UI نسخه وب اصلی ---
function ExistingWebsiteHome() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      sessionStorage.getItem("hasSeenPreloader")
    ) {
      setIsLoaded(true);
    }
  }, []);

  return (
    <>
      <Preloader onComplete={() => setIsLoaded(true)} />
      <div dir="rtl" className="w-full dir-rtl text-right overflow-x-hidden flex-grow bg-white pb-16 sm:pb-24">
        <div className="space-y-6 sm:space-y-10 pt-4 sm:pt-6 Container mb-12 sm:mb-20">
          <HeroSec isLoaded={true} />
          <div className="mt-8 sm:mt-16">
            <StudentAuthButtons />
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
    </>
  );
}

// --- UI اختصاصی PWA ---
function PWAAppHome() {
  const router = useRouter();
  
  // بررسی فوری عدم اجرای مجدد پریلودر
  const [showPwaPreloader, setShowPwaPreloader] = useState(() => {
    if (typeof window !== "undefined") {
      return !localStorage.getItem("pwa_preloader_seen");
    }
    return false;
  });

  const [activeTab, setActiveTab] = useState<TabType>("home");
  const [studentData, setStudentData] = useState({
    name: "دانش‌آموز",
    rank: 12,
    totalParticipants: 2450,
    progressPercentage: 60,
  });

  useEffect(() => {
    async function fetchUserData() {
      try {
        const res = await fetch("/api/student/dashboard");
        if (res.ok) {
          const data = await res.json();
          if (data?.student?.name) {
            setStudentData({
              name: data.student.name,
              rank: data.student.rank || 12,
              totalParticipants: data.totalParticipants || 2450,
              progressPercentage: data.student.progressPercentage || 60,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching PWA student data:", error);
      }
    }
    fetchUserData();
  }, []);

  const handlePreloaderComplete = () => {
    localStorage.setItem("pwa_preloader_seen", "true");
    setShowPwaPreloader(false);
  };

  return (
    <>
      {/* پریلودر PWA فقط یک‌بار در اولین لود برنامه اجرا می‌شود */}
      {showPwaPreloader && (
        <AppPreloader
          duration={3000}
          onComplete={handlePreloaderComplete}
        />
      )}

      <AppHome
        header={<AppHeader />}
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
            rank={studentData.rank}
            totalParticipants={studentData.totalParticipants}
            progressPercentage={studentData.progressPercentage}
            onViewLeaderboard={() => router.push("/elite-league")}
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
            onTabChange={(tab) => {
              setActiveTab(tab);
              if (tab === "home") router.push("/");
              if (tab === "news") router.push("/news");
              if (tab === "about") router.push("/aboutUs");
              if (tab === "contact") router.push("/contactUs");
              if (tab === "login") router.push("/auth/login");
            }}
          />
        }
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