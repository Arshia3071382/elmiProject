'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface BorhanMember {
  _id: string;
  role: 'teacher' | 'student';
  fullName: string;
  phone: string;
  job?: string;
  teachingExperience?: string;
  honors?: string;
  background?: string;
  grade?: string;
  school?: string;
  interests?: string;
  createdAt: string;
}

export default function BorhanPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [role, setRole] = useState<'teacher' | 'student' | null>(null);
  const [step, setStep] = useState<number>(1); // ۱: انتخاب نقش / اطلاعات پایه، ۲: اطلاعات تخصصی
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    job: '',
    teachingExperience: '',
    honors: '',
    background: '',
    grade: '',
    school: '',
    interests: '',
  });
  
  // ارور مسیج‌ها برای هر فیلد
  const [errors, setErrors] = useState({
    fullName: '',
    phone: '',
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  // نمای ادمین
  const [isAdminView, setIsAdminView] = useState(false);
  const [members, setMembers] = useState<BorhanMember[]>([]);
  const [adminLoading, setAdminLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.pathname.includes('/admin')) {
      setIsAdminView(true);
      fetchMembers();
    }
  }, []);

  const fetchMembers = async () => {
    setAdminLoading(true);
    try {
      const res = await fetch('/api/borhan-team');
      const data = await res.json();
      if (data.success) {
        setMembers(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAdminLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // پاک کردن ارور به‌محض تایپ کاربر
    if (errors[name as keyof typeof errors]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  // اعتبارسنجی گام اول
  const handleNextStep = () => {
    let newErrors = { fullName: '', phone: '' };
    let isValid = true;

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'لطفاً نام و نام خانوادگی خود را وارد کنید.';
      isValid = false;
    }

    // بررسی شماره موبایل ایران (۱۱ رقم و شروع با 09)
    const phoneRegex = /^09\d{9}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = 'شماره تماس الزامی است.';
      isValid = false;
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = 'فرمت شماره تماس معتبر نیست (مثال: 09123456789).';
      isValid = false;
    }

    setErrors(newErrors);

    if (isValid) {
      setStep(2);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/borhan-team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, ...formData }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMessage(true);
      } else {
        alert(data.message || 'خطایی رخ داد.');
      }
    } catch (err) {
      console.error(err);
      alert('خطا در اتصال به سرور');
    } finally {
      setLoading(false);
    }
  };

  const resetModal = () => {
    setIsModalOpen(false);
    setRole(null);
    setStep(1);
    setFormData({ fullName: '', phone: '', job: '', teachingExperience: '', honors: '', background: '', grade: '', school: '', interests: '' });
    setErrors({ fullName: '', phone: '' });
    setSuccessMessage(false);
  };

  // نمای ادمین
  if (isAdminView) {
    if (adminLoading) return <div className="p-6 text-center text-gray-500 font-bold" dir="rtl">در حال بارگذاری اطلاعات تیم برهان...</div>;

    return (
      <div className="space-y-6" dir="rtl">
        <div className="flex justify-between items-center border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-2xl font-black text-[#1F3A5F]">مدیریت تیم برهان</h2>
            <p className="text-sm text-gray-500 mt-1">اعلام آمادگی مدرسان و دانش‌آموزان برای حضور در پروژه بزرگ علمی</p>
          </div>
          <button 
            onClick={fetchMembers}
            className="px-4 py-2 bg-blue-50 text-[#2563EB] rounded-xl font-bold text-sm hover:bg-blue-100 transition cursor-pointer"
          >
            بروزرسانی لیست
          </button>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-gray-50 text-[#475569] text-xs sm:text-sm font-bold">
                <th className="p-4">نقش</th>
                <th className="p-4">نام و نام خانوادگی</th>
                <th className="p-4">شماره تماس</th>
                <th className="p-4">شغل / پایه تحصیلی</th>
                <th className="p-4">سوابق / توضیحات</th>
                <th className="p-4">تاریخ ثبت‌نام</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs sm:text-sm">
              {members.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-400">هنوز درخواستی ثبت نشده است.</td>
                </tr>
              ) : (
                members.map((m) => (
                  <tr key={m._id} className="hover:bg-gray-50/80 transition">
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-black ${m.role === 'teacher' ? 'bg-blue-50 text-[#2563EB] border border-blue-200' : 'bg-indigo-50 text-indigo-700 border border-indigo-200'}`}>
                        {m.role === 'teacher' ? '👨‍🏫 مربی فیزیک' : '🎓 دانش‌آموز'}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-[#0F172A]">{m.fullName}</td>
                    <td className="p-4 text-gray-600 font-mono" dir="ltr">{m.phone}</td>
                    <td className="p-4 text-gray-700 font-medium">{m.job || m.grade || '-'}</td>
                    <td className="p-4 text-gray-500 max-w-xs truncate">{m.background || m.interests || m.honors || '-'}</td>
                    <td className="p-4 text-gray-400 text-xs font-mono">{new Date(m.createdAt).toLocaleDateString('fa-IR')}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // صفحه اصلی برهان
  return (
    <div className="relative min-h-screen bg-[#F8FAFC] text-[#0F172A] overflow-hidden font-sans" dir="rtl">
      
      {/* هاله‌ها و افکت کهکشانی روی بک‌گراند سفید */}
      <div className="absolute top-[-100px] right-[-100px] w-[500px] h-[500px] bg-sky-400/20 rounded-full blur-[120px] pointer-events-none animate-float-glow" />
      <div className="absolute bottom-[-100px] left-[-100px] w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none animate-float-glow" />
      <div className="absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-indigo-400/10 rounded-full blur-[160px] pointer-events-none" />

      {/* خطوط مداری فیزیکی */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-25">
        <div className="w-[600px] h-[600px] border border-sky-300 rounded-full animate-orbit border-dashed" />
        <div className="w-[900px] h-[900px] border border-blue-200 rounded-full animate-orbit border-dashed absolute" />
      </div>

      {/* شهاب‌سنگ‌های متحرک */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-12 right-20 w-32 h-[2px] bg-gradient-to-l from-transparent via-sky-400 to-transparent meteor-1 opacity-75" />
        <div className="absolute top-1/3 right-10 w-48 h-[2px] bg-gradient-to-l from-transparent via-blue-500 to-transparent meteor-2 opacity-75" />
        <div className="absolute top-2/3 right-1/4 w-40 h-[2px] bg-gradient-to-l from-transparent via-purple-400 to-transparent meteor-3 opacity-75" />
      </div>

      {/* واترمارک موشک‌ها */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04] z-0 flex flex-wrap justify-around items-center select-none">
        <span className="text-9xl">🚀</span>
        <span className="text-8xl">⚛️</span>
        <span className="text-9xl">🚀</span>
        <span className="text-8xl">🪐</span>
        <span className="text-9xl">🚀</span>
        <span className="text-8xl">⚡</span>
      </div>

      {/* Hero Section */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 py-20 flex flex-col items-center text-center">
        
        <div className="mb-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/80 backdrop-blur-md border border-sky-200 text-[#2563EB] text-sm font-black shadow-sm">
          <span className="animate-pulse">⚡</span>
          <span>پروژه بزرگ علمی برهان</span>
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-tight mb-8">
          جایی که فرمول‌ها به <span className="aurora-text">پرواز</span> درمی‌آیند!
        </h1>

        <p className="max-w-3xl text-lg md:text-2xl text-[#475569] leading-relaxed mb-12 font-medium">
          دوست عزیز فیزیک‌دان؛ چه معلمی مشتاق کهکشانی از ایده‌ها باشی، و چه دانش‌آموزی که ستاره‌ها را نشانه گرفته‌است، تیم «برهان» قراره یک تحول بزرگ و بی‌نظیر رو رقم بزنه. ما داریم فضایی می‌سازیم که فیزیک رو نه روی کاغذ، بلکه با تمام وجود لمس کنی. آماده‌ایم تا با هم دنیای علم رو متحول کنیم؟
        </p>

        {/* گالری تصاویر */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl mb-16">
          <div className="relative h-64 rounded-3xl overflow-hidden shadow-xl border-4 border-white hover:scale-105 hover:shadow-2xl transition-all duration-300">
            <Image src="/image/borhan/hero13.jpg" alt="برهان ۱" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
          <div className="relative h-64 rounded-3xl overflow-hidden shadow-xl border-4 border-white hover:scale-105 hover:shadow-2xl transition-all duration-300 sm:-translate-y-4">
            <Image src="/image/borhan/n1.png" alt="برهان ۲" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
          <div className="relative h-64 rounded-3xl overflow-hidden shadow-xl border-4 border-white hover:scale-105 hover:shadow-2xl transition-all duration-300">
            <Image src="/image/borhan/hero12.png" alt="برهان ۳" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="relative group px-10 py-5 bg-gradient-to-r from-[#1F3A5F] via-[#2563EB] to-[#38BDF8] text-white text-xl font-black rounded-2xl shadow-xl hover:shadow-blue-500/30 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-4 cursor-pointer overflow-hidden"
        >
          <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          <span className="relative text-2xl animate-bounce">🚀</span>
          <span className="relative">اعلام آمادگی برای حضور در تیم برهان</span>
        </button>
      </div>

      {/* مودال چندمرحله‌ای راست‌به‌چپ (RTL) با نوار پیشرفت و ارور مسیج */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-md p-4" dir="rtl">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-lg w-full p-8 relative border border-white/50 animate-in fade-in zoom-in duration-200">
            
            {/* دکمه بستن (ضربدر در سمت چپ بالا) */}
            <button
              onClick={resetModal}
              className="absolute top-5 left-5 text-gray-400 hover:text-gray-700 text-2xl font-bold cursor-pointer transition-colors"
            >
              ✕
            </button>

            {successMessage ? (
              <div className="text-center py-8 animate-in fade-in zoom-in duration-300">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-4 shadow-inner">
                  ✨
                </div>
                <h3 className="text-2xl font-black text-[#0F172A] mb-2">درخواست شما با موفقیت ثبت شد!</h3>
                <p className="text-[#475569] mb-8 font-medium leading-relaxed px-4">
                  به زودی از طریق <span className="text-[#2563EB] font-bold">پیامک</span> اطلاع‌رسانی‌های لازم جهت آغاز پرواز علمی برای شما ارسال خواهد شد.
                </p>
                <button
                  onClick={resetModal}
                  className="px-8 py-3.5 bg-gradient-to-r from-[#2563EB] to-[#38BDF8] text-white rounded-xl font-bold hover:opacity-95 transition cursor-pointer shadow-lg shadow-blue-500/20"
                >
                  متوجه شدم، بازگشت به سایت
                </button>
              </div>
            ) : (
              <div>
                {/* مرحله صفر: انتخاب نقش */}
                {!role && (
                  <div className="animate-in fade-in duration-200">
                    <div className="text-center mb-8">
                      <span className="text-3xl mb-2 inline-block">🪐</span>
                      <h3 className="text-2xl font-black text-[#0F172A]">به تیم کهکشانی برهان خوش آمدید</h3>
                      <p className="text-gray-500 text-sm mt-1">لطفاً برای شروع سفر، جایگاه خود را انتخاب کنید:</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <button
                        onClick={() => { setRole('student'); setStep(1); }}
                        className="p-6 rounded-2xl border-2 border-indigo-100 bg-indigo-50/20 hover:border-indigo-600 hover:bg-indigo-50/80 flex flex-col items-center gap-3 transition group cursor-pointer shadow-sm hover:shadow-md"
                      >
                        <span className="text-5xl group-hover:scale-110 transition-transform">🎓</span>
                        <span className="font-black text-[#0F172A] text-lg">دانش‌آموز</span>
                        <span className="text-xs text-gray-500 text-center">مشتاق کشف دنیاهای جدید فیزیک</span>
                      </button>

                      <button
                        onClick={() => { setRole('teacher'); setStep(1); }}
                        className="p-6 rounded-2xl border-2 border-sky-100 bg-sky-50/20 hover:border-[#2563EB] hover:bg-sky-50/80 flex flex-col items-center gap-3 transition group cursor-pointer shadow-sm hover:shadow-md"
                      >
                        <span className="text-5xl group-hover:scale-110 transition-transform">👨‍🏫</span>
                        <span className="font-black text-[#0F172A] text-lg">مربی / مدرس</span>
                        <span className="text-xs text-gray-500 text-center">راهبر و هدایت‌گر ستاره‌های آینده</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* فرم مرحله‌به‌مرحله */}
                {role && (
                  <form onSubmit={handleSubmit} className="animate-in fade-in duration-200">
                    <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-4">
                      <div>
                        <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wider">
                          {role === 'teacher' ? 'مربی فیزیک' : 'دانش‌آموز'}
                        </span>
                        <h3 className="text-xl font-black text-[#0F172A] mt-0.5">
                          {step === 1 ? 'اطلاعات ارتباطی اولیه' : 'جزئیات تخصصی و انگیزشی'}
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => { setRole(null); setStep(1); setErrors({ fullName: '', phone: '' }); }}
                        className="text-xs font-bold text-gray-400 hover:text-[#2563EB] transition cursor-pointer bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100"
                      >
                        تغییر نقش
                      </button>
                    </div>

                    {/* 📊 نوار پیشرفت (Progress Bar) */}
                    <div className="mb-6">
                      <div className="flex justify-between text-xs font-bold text-gray-400 mb-1.5">
                        <span>مرحله {step} از ۲</span>
                        <span>{step === 1 ? '۵۰٪ پیشرفت' : '۱۰۰٪ تکمیل'}</span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full bg-gradient-to-r from-[#2563EB] to-[#38BDF8] transition-all duration-300 ${
                            step === 1 ? 'w-1/2' : 'w-full'
                          }`}
                        />
                      </div>
                    </div>

                    {/* گام اول: نام و شماره تماس به همراه ارور مسیج */}
                    {step === 1 && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-bold text-[#0F172A] mb-1.5">نام و نام خانوادگی</label>
                          <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 rounded-xl border focus:outline-none bg-white font-medium transition ${
                              errors.fullName ? 'border-red-500 focus:ring-2 focus:ring-red-200' : 'border-gray-200 focus:ring-2 focus:ring-[#2563EB]'
                            }`}
                            placeholder="مثال: پارسا رادمنش"
                          />
                          {errors.fullName && (
                            <p className="text-red-500 text-xs font-bold mt-1.5 flex items-center gap-1">
                              <span>⚠️</span> {errors.fullName}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-[#0F172A] mb-1.5">شماره تماس (جهت دریافت پیامک)</label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 rounded-xl border focus:outline-none bg-white font-mono transition ${
                              errors.phone ? 'border-red-500 focus:ring-2 focus:ring-red-200' : 'border-gray-200 focus:ring-2 focus:ring-[#2563EB]'
                            }`}
                            placeholder="09123456789"
                            dir="ltr"
                          />
                          {errors.phone && (
                            <p className="text-red-500 text-xs font-bold mt-1.5 flex items-center gap-1">
                              <span>⚠️</span> {errors.phone}
                            </p>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={handleNextStep}
                          className="w-full mt-6 py-4 bg-gradient-to-r from-[#1F3A5F] to-[#2563EB] text-white font-black rounded-xl hover:opacity-95 transition cursor-pointer shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
                        >
                          <span>مرحله بعد و تکمیل اطلاعات</span>
                          <span>←</span>
                        </button>
                      </div>
                    )}

                    {/* گام دوم: فیلدهای تخصصی مربی */}
                    {step === 2 && role === 'teacher' && (
                      <div className="space-y-4 max-h-[50vh] overflow-y-auto px-1 custom-scrollbar">
                        <div>
                          <label className="block text-sm font-bold text-[#0F172A] mb-1">شغل یا تخصص اصلی</label>
                          <input
                            type="text"
                            name="job"
                            value={formData.job}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#2563EB] focus:outline-none bg-white"
                            placeholder="مثال: مدرس فیزیک کنکور و المپیاد"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-[#0F172A] mb-1">میزان سابقه تدریس</label>
                          <input
                            type="text"
                            name="teachingExperience"
                            value={formData.teachingExperience}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#2563EB] focus:outline-none bg-white"
                            placeholder="مثال: ۸ سال سابقه..."
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-[#0F172A] mb-1">عناوین، تألیفات و افتخارات</label>
                          <input
                            type="text"
                            name="honors"
                            value={formData.honors}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#2563EB] focus:outline-none bg-white"
                            placeholder="مثال: مؤلف کتاب فیزیک..."
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-[#0F172A] mb-1">توضیح کوتاه درباره سوابق</label>
                          <textarea
                            name="background"
                            rows={2}
                            value={formData.background}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#2563EB] focus:outline-none resize-none bg-white"
                            placeholder="خلاصه‌ای از فعالیت‌های علمی..."
                          />
                        </div>
                        <div className="flex gap-3 pt-2">
                          <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="w-1/3 py-3.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition cursor-pointer"
                          >
                            بازگشت
                          </button>
                          <button
                            type="submit"
                            disabled={loading}
                            className="w-2/3 py-3.5 bg-gradient-to-r from-[#2563EB] to-[#38BDF8] text-white font-black rounded-xl hover:opacity-95 transition cursor-pointer shadow-lg shadow-blue-500/20"
                          >
                            {loading ? 'در حال ثبت نهایی...' : 'ثبت درخواست نهایی 🚀'}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* گام دوم: فیلدهای تخصصی دانش‌آموز */}
                    {step === 2 && role === 'student' && (
                      <div className="space-y-4 max-h-[50vh] overflow-y-auto px-1 custom-scrollbar">
                        <div>
                          <label className="block text-sm font-bold text-[#0F172A] mb-1">پایه تحصیلی و رشته</label>
                          <input
                            type="text"
                            name="grade"
                            value={formData.grade}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#2563EB] focus:outline-none bg-white"
                            placeholder="مثال: یازدهم ریاضی / دهم تجربی"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-[#0F172A] mb-1">نام مدرسه</label>
                          <input
                            type="text"
                            name="school"
                            value={formData.school}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#2563EB] focus:outline-none bg-white"
                            placeholder="مثال: دبیرستان فرزانگان / علامه حلی"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-[#0F172A] mb-1">علاقمندی‌ها و انگیزه حضور در برهان</label>
                          <textarea
                            name="interests"
                            rows={3}
                            value={formData.interests}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#2563EB] focus:outline-none resize-none bg-white"
                            placeholder="دوست داری چه بخش‌هایی از فیزیک رو یاد بگیری؟"
                          />
                        </div>
                        <div className="flex gap-3 pt-2">
                          <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="w-1/3 py-3.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition cursor-pointer"
                          >
                            بازگشت
                          </button>
                          <button
                            type="submit"
                            disabled={loading}
                            className="w-2/3 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black rounded-xl hover:opacity-95 transition cursor-pointer shadow-lg shadow-indigo-500/20"
                          >
                            {loading ? 'در حال ثبت نهایی...' : 'ثبت درخواست نهایی 🚀'}
                          </button>
                        </div>
                      </div>
                    )}
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}