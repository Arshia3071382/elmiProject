export interface ShowcaseStep {
  id: string;
  title: string;
  icon: string;
  subtitle: string;
}

export const conferenceSteps: ShowcaseStep[] = [
  { id: "intro", title: "علمی منتظران", icon: "Sparkles", subtitle: "سامانه جامع آموزشی و نخبگانی" },
  { id: "structure", title: "کادر تشکیلاتی", icon: "Crown", subtitle: "مسئول علمی، معین‌های ارشد و پایه‌ها" },
  { id: "exam", title: "جذب و آزمون", icon: "Brain", subtitle: "آزمون‌های آنلاین و دسته‌بندی کلاسی" },
  { id: "leagues", title: "دو مدل لیگ", icon: "Trophy", subtitle: "لیگ پایه و لیگ نخبگان مقطع" },
  { id: "scores", title: "معیارهای امتیاز", icon: "Zap", subtitle: "کلاس، تکالیف، آزمون و پروژه‌ها" },
  { id: "levels", title: "سطح‌بندی شهدا", icon: "Medal", subtitle: "از شهید رضایی‌نژاد تا فخری‌زاده" },
  { id: "academy", title: "دوره‌های آموزشی", icon: "Video", subtitle: "آفیس، پایتون، هوش مصنوعی و کنکور" },
  { id: "goftino", title: "گفتینو (مشاور)", icon: "MessageSquare", subtitle: "هدایت تحصیلی و پاسخ هوشمند" },
  { id: "studentPanel", title: "پنل دانش‌آموز", icon: "LineChart", subtitle: "تعقیب رتبه، کارنامه و نمودارهای تحلیلی" },
  { id: "mentorPanel", title: "پنل معین‌های ارشد", icon: "Shield", subtitle: "چک‌لیست آنالیز و ارزیابی کلاسی" },
  { id: "media", title: "چندرسانه‌ای و کنجکاوی", icon: "FlaskConical", subtitle: "پخش زنده، پادکست و ایستگاه کنجکاوی" },
];