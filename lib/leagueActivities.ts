export interface ActivityItem {
  id: string;
  category: string;
  title: string;
  score: number;
}

export const LEAGUE_ACTIVITIES: ActivityItem[] = [
  // ۱. حضور در کلاس
  { id: "att_1", category: "۱. حضور در کلاس", title: "حضور کامل", score: 10 },
  { id: "att_2", category: "۱. حضور در کلاس", title: "حضور همراه با مشارکت مناسب", score: 15 },
  { id: "att_3", category: "۱. حضور در کلاس", title: "حضور کامل در تمام کلاس‌های ماهانه", score: 20 },

  // ۲. فعالیت کلاسی
  { id: "cls_1", category: "۲. فعالیت کلاسی", title: "پاسخ به سؤال استاد", score: 10 },
  { id: "cls_2", category: "۲. فعالیت کلاسی", title: "حل تمرین در کلاس", score: 15 },
  { id: "cls_3", category: "۲. فعالیت کلاسی", title: "مشارکت گروهی", score: 10 },
  { id: "cls_4", category: "۲. فعالیت کلاسی", title: "فعالیت مؤثر در کلاس", score: 10 },

  // ۳. انجام تکالیف
  { id: "hw_1", category: "۳. انجام تکالیف", title: "انجام کامل تکلیف", score: 20 },
  { id: "hw_2", category: "۳. انجام تکالیف", title: "انجام دقیق و ارائه در کلاس", score: 30 },

  // ۴. شرکت در آزمون
  { id: "exam_1", category: "۴. شرکت در آزمون", title: "شرکت در آزمون", score: 30 },

  // ۵. امتیاز میانگین درصد آزمون
  { id: "avg_1", category: "۵. امتیاز میانگین درصد آزمون", title: "زیر ۱۵٪", score: 20 },
  { id: "avg_2", category: "۵. امتیاز میانگین درصد آزمون", title: "۱۵ تا ۳۰٪", score: 40 },
  { id: "avg_3", category: "۵. امتیاز میانگین درصد آزمون", title: "۳۰ تا ۴۵٪", score: 60 },
  { id: "avg_4", category: "۵. امتیاز میانگین درصد آزمون", title: "۴۵ تا ۶۰٪", score: 80 },
  { id: "avg_5", category: "۵. امتیاز میانگین درصد آزمون", title: "۶۰ تا ۷۵٪", score: 120 },
  { id: "avg_6", category: "۵. امتیاز میانگین درصد آزمون", title: "۷۵ تا ۹۰٪", score: 150 },
  { id: "avg_7", category: "۵. امتیاز میانگین درصد آزمون", title: "۹۰ تا ۱۰۰٪", score: 200 },

  // ۶. پیشرفت آزمون
  { id: "prog_1", category: "۶. پیشرفت آزمون", title: "هر ۱۰٪ پیشرفت نسبت به آزمون قبل", score: 20 },

  // ۷. فعالیت‌های علمی و پژوهشی
  { id: "res_1", category: "۷. فعالیت‌های علمی و پژوهشی", title: "انجام آزمایش علمی", score: 100 },
  { id: "res_2", category: "۷. فعالیت‌های علمی و پژوهشی", title: "ساخت پروژه علمی", score: 100 },
  { id: "res_3", category: "۷. فعالیت‌های علمی و پژوهشی", title: "روزنامه دیواری علمی", score: 80 },
  { id: "res_4", category: "۷. فعالیت‌های علمی و پژوهشی", title: "تحقیق علمی (سطح ۱)", score: 80 },
  { id: "res_5", category: "۷. فعالیت‌های علمی و پژوهشی", title: "تحقیق علمی (سطح ۲)", score: 150 },
  { id: "res_6", category: "۷. فعالیت‌های علمی و پژوهشی", title: "پروژه ویژه علمی", score: 150 },

  // ۸. فعالیت آموزشی آنلاین
  { id: "online_1", category: "۸. فعالیت آموزشی آنلاین", title: "مشاهده هر ویدئوی آموزشی", score: 10 },
  { id: "online_2", category: "۸. فعالیت آموزشی آنلاین", title: "پاسخ به تمرین ویدیویی", score: 15 },

  // ۹. برنامه ویژه امتحانات
  { id: "ex_sp_1", category: "۹. برنامه ویژه امتحانات", title: "حضور در برنامه ویژه امتحانات", score: 80 },

  // ۱۰. امتیازهای ویژه
  { id: "sp_1", category: "۱۰. امتیازهای ویژه", title: "کسب درصد بالای ۶۰ در ریاضی", score: 50 },
  { id: "sp_2", category: "۱۰. امتیازهای ویژه", title: "کسب درصد بالای ۸۰ در علوم", score: 70 },
  { id: "sp_3", category: "۱۰. امتیازهای ویژه", title: "سه آزمون متوالی بدون غیبت", score: 100 },
  { id: "sp_4", category: "۱۰. امتیازهای ویژه", title: "پیشرفت بیش از ۳۰٪ (میانگین کل دروس)", score: 150 },

  // ۱۱. فعالیت‌های کتابخانه
  { id: "lib_1", category: "📚 فعالیت‌های کتابخانه", title: "حضور در هر جلسه کتابخانه", score: 10 },
  { id: "lib_2", category: "📚 فعالیت‌های کتابخانه", title: "حضور مستمر و منظم در تمام جلسات ماه", score: 50 },
  { id: "lib_3", category: "📚 فعالیت‌های کتابخانه", title: "امانت گرفتن و مطالعه یک کتاب", score: 30 },
  { id: "lib_4", category: "📚 فعالیت‌های کتابخانه", title: "ارائه خلاصه یا معرفی کتاب", score: 60 },
  { id: "lib_5", category: "📚 فعالیت‌های کتابخانه", title: "معرفی یک کتاب مفید به سایر دانش‌آموزان", score: 40 },
  { id: "lib_6", category: "📚 فعالیت‌های کتابخانه", title: "شرکت در مسابقه کتابخوانی", score: 30 },
  { id: "lib_7", category: "📚 فعالیت‌های کتابخانه", title: "مقام سوم مسابقه کتابخوانی", score: 100 },
  { id: "lib_8", category: "📚 فعالیت‌های کتابخانه", title: "مقام دوم مسابقه کتابخوانی", score: 120 },
  { id: "lib_9", category: "📚 فعالیت‌های کتابخانه", title: "مقام اول مسابقه کتابخوانی", score: 150 },

  // ۱۲. چالش‌های ویژه کتابخانه
  { id: "lib_ch_1", category: "🌟 چالش‌های ویژه کتابخانه", title: "چالش «راوی کتاب»", score: 80 },
  { id: "lib_ch_2", category: "🌟 چالش‌های ویژه کتابخانه", title: "چالش «سفیر مطالعه»", score: 70 },
  { id: "lib_ch_3", category: "🌟 چالش‌های ویژه کتابخانه", title: "نشان «سفیر مطالعه»", score: 100 },

  // ۱۳. کارت‌های جهش علمی
  { id: "card_1", category: "💠 کارت‌های جهش علمی", title: "کارت جهش طلایی (امتیاز آزمون بعدی ×۲)", score: 100 },
  { id: "card_2", category: "💠 کارت‌های جهش علمی", title: "کارت فرصت دوباره (بخشش یک غیبت یا نمره منفی)", score: 50 },
  { id: "card_3", category: "💠 کارت‌های جهش علمی", title: "کارت شتاب علمی (+۸۰ امتیاز)", score: 80 },
  { id: "card_4", category: "💠 کارت‌های جهش علمی", title: "کارت انفجار علمی (امتیاز پروژه/آزمایش ×۲)", score: 150 },

  // ۱۴. چالش‌های علمی
  { id: "sci_ch_1", category: "🚀 چالش‌های علمی", title: "چالش رسانه علمی (سطح ۱)", score: 120 },
  { id: "sci_ch_2", category: "🚀 چالش‌های علمی", title: "چالش رسانه علمی (سطح ۲)", score: 180 },
  { id: "sci_ch_3", category: "🚀 چالش‌های علمی", title: "چالش آزمایشگر برتر (سطح ۱)", score: 150 },
  { id: "sci_ch_4", category: "🚀 چالش‌های علمی", title: "چالش آزمایشگر برتر (سطح ۲)", score: 200 },
  { id: "sci_ch_5", category: "🚀 چالش‌های علمی", title: "چالش رشد رفیق", score: 150 },

  // ۱۵. امتیاز اثرگذاری
  { id: "imp_1", category: "🤝 امتیاز اثرگذاری", title: "کمک به همکلاسی در حل تمرین", score: 30 },
  { id: "imp_2", category: "🤝 امتیاز اثرگذاری", title: "آموزش درس به دیگران", score: 50 },
  { id: "imp_3", category: "🤝 امتیاز اثرگذاری", title: "کمک به رشد درصد آزمون دوست", score: 150 },
  { id: "imp_4", category: "🤝 امتیاز اثرگذاری", title: "کمک به دانش‌آموز ضعیف", score: 70 },
  { id: "imp_5", category: "🤝 امتیاز اثرگذاری", title: "همکاری مؤثر در کلاس و کار گروهی", score: 40 },

  // ۱۶. نشان‌های ویژه
  { id: "badge_1", category: "🏅 نشان‌های ویژه", title: "نشان ویژه معین علمی", score: 100 },
  { id: "badge_2", category: "🏅 نشان‌های ویژه", title: "نشان شایستگی", score: 200 },

  // ۱۷. کسر امتیاز
  { id: "neg_1", category: "❌ کسر امتیاز", title: "نیاوردن تکلیف", score: -15 },
  { id: "neg_2", category: "❌ کسر امتیاز", title: "عدم شرکت در آزمون بدون هماهنگی", score: -40 },
  { id: "neg_3", category: "❌ کسر امتیاز", title: "بی‌نظمی در کلاس", score: -20 },
  { id: "neg_4", category: "❌ کسر امتیاز", title: "بی‌احترامی", score: -60 },
  { id: "neg_5", category: "❌ کسر امتیاز", title: "عدم مشارکت مکرر", score: -15 },
  { id: "neg_6", category: "❌ کسر امتیاز", title: "عدم حضور در برنامه ویژه امتحانات", score: -25 },
  { id: "neg_7", category: "❌ کسر امتیاز", title: "ثبت فعالیت غیرواقعی", score: -50 },
  { id: "neg_8", category: "❌ کسر امتیاز", title: "تقلب در آزمون یا پروژه", score: -100 },
];

export function calculateTotalScore(selectedIds: string[]): number {
  return selectedIds.reduce((sum, id) => {
    const act = LEAGUE_ACTIVITIES.find((a) => a.id === id);
    return sum + (act ? act.score : 0);
  }, 0);
}