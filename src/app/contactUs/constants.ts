// Types and constants
export interface ContactFormData {
  name: string;
  grade: string;
  subject: string;
  phone: string;
  message: string;
}

export const subjects = [
  "دوره‌های آموزشی",
  "لیگ نخبگان",
  "گفتینو",
  "مشاوره تحصیلی",
  "اشکالات درسی",
  "انتقادات و پیشنهادات",
  "سایر",
];

export const grades = [
  "پایه دوم",
  "پایه سوم",
  "پایه چهارم",
  "پایه پنجم",
  "پایه ششم",
  "پایه هفتم",
  "پایه هشتم",
  "پایه نهم",
  "پایه دهم",
  "پایه یازدهم",
  "پایه دوازدهم",
  "دانشگاهی",
];

export const socialLinks = {
  rubika: "https://rubika.ir/elmiMontazeran",
  aparat: "https://www.aparat.com/elmiMontazeran",
  support: "@Admin_elmi",
};

// Validate phone number
export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^09[0-9]{9}$/;
  return phoneRegex.test(phone);
};