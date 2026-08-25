"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Container from "@/component/Container";
import DashboardHeader from "@/component/student-dashboard/DashboardHeader";
import GradeLeagueCard from "@/component/student-dashboard/GradeLeagueCard";
import EliteLeagueCard from "@/component/student-dashboard/EliteLeagueCard";
import ScientificLevelCard from "@/component/student-dashboard/ScientificLevelCard";
import ProgressBar from "@/component/student-dashboard/ProgressBar";
import LevelSlider from "@/component/student-dashboard/LevelSlider";
import ExamCard from "@/component/student-dashboard/ExamCard";
import RankRadarCard from "@/component/student-dashboard/RankRadarCard";
import {
  DashboardData,
  SCIENTIFIC_LEVELS,
  getScientificBadgeInfo,
} from "@/component/student-dashboard/constants";
import { Trophy, FileText } from "lucide-react";

export default function StudentDashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  
  // مدیریت تب‌های فعال: "league" یا "exams"
  const [activeTab, setActiveTab] = useState<"league" | "exams">("league");

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
        const eliteLeague = json.data.eliteLeague;
        const totalScore = profile.totalScore || 0;

        setData({
          isComplete: true,
          profile: {
            name: profile.name || "دانش‌آموز عزیز",
            grade: profile.grade || 7,
            level: profile.level || "عضو فعال",
            totalScore: totalScore,
            scoreToNextLevel: profile.scoreToNextLevel || 1000,
            avatar: profile.avatar || "/image/profile/p1.png",
          } as any,
          gradeLeague: {
            score: league.score || 0,
            rank: league.rank || 1,
            totalStudents: league.totalStudents || 10,
            scientificLevelTitle: league.scientificLevelTitle || "پایه",
            higherStudent: league.higherStudent || null,
            lowerStudent: league.lowerStudent || null,
          } as any,
          eliteLeague: eliteLeague
            ? {
                score: eliteLeague.score || 0,
                rank: eliteLeague.rank || 0,
                category: eliteLeague.category || "elementary",
              }
            : null,
          badges:
            json.data.recentActivities?.map((act: any) => ({
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
        avatar: "/image/profile/p1.png",
      } as any,
      gradeLeague: {
        score: 750,
        rank: 1,
        totalStudents: 20,
        scientificLevelTitle: "پایه هفتم",
      } as any,
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

  // Edit profile handler
  const handleEditProfile = () => {
    router.push("/student/profile/edit");
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div
        dir="rtl"
        className="min-h-screen bg-slate-50 p-6 flex items-center justify-center"
      >
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
      avatar: "/image/profile/p1.png",
    },
    gradeLeague: {
      score: 0,
      rank: 1,
      totalStudents: 1,
      scientificLevelTitle: "پایه",
    },
    eliteLeague: null,
    badges: [],
    lastLeagueUpdate: "امروز",
  };

  const currentScore = dashboardData.profile.totalScore;
  const scientificInfo = getScientificBadgeInfo(currentScore);
  const nextLevelObj = SCIENTIFIC_LEVELS[scientificInfo.levelIndex + 1];
  const currentLevelObj =
    SCIENTIFIC_LEVELS[scientificInfo.levelIndex] || SCIENTIFIC_LEVELS[0];
  const scoreNeeded = nextLevelObj ? nextLevelObj.minScore - currentScore : 0;
  const levelMin = currentLevelObj.minScore;
  const levelMax = nextLevelObj ? nextLevelObj.minScore : currentScore + 1000;
  const progressPercent = nextLevelObj
    ? Math.min(
        Math.max(((currentScore - levelMin) / (levelMax - levelMin)) * 100, 4),
        100,
      )
    : 100;

  return (
    <Container>
      <div
        dir="rtl"
        className="min-h-screen bg-gradient-to-br mt-10 sm:mt-25 from-slate-50 via-blue-50/20 to-slate-100 p-4 sm:p-6 lg:p-8 pb-20 font-[iranBold]"
      >
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* ارسال مقدار avatar به هدر داشبورد */}
          <DashboardHeader
            name={dashboardData.profile.name}
            grade={dashboardData.profile.grade}
            level={dashboardData.profile.level}
            avatar={(dashboardData.profile as any).avatar}
            isLoggingOut={isLoggingOut}
            onLogout={handleLogout}
            onEditProfile={handleEditProfile}
          />

          {/* نوار تب‌ها برای جابجایی بین لیگ علمی و آزمون‌ها */}
          <div className="flex items-center gap-3 bg-white/80 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200/80 shadow-sm max-w-fit mx-auto sm:mx-0">
            <button
              onClick={() => setActiveTab("league")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === "league"
                  ? "bg-amber-500 text-white shadow-md shadow-amber-500/30"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Trophy className="w-4 h-4" />
              لیگ علمی
            </button>

            <button
              onClick={() => setActiveTab("exams")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === "exams"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <FileText className="w-4 h-4" />
              آزمون‌ها
            </button>
          </div>

          {/* محتوای تب اول: لیگ علمی */}
          {activeTab === "league" && (
            <div className="space-y-6 animate-fadeIn">
              {dashboardData.eliteLeague && dashboardData.eliteLeague.rank > 0 && (
                <EliteLeagueCard
                  rank={dashboardData.eliteLeague.rank}
                  category={dashboardData.eliteLeague.category}
                />
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {dashboardData.gradeLeague && (
                  <GradeLeagueCard
                    score={dashboardData.gradeLeague.score}
                    rank={dashboardData.gradeLeague.rank}
                    totalStudents={dashboardData.gradeLeague.totalStudents}
                    scientificLevelTitle={
                      dashboardData.gradeLeague.scientificLevelTitle
                    }
                    lastUpdate={dashboardData.lastLeagueUpdate}
                  />
                )}

                <ScientificLevelCard
                  imageUrl={scientificInfo.imageUrl}
                  title={scientificInfo.title}
                />
              </div>

              {dashboardData.gradeLeague && (
                <RankRadarCard
                  rank={dashboardData.gradeLeague.rank}
                  totalStudents={dashboardData.gradeLeague.totalStudents}
                  score={dashboardData.gradeLeague.score}
                  higherStudent={(dashboardData.gradeLeague as any).higherStudent}
                  lowerStudent={(dashboardData.gradeLeague as any).lowerStudent}
                />
              )}

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
                  onNext={() =>
                    setCurrentLevelIndex(
                      (prev) => (prev + 1) % SCIENTIFIC_LEVELS.length,
                    )
                  }
                  onPrev={() =>
                    setCurrentLevelIndex(
                      (prev) =>
                        (prev - 1 + SCIENTIFIC_LEVELS.length) %
                        SCIENTIFIC_LEVELS.length,
                    )
                  }
                  onSelect={setCurrentLevelIndex}
                />
              </div>
            </div>
          )}

          {/* محتوای تب دوم: آزمون‌ها */}
          {activeTab === "exams" && (
            <div className="space-y-6 animate-fadeIn">
              <ExamCard />
            </div>
          )}

        </div>
      </div>
    </Container>
  );
}