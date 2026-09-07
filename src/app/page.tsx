"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useIsPWA } from "./../../hooks/useIsPWA";

// ۱. کامپوننت‌های اصلی وب‌سایت
import Preloader from "@/component/Preloader";
import PopularClasses from "@/component/classBox/PopularClasses";
import Container from "@/component/Container";
import HeroSec from "@/component/HeroSec";
import Questions from "@/component/Questions";
import ScrollAnimation from "@/component/ScrollAnimation";
import CounterStats from "@/component/CounterStats"; 
import ScienceHub from "@/component/ScienceHub";
import PuzzleActionSection from "@/component/PuzzleButton";
import StudentComments from "@/component/StudentComments";
import StudentAuthButtons from "@/component/auth/StudentAuthButtons";
import EliteLeagueBanner from "@/component/EliteLeagueBanner";

// ۲. کامپوننت‌های اختصاصی PWA
import AppHome from "@/component/app/AppHome";
import AppHeader from "@/component/app/AppHeader";
import AppHero from "@/component/app/AppHero";
import AppQuickActions from "@/component/app/AppQuickActions";
import AppLeagueCard from "@/component/app/AppLeagueCard";
import AppQuickAccess from "@/component/app/AppQuickAccess";
import AppBottomNav, { TabType } from "@/component/app/AppBottomNav";

// --- UI اصلی سایت ---
function ExistingWebsiteHome() {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <>
      <Preloader onComplete={() => setIsLoaded(true)} />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="space-y-3 sm:space-y-6 pt-4 sm:pt-6">
          <HeroSec isLoaded={isLoaded} />
          <div className="mt-10 sm:mt-25">
            <StudentAuthButtons />
          </div>
          <EliteLeagueBanner />
        </div>
        
        <ScrollAnimation direction="up" delay={0.1}>
          <CounterStats />
        </ScrollAnimation>

        <ScrollAnimation direction="up" delay={0.2}>
          <ScienceHub />
        </ScrollAnimation>

        <ScrollAnimation direction="up" delay={0.2}>
          <PuzzleActionSection />
        </ScrollAnimation>

        <ScrollAnimation direction="up" delay={0.3}>
          <PopularClasses />
        </ScrollAnimation>

        <ScrollAnimation direction="up" delay={0.35}>
          <StudentComments />
        </ScrollAnimation>

        <ScrollAnimation direction="up" delay={0.4}>
          <Questions />
        </ScrollAnimation>
      </motion.div>
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

// --- کامپوننت اصلی (سوئیچ مستقیم بدون وابستگی به AppShell) ---
export default function Home() {
  const { isPWA, isMounted } = useIsPWA();

  // تا قبل از Mount شدن در کلاینت، نسخه وب‌سایت برای SEO و ساختار اول صفحات رندر می‌شود
  if (!isMounted) {
    return <ExistingWebsiteHome />;
  }

  // اگر حالت PWA فعال باشد، UI مخصوص اپلیکیشن رندر می‌شود
  if (isPWA) {
    return <PWAAppHome />;
  }

  // در غیر این صورت نسخه کامل وب‌سایت
  return <ExistingWebsiteHome />;
}