"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useIsPWA } from "./../../hooks/useIsPWA";

// کامپوننت‌های ضروری بالای صفحه (بدون Navbar و Footer)
import Preloader from "@/component/Preloader";
import HeroSec from "@/component/HeroSec";
import StudentAuthButtons from "@/component/auth/StudentAuthButtons";
import EliteLeagueBanner from "@/component/EliteLeagueBanner";
import ScrollAnimation from "@/component/ScrollAnimation";

// کامپوننت‌های اختصاصی PWA
import AppHome from "@/component/app/AppHome";
import AppHeader from "@/component/app/AppHeader";
import AppHero from "@/component/app/AppHero";
import AppQuickActions from "@/component/app/AppQuickActions";
import AppLeagueCard from "@/component/app/AppLeagueCard";
import AppQuickAccess from "@/component/app/AppQuickAccess";
import AppBottomNav, { TabType } from "@/component/app/AppBottomNav";

// ۱. Dynamic Import برای بخش‌های سنگین پایین صفحه
const CounterStats = dynamic(() => import("@/component/CounterStats"), { ssr: true });
const ScienceHub = dynamic(() => import("@/component/ScienceHub"), { ssr: true });
const PuzzleActionSection = dynamic(() => import("@/component/PuzzleButton"), { ssr: true });
const PopularClasses = dynamic(() => import("@/component/classBox/PopularClasses"), { ssr: true });
const StudentComments = dynamic(() => import("@/component/StudentComments"), { ssr: true });
const Questions = dynamic(() => import("@/component/Questions"), { ssr: true });

// --- UI اصلی سایت ---
function ExistingWebsiteHome() {
  const [isLoaded, setIsLoaded] = useState(false);

  // بررسی اولیه وضعیت پریلودر برای اسکرول مرورگر
  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem("hasSeenPreloader")) {
      setIsLoaded(true);
    }
  }, []);

  // مدیریت دقیق Scrollbar
  useEffect(() => {
    if (!isLoaded) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isLoaded]);

  return (
    <>
      {/* پریلودر موشکی */}
      <Preloader onComplete={() => setIsLoaded(true)} />

      {/* Navbar و Footer حذف شدند تا توسط LayoutShell کنترل شوند */}
      <div
        dir="rtl"
        className="w-full dir-rtl text-right overflow-x-hidden flex-grow bg-white"
      >
        <div className="space-y-3 sm:space-y-6 pt-4 sm:pt-6 Container">
          <HeroSec isLoaded={true} />
          <div className="mt-10 sm:mt-20">
            <StudentAuthButtons />
          </div>
          <EliteLeagueBanner />
        </div>

        <ScrollAnimation direction="up" delay={0.05}>
          <CounterStats />
        </ScrollAnimation>

        <ScrollAnimation direction="up" delay={0.1}>
          <ScienceHub />
        </ScrollAnimation>

        <ScrollAnimation direction="up" delay={0.15}>
          <PuzzleActionSection />
        </ScrollAnimation>

        <ScrollAnimation direction="up" delay={0.2}>
          <PopularClasses />
        </ScrollAnimation>

        <ScrollAnimation direction="up" delay={0.25}>
          <StudentComments />
        </ScrollAnimation>

        <ScrollAnimation direction="up" delay={0.3}>
          <Questions />
        </ScrollAnimation>
      </div>
    </>
  );
}

// --- UI اختصاصی اپلیکیشن PWA ---
function PWAAppHome() {
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

  return (
    <AppHome
      header={
        <AppHeader
          onNotificationClick={() => {
            window.location.href = "/notices";
          }}
          onMenuClick={() => {
            window.location.href = "/student/dashboard";
          }}
        />
      }
      hero={
        <AppHero
          studentName={studentData.name}
          subtitle="هر روز یک قدم به آینده نزدیک‌تر شو."
          buttonText="مشاهده برنامه امروز"
          onActionClick={() => {
            window.location.href = "/student/dashboard";
          }}
        />
      }
      quickActions={
        <AppQuickActions
          onActionClick={(id) => {
            if (id === "quizzes") window.location.href = "/league/grade";
            if (id === "league") window.location.href = "/elite-league";
            if (id === "courses") window.location.href = "/courses";
            if (id === "goftino") window.location.href = "/chat-guidance/chat";
          }}
        />
      }
      leagueCard={
        <AppLeagueCard
          rank={studentData.rank}
          totalParticipants={studentData.totalParticipants}
          progressPercentage={studentData.progressPercentage}
          onViewLeaderboard={() => {
            window.location.href = "/elite-league";
          }}
        />
      }
      quickAccess={
        <AppQuickAccess
          onItemClick={(id) => {
            if (id === "honors") window.location.href = "/student/dashboard";
            if (id === "notes") window.location.href = "/student/dashboard";
            if (id === "calendar") window.location.href = "/calendar";
            if (id === "videos") window.location.href = "/courses";
          }}
        />
      }
      bottomNav={
        <AppBottomNav
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            if (tab === "quizzes") window.location.href = "/league/grade";
            if (tab === "league") window.location.href = "/elite-league";
            if (tab === "courses") window.location.href = "/courses";
            if (tab === "profile") window.location.href = "/student/dashboard";
          }}
        />
      }
    />
  );
}

export default function Home() {
  const { isPWA, isMounted } = useIsPWA();

  if (isMounted && isPWA) {
    return <PWAAppHome />;
  }

  return <ExistingWebsiteHome />;
}