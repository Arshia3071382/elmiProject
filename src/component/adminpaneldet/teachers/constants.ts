// Types and constants
export interface Course {
  title: string;
  url: string;
}

export interface Teacher {
  _id: string;
  name: string;
  role: string;
  subject: string;
  avatar: string;
  bio: string;
  education: string;
  articlesCount: number;
  experienceYears: number;
  recentTopics: string[];
  teachingSampleUrl: string;
  courses: Course[];
  email: string;
}

export interface TeacherFormData {
  name: string;
  role: string;
  subject: string;
  avatar: string;
  bio: string;
  education: string;
  articlesCount: number;
  experienceYears: number;
  recentTopics: string;
  teachingSampleUrl: string;
  email: string;
}

// Initial form state
export const getInitialFormState = (): TeacherFormData => ({
  name: "",
  role: "",
  subject: "",
  avatar: "",
  bio: "",
  education: "",
  articlesCount: 0,
  experienceYears: 0,
  recentTopics: "",
  teachingSampleUrl: "",
  email: "",
});