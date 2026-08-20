// Scientific levels data
export const SCIENTIFIC_LEVELS = [
  { minScore: 0, maxScore: 500, title: "بیشتر تلاش کن", icon: "/image/hero11.png" },
  { minScore: 501, maxScore: 2500, title: "شهید رضایی نژاد", icon: "/image/levels/le1.png" },
  { minScore: 2501, maxScore: 5000, title: "شهید علیمحمدی", icon: "/image/levels/le2.png" },
  { minScore: 5001, maxScore: 7500, title: "شهید احمدی روشن", icon: "/image/levels/le3.png" },
  { minScore: 7501, maxScore: 10000, title: "شهید شهریاری", icon: "/image/levels/le4.png" },
  { minScore: 10001, maxScore: 12500, title: "شهید طهرانی مقدم", icon: "/image/levels/le5.png" },
  { minScore: 12501, maxScore: 999999, title: "شهید فخری زاده", icon: "/image/levels/le6.png" },
];

// Get scientific badge info
export const getScientificBadgeInfo = (score: number) => {
  if (score <= 500) return { title: "باید بیشتر تلاش کنی", imageUrl: "/image/hero11.png", levelIndex: 0 };
  if (score <= 2500) return { title: "پژوهشگر برنز", imageUrl: "/image/levels/le1.png", levelIndex: 1 };
  if (score <= 5000) return { title: "پژوهشگر نقره‌ای", imageUrl: "/image/levels/le2.png", levelIndex: 2 };
  if (score <= 7500) return { title: "دانشمند طلایی", imageUrl: "/image/levels/le3.png", levelIndex: 3 };
  if (score <= 10000) return { title: "نخبه علمی", imageUrl: "/image/levels/le4.png", levelIndex: 4 };
  if (score <= 12500) return { title: "استاد برتر", imageUrl: "/image/levels/le5.png", levelIndex: 5 };
  return { title: "اسطوره علمی و کهکشانی", imageUrl: "/image/levels/le6.png", levelIndex: 6 };
};

// Dashboard data interface
export interface DashboardData {
  isComplete: boolean;
  profile: {
    name: string;
    grade: number;
    level: string;
    totalScore: number;
    scoreToNextLevel: number;
  };
  gradeLeague?: {
    score: number;
    rank: number;
    totalStudents: number;
    scientificLevelTitle: string;
  } | null;
  badges: Array<{ title: string; icon: string }>;
  lastLeagueUpdate: string;
}