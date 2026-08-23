export const PERMISSIONS = {
  CALENDAR: "calendar",
  NOTICES: "notices",
  ELITES: "elites",
  COUNSELING: "counseling",
  GRADE_LEAGUE: "grade_league",
  COURSES: "courses",
  SHOWCASE: "showcase",
  ARTICLES: "articles",
  EXAMS: "exams", 
} as const;

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];

export const PERMISSION_LABELS: Record<Permission, string> = {
  [PERMISSIONS.CALENDAR]: "مدیریت تقویم",
  [PERMISSIONS.NOTICES]: "مدیریت اطلاعیه‌ها",
  [PERMISSIONS.ELITES]: "مدیریت نخبگان",
  [PERMISSIONS.COUNSELING]: "مشاوره",
  [PERMISSIONS.GRADE_LEAGUE]: "لیگ علمی پایه",
  [PERMISSIONS.COURSES]: "مدیریت دوره‌ها",
  [PERMISSIONS.SHOWCASE]: "نمایشگاه",
  [PERMISSIONS.ARTICLES]: "مدیریت مقالات",
  [PERMISSIONS.EXAMS]: "مدیریت آزمون‌ها و کارنامه‌ها", 
};

export const ALL_PERMISSIONS = Object.values(PERMISSIONS);