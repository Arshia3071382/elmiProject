// Main student dashboard page
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Container from "@/component/Container";
import DashboardHeader from "@/component/student-dashboard/DashboardHeader";
import GradeLeagueCard from "@/component/student-dashboard/GradeLeagueCard";
import EliteLeagueCard from "@/component/student-dashboard/EliteLeagueCard"; // اضافه شده برای لیگ نخبگان
import ScientificLevelCard from "@/component/student-dashboard/ScientificLevelCard";
import ProgressBar from "@/component/student-dashboard/ProgressBar";
import LevelSlider from "@/component/student-dashboard/LevelSlider";
import ExamCard from "@/component/student-dashboard/ExamCard";
import { DashboardData, SCIENTIFIC_LEVELS, getScientificBadgeInfo } from "@/component/student-dashboard/constants";

export default function StudentDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/student/dashboard");
      if (res.status === 401) {
        window.location.replace("/");
        return;
      }
      const json = await res.json();

      if (json.success && json.data) {
        const profile = json.data.profile;
        const league = json.data.gradeLeague;
        const eliteLeague = json.data.eliteLeague; // اطلاعات لیگ نخبگان
        const totalScore = profile.totalScore || 0;

        setData({
          isComplete: true,
          profile: {
            name: profile.name || "دانش‌آموز عزیز",
            grade: profile.grade || 7,
            level: profile.level || "عضو فعال",
            totalScore: totalScore,
            scoreToNextLevel: profile.scoreToNextLevel || 1000,
          },
          gradeLeague: {
            score: league.score || 0,
            rank: league.rank || 1,
            totalStudents: league.totalStudents || 10,
            scientificLevelTitle: league.scientificLevelTitle || "پایه",
          },
          eliteLeague: eliteLeague ? {
            score: eliteLeague.score || 0,
            rank: eliteLeague.rank || 0,
            category: eliteLeague.category || "elementary",
          } : null,
          badges: json.data.recentActivities?.map((act: any) => ({
            title: act.title,
            icon: "🎖️",
          })) || [],
          lastLeagueUpdate: json.data.lastLeagueUpdate || "امروز",
        });

        const userLevelIdx = getScientificBadgeInfo(totalScore).levelIndex;
        setCurrentLevelIndex(userLevelIdx);
      } else {
        setFallbackData();
      }
    } catch (err) {
      setFallbackData();
    } finally {
      setLoading(false);
    }
  };

  const setFallbackData = () => {
    setData({
      isComplete: false,
      profile: {
        name: "دانش‌آموز عزیز",
        grade: 7,
        level: "عضو جدید",
        totalScore: 750,
        scoreToNextLevel: 1000,
      },
      gradeLeague: {
        score: 750,
        rank: 1,
        totalStudents: 20,
        scientificLevelTitle: "پایه هفتم",
      },
      eliteLeague: null,
      badges: [],
      lastLeagueUpdate: "امروز",
    });
    setCurrentLevelIndex(1);
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await fetch("/api/auth/student/logout", { method: "POST" });
    } catch (e) {
      console.error("Logout error", e);
    } finally {
      localStorage.removeItem("studentNationalId");
      localStorage.removeItem("studentPhone");
      window.location.replace("/");
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div dir="rtl" className="min-h-screen bg-slate-50 p-6 flex items-center justify-center">
        <div className="w-full max-w-7xl space-y-6 animate-pulse">
          <div className="h-44 w-full bg-slate-200 rounded-3xl" />
          <div className="h-56 bg-slate-200 rounded-3xl" />
        </div>
      </div>
    );
  }

  const dashboardData = data || {
    isComplete: false,
    profile: {
      name: "دانش‌آموز",
      grade: 7,
      level: "عضو جدید",
      totalScore: 0,
      scoreToNextLevel: 1000,
    },
    eliteLeague: null,
    badges: [],
    lastLeagueUpdate: "امروز",
  };

  const currentScore = dashboardData.profile.totalScore;
  const scientificInfo = getScientificBadgeInfo(currentScore);
  const nextLevelObj = SCIENTIFIC_LEVELS[scientificInfo.levelIndex + 1];
  const currentLevelObj = SCIENTIFIC_LEVELS[scientificInfo.levelIndex] || SCIENTIFIC_LEVELS[0];
  const scoreNeeded = nextLevelObj ? nextLevelObj.minScore - currentScore : 0;
  const levelMin = currentLevelObj.minScore;
  const levelMax = nextLevelObj ? nextLevelObj.minScore : currentScore + 1000;
  const progressPercent = nextLevelObj
    ? Math.min(Math.max(((currentScore - levelMin) / (levelMax - levelMin)) * 100, 4), 100)
    : 100;

  return (
    <Container>
      <div dir="rtl" className="min-h-screen bg-gradient-to-br mt-10 sm:mt-15 from-slate-50 via-blue-50/20 to-slate-100 p-4 sm:p-6 lg:p-8 pb-20 font-[iranBold]">
        <div className="max-w-7xl mx-auto space-y-6">
      {/* بخش سلام و خوش‌آمدگویی */}
          <DashboardHeader
            name={dashboardData.profile.name}
            grade={dashboardData.profile.grade}
            level={dashboardData.profile.level}
            isLoggingOut={isLoggingOut}
            onLogout={handleLogout}
          />

          {/* کارت طلایی و جشن لیگ نخبگان (فقط اگر رتبه داشته باشد بلافاصله بعد از سلام نمایش داده می‌شود) */}
          {dashboardData.eliteLeague && dashboardData.eliteLeague.rank > 0 && (
            <EliteLeagueCard
              rank={dashboardData.eliteLeague.rank}
              category={dashboardData.eliteLeague.category}
            />
          )}

          {/* بقیه کارت‌ها و گریدها */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {dashboardData.gradeLeague && (
              <GradeLeagueCard
                score={dashboardData.gradeLeague.score}
                rank={dashboardData.gradeLeague.rank}
                totalStudents={dashboardData.gradeLeague.totalStudents}
                scientificLevelTitle={dashboardData.gradeLeague.scientificLevelTitle}
                lastUpdate={dashboardData.lastLeagueUpdate}
              />
            )}

            <ScientificLevelCard
              imageUrl={scientificInfo.imageUrl}
              title={scientificInfo.title}
            />
          </div>
          <div className="bg-white/90 backdrop-blur-xl border border-amber-100 rounded-3xl p-6 shadow-xl space-y-6">
            <ProgressBar
              currentScore={currentScore}
              nextLevelTitle={nextLevelObj?.title}
              nextLevelMinScore={nextLevelObj?.minScore}
              progressPercent={progressPercent}
              scoreNeeded={scoreNeeded}
            />

            <LevelSlider
              currentIndex={currentLevelIndex}
              userLevelIndex={scientificInfo.levelIndex}
              userScore={currentScore}
              onNext={() => setCurrentLevelIndex((prev) => (prev + 1) % SCIENTIFIC_LEVELS.length)}
              onPrev={() => setCurrentLevelIndex((prev) => (prev - 1 + SCIENTIFIC_LEVELS.length) % SCIENTIFIC_LEVELS.length)}
              onSelect={setCurrentLevelIndex}
            />
          </div>

          <ExamCard />
        </div>
      </div>
    </Container>
  );
}