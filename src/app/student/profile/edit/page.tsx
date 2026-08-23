"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Container from "@/component/Container";
import { 
  User, 
  Lock, 
  Phone, 
  ArrowRight, 
  Save, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  Camera,
  Eye,
  EyeOff,
  ShieldCheck,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const AVATAR_OPTIONS = [
  { id: "avatar-1", imageUrl: "/image/profile/p1.png", label: "پسرانه ۱" },
  { id: "avatar-2", imageUrl: "/image/profile/p2.png", label: "دخترانه ۱" },
  { id: "avatar-3", imageUrl: "/image/profile/p3.png", label: "فضایی" },
  { id: "avatar-4", imageUrl: "/image/profile/p4.png", label: "قهرمان" },
  { id: "avatar-5", imageUrl: "/image/profile/p5.png", label: "متخلف" },
  { id: "avatar-6", imageUrl: "/image/profile/p6.png", label: "ستاره" },
];

export default function EditProfilePage() {
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPhone, setSavingPhone] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const [profileMessage, setProfileMessage] = useState({ success: "", error: "" });
  const [phoneMessage, setPhoneMessage] = useState({ success: "", error: "" });
  const [passwordMessage, setPasswordMessage] = useState({ success: "", error: "" });

  const [name, setName] = useState("");
  // مقدار پیش‌فرض را روی URL اولین عکس تنظیم می‌کنیم
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_OPTIONS[0].imageUrl);
  const [phone, setPhone] = useState("");
  
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/student/dashboard");
        if (res.status === 401) {
          router.replace("/");
          return;
        }
        const json = await res.json();
        if (json.success && json.data) {
          setName(json.data.profile.name || "");
          setPhone(json.data.profile.phone || "");
          if (json.data.profile.avatar) {
            // تنظیم URL دریافت شده از دیتابیس
            setSelectedAvatar(json.data.profile.avatar);
          }
        }
      } catch (err) {
        console.error("Error fetching profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMessage({ success: "", error: "" });
    setSavingProfile(true);

    try {
      const res = await fetch("/api/student/profile/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        // ارسال URL عکس به جای شناسه
        body: JSON.stringify({ name, avatar: selectedAvatar }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setProfileMessage({ success: "اطلاعات پروفایل و آواتار با موفقیت ذخیره شد.", error: "" });
      } else {
        setProfileMessage({ success: "", error: json.message || "خطا در ذخیره اطلاعات." });
      }
    } catch {
      setProfileMessage({ success: "", error: "خطا در ارتباط با سرور." });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleUpdatePhone = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneMessage({ success: "", error: "" });

    if (!/^09\d{9}$/.test(phone)) {
      setPhoneMessage({ success: "", error: "شماره موبایل وارد شده معتبر نیست (مثال: 09123456789)." });
      return;
    }

    setSavingPhone(true);
    try {
      const res = await fetch("/api/student/profile/phone", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setPhoneMessage({ success: "شماره موبایل با موفقیت تغییر کرد.", error: "" });
      } else {
        setPhoneMessage({ success: "", error: json.message || "خطا در تغییر شماره موبایل." });
      }
    } catch {
      setPhoneMessage({ success: "", error: "خطا در ارتباط با سرور." });
    } finally {
      setSavingPhone(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage({ success: "", error: "" });

    if (!currentPassword || !newPassword) {
      setPasswordMessage({ success: "", error: "پر کردن فیلدهای رمز عبور الزامی است." });
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,8}$/;
    if (!passwordRegex.test(newPassword)) {
      setPasswordMessage({ 
        success: "", 
        error: "رمز عبور جدید باید بین ۶ تا ۸ کاراکتر و شامل حروف بزرگ، حروف کوچک و اعداد انگلیسی باشد." 
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ success: "", error: "رمز عبور جدید و تکرار آن مطابقت ندارند." });
      return;
    }

    setSavingPassword(true);
    try {
      const res = await fetch("/api/student/profile/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setPasswordMessage({ success: "رمز عبور با موفقیت تغییر کرد.", error: "" });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setPasswordMessage({ success: "", error: json.message || "خطا در تغییر رمز عبور." });
      }
    } catch {
      setPasswordMessage({ success: "", error: "خطا در ارتباط با سرور." });
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading) {
    return (
      <div dir="rtl" className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // پیدا کردن آواتار فعال بر اساس URL
  const activeAvatarObj = AVATAR_OPTIONS.find(a => a.imageUrl === selectedAvatar) || AVATAR_OPTIONS[0];

  return (
    <Container>
      <div dir="rtl" className="min-h-screen bg-gradient-to-br mt-10 sm:mt-20 from-slate-50 via-blue-50/20 to-slate-100 p-4 sm:p-6 lg:p-8 pb-24 font-[iranBold]">
        <div className="max-w-3xl mx-auto space-y-6">
          
          <div className="flex items-center justify-between bg-white/85 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 shadow-sm">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">ویرایش اطلاعات حساب کاربری</h1>
              <p className="text-xs sm:text-sm text-slate-500 font-[iranSans-r] mt-1">
                اطلاعات شخصی، شماره موبایل و رمز عبور خود را مدیریت کنید.
              </p>
            </div>
            <button
              onClick={() => router.push("/student/dashboard")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold transition-all cursor-pointer"
            >
              <ArrowRight className="w-4 h-4" />
              داشبورد
            </button>
          </div>

          {/* بخش اول: مشخصات و آواتار */}
          <form onSubmit={handleUpdateProfile} className="bg-white/90 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-800 font-extrabold text-sm sm:text-base">
                <Camera className="w-5 h-5 text-blue-600" />
                <span>مشخصات و تصویر پروفایل</span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shadow-sm">
                <img src={activeAvatarObj.imageUrl} alt={activeAvatarObj.label} className="w-full h-full object-cover" />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {AVATAR_OPTIONS.map((avatar) => {
                const isSelected = selectedAvatar === avatar.imageUrl;
                return (
                  <div
                    key={avatar.id}
                    className={`relative flex flex-col items-center justify-between p-3 rounded-2xl transition-all border-2 ${
                      isSelected ? "border-blue-600 bg-blue-50/60 shadow-md" : "border-slate-100 bg-slate-50 hover:bg-slate-100/80"
                    }`}
                  >
                    <div 
                      onClick={() => setPreviewImage(avatar.imageUrl)}
                      className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shadow-sm mb-2 cursor-pointer hover:opacity-90 transition-opacity"
                      title="کلیک برای بزرگ‌نمایی"
                    >
                      <img src={avatar.imageUrl} alt={avatar.label} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-xs text-slate-700 font-bold mb-2">{avatar.label}</span>

                    <button
                      type="button"
                      // ذخیره مستقیم URL عکس در استیت
                      onClick={() => setSelectedAvatar(avatar.imageUrl)}
                      className={`w-full py-1.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        isSelected 
                          ? "bg-blue-600 text-white shadow-sm" 
                          : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      <CheckCircle2 className={`w-3.5 h-3.5 ${isSelected ? "text-white" : "text-slate-400"}`} />
                      <span>{isSelected ? "انتخاب‌شده" : "انتخاب"}</span>
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="space-y-1.5 pt-2">
              <label className="text-xs text-slate-600 font-[iranSans-r] block">نام و نام خانوادگی</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white transition-all font-[iranSans-r]"
              />
            </div>

            {profileMessage.success && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-2xl flex items-center gap-2 text-xs font-[iranSans-r]">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{profileMessage.success}</span>
              </div>
            )}
            {profileMessage.error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-2xl flex items-center gap-2 text-xs font-[iranSans-r]">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{profileMessage.error}</span>
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={savingProfile}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-2xl shadow-md transition-all flex items-center gap-2 font-bold text-xs cursor-pointer disabled:opacity-70"
              >
                {savingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>ذخیره پروفایل</span>
              </button>
            </div>
          </form>

          {/* بخش دوم: تغییر شماره موبایل */}
          <form onSubmit={handleUpdatePhone} className="bg-white/90 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-slate-800 font-extrabold text-sm sm:text-base">
              <Phone className="w-5 h-5 text-blue-600" />
              <span>تغییر شماره موبایل</span>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-slate-600 font-[iranSans-r] block">شماره موبایل جدید</label>
              <input
                type="tel"
                dir="ltr"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                maxLength={11}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-800 text-right focus:outline-none focus:border-blue-600 focus:bg-white transition-all font-mono"
                placeholder="09123456789"
              />
            </div>

            {phoneMessage.success && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-2xl flex items-center gap-2 text-xs font-[iranSans-r]">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{phoneMessage.success}</span>
              </div>
            )}
            {phoneMessage.error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-2xl flex items-center gap-2 text-xs font-[iranSans-r]">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{phoneMessage.error}</span>
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={savingPhone}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-2xl shadow-md transition-all flex items-center gap-2 font-bold text-xs cursor-pointer disabled:opacity-70"
              >
                {savingPhone ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>بروزرسانی موبایل</span>
              </button>
            </div>
          </form>

          {/* بخش سوم: تغییر رمز عبور */}
          <form onSubmit={handleUpdatePassword} className="bg-white/90 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-slate-800 font-extrabold text-sm sm:text-base">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              <span>تغییر رمز عبور</span>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs text-slate-600 font-[iranSans-r] block">رمز عبور فعلی</label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    dir="ltr"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-sm text-slate-800 text-right focus:outline-none focus:border-blue-600 focus:bg-white transition-all font-mono"
                    placeholder="••••••••"
                  />
                  <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute left-3.5 top-3.5 text-slate-400 cursor-pointer">
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-slate-600 font-[iranSans-r] block">رمز عبور جدید</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      dir="ltr"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-sm text-slate-800 text-right focus:outline-none focus:border-blue-600 focus:bg-white transition-all font-mono"
                      placeholder="••••••••"
                    />
                    <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute left-3.5 top-3.5 text-slate-400 cursor-pointer">
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <span className="text-[10px] text-slate-400 font-[iranSans-r] block mt-1">
                    ۶ الی ۸ کاراکتر شامل حروف بزرگ، کوچک و عدد
                  </span>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-600 font-[iranSans-r] block">تکرار رمز عبور جدید</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      dir="ltr"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-sm text-slate-800 text-right focus:outline-none focus:border-blue-600 focus:bg-white transition-all font-mono"
                      placeholder="••••••••"
                    />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute left-3.5 top-3.5 text-slate-400 cursor-pointer">
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {passwordMessage.success && (
              <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-2xl flex items-center gap-2 text-xs font-[iranSans-r]">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{passwordMessage.success}</span>
              </motion.div>
            )}
            {passwordMessage.error && (
              <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-2xl flex items-center gap-2 text-xs font-[iranSans-r]">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{passwordMessage.error}</span>
              </motion.div>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={savingPassword}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-2xl shadow-md transition-all flex items-center gap-2 font-bold text-xs cursor-pointer disabled:opacity-70"
              >
                {savingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                <span>ثبت و تغییر رمز عبور</span>
              </button>
            </div>
          </form>

        </div>
      </div>

      {/* مودال بزرگ‌نمایی تصویر (Preview Modal) */}
      <AnimatePresence>
        {previewImage && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={() => setPreviewImage(null)}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9 }} 
              animate={{ scale: 1 }} 
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white p-4 rounded-3xl shadow-2xl max-w-sm w-full flex flex-col items-center"
            >
              <button 
                onClick={() => setPreviewImage(null)}
                className="absolute top-3 left-3 bg-slate-100 hover:bg-slate-200 p-2 rounded-full text-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="w-48 h-48 rounded-2xl overflow-hidden shadow-inner border border-slate-100 mt-4 mb-2">
                <img src={previewImage} alt="Large Preview" className="w-full h-full object-cover" />
              </div>
              <p className="text-xs text-slate-500 font-bold">پیش‌نمایش آواتار</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Container>
  );
}