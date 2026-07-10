"use client";

import { useState, useEffect, useCallback } from "react";
import { LogOut } from "lucide-react";
import StatsCards from "./../../component/adminpaneldet/StatsCards";
import AddCourseForm from "./../../component/adminpaneldet/AddCourseForm";
import CourseManager from "./../../component/adminpaneldet/CourseManager";
import CategoryManager from "./../../component/adminpaneldet/CategoryManager";
// کامپوننت‌های کمکی جدید که در ادامه قرار داده شده‌اند:
import AdminSidebar from "./../../component/adminpaneldet/AdminSidebar";
import AdminLoginModal from "./../../component/adminpaneldet/AdminLoginModal";
import AddCategoryModal from "./../../component/adminpaneldet/AddCategoryModal";

export default function AdminPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [contactMessages, setContactMessages] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [activeTab, setActiveTab] = useState<"courses" | "categories">("courses");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const showMessage = useCallback((type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  }, []);

  const fetchCategories = useCallback(async () => {
    const res = await fetch("/api/categories").then(r => r.json()).catch(() => showMessage("error", "خطا در دریافت گروه‌ها"));
    if (res?.success) {
      setCategories(res.categories);
      if (res.categories.length > 0 && !selectedCategory) setSelectedCategory(res.categories[0]._id);
    }
  }, [selectedCategory, showMessage]);

  const fetchCourses = useCallback(async () => {
    const res = await fetch("/api/courses").then(r => r.json()).catch(() => showMessage("error", "خطا در دریافت دوره‌ها"));
    if (res?.success) setCourses(res.courses);
  }, [showMessage]);

  const fetchContactMessages = useCallback(async () => {
    const res = await fetch("/api/contacts").then(r => r.json()).catch(console.error);
    if (res?.success) setContactMessages(res.messages);
  }, []);

  useEffect(() => {
    fetch("/api/check-auth").then(r => r.json()).then(data => {
      if (data?.isLoggedIn) {
        setIsLoggedIn(true);
        fetchCategories(); fetchCourses(); fetchContactMessages();
      }
    }).catch(console.error).finally(() => setIsCheckingAuth(false));
  }, [fetchCategories, fetchCourses, fetchContactMessages]);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return showMessage("error", "لطفاً نام گروه را وارد کنید");
    const res = await fetch("/api/categories", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: newCategoryName.trim() }) }).then(r => r.json()).catch(() => showMessage("error", "خطا در ارتباط با سرور"));
    if (res?.success) {
      showMessage("success", `گروه "${newCategoryName}" با موفقیت اضافه شد`);
      setCategories(prev => [res.category, ...prev]);
      setSelectedCategory(res.category._id);
      setShowCategoryModal(false);
      setNewCategoryName("");
    }
  };

  const handleAddCourse = async (formData: FormData) => {
    if (!selectedCategory) return showMessage("error", "لطفاً یک گروه انتخاب کنید"), false;
    formData.set("categoryId", selectedCategory);
    const res = await fetch("/api/courses", { method: "POST", body: formData }).then(r => r.json()).catch(() => showMessage("error", "خطا در ارتباط با سرور"));
    if (res?.success) return showMessage("success", `دوره با موفقیت اضافه شد`), fetchCourses(), true;
    return false;
  };

  const handleLogout = async () => {
    await fetch("/api/admin-logout", { method: "POST" }).then(() => { setIsLoggedIn(false); }).catch(() => showMessage("error", "خطا در خروج از پنل"));
  };

  if (isCheckingAuth) return <div className="min-h-screen bg-white"></div>;
  if (!isLoggedIn) return <AdminLoginModal onLoginSuccess={() => window.location.reload()} />;

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-sans">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white pt-12 pb-12 shadow-sm px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-start">
          <div><h1 className="text-3xl font-black mb-2">پنل مدیریت دوره‌ها</h1><p className="text-blue-100">مدیریت مستقیم گروه‌ها و دوره‌های آموزشی علمی منتظران</p></div>
          <button onClick={handleLogout} className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition shadow-lg"><LogOut className="w-5 h-5" /> خروج از پنل</button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex border-b border-gray-200">
            <button onClick={() => setActiveTab("courses")} className={`px-6 py-4 font-bold text-base ${activeTab === "courses" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}>مدیریت دوره‌ها</button>
            <button onClick={() => setActiveTab("categories")} className={`px-6 py-4 font-bold text-base ${activeTab === "categories" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}>مدیریت گروه‌ها</button>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            {activeTab === "courses" ? (
              <><AddCourseForm categories={categories} selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} onAddCourse={handleAddCourse} coursesCount={id => courses.filter(c => c.category?._id === id).length} /><CourseManager courses={courses} categories={categories} onCourseUpdate={fetchCourses} onShowMessage={showMessage} /></>
            ) : (
              <CategoryManager categories={categories} coursesCount={id => courses.filter(c => c.category?._id === id).length} onCategoryUpdate={() => { fetchCategories(); fetchCourses(); }} onShowMessage={showMessage} onOpenAddModal={() => setShowCategoryModal(true)} />
            )}
          </div>
        </div>
        <div className="space-y-6">
          <StatsCards categoriesCount={categories.length} coursesCount={courses.length} averageCourses={categories.length ? Number((courses.length / categories.length).toFixed(1)) : 0} />
          <AdminSidebar courses={courses} contactMessages={contactMessages} />
        </div>
      </div>
      {message && <div className={`fixed bottom-6 right-6 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg z-50 text-white font-bold text-sm ${message.type === "success" ? "bg-green-600" : "bg-red-600"}`}>{message.text}</div>}
      <AddCategoryModal isOpen={showCategoryModal} onClose={() => setShowCategoryModal(false)} onSubmit={handleAddCategory} name={newCategoryName} onNameChange={setNewCategoryName} />
    </div>
  );
}