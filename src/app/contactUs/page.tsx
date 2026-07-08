"use client";

import { useState } from "react";
import { Send, User, Phone, FileText, MessageSquare, CheckCircle, AlertCircle } from "lucide-react";

export default function ContactUs() {
  const [formData, setFormData] = useState({ name: "", subject: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success) {
        setStatus({ type: "success", text: "پیام شما با موفقیت ثبت شد. متشکریم!" });
        setFormData({ name: "", subject: "", phone: "", message: "" });
      } else {
        setStatus({ type: "error", text: data.error || "خطایی رخ داده است" });
      }
    } catch (error) {
      setStatus({ type: "error", text: "خطا در ارتباط با سرور" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir="rtl" className="max-w-xl mx-auto my-12 p-8 bg-white border border-gray-100 rounded-2xl shadow-xl transition hover:shadow-2xl">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-black text-gray-800 flex items-center justify-center gap-2 mb-2">
          <MessageSquare className="w-6 h-6 text-blue-600" />
          ارتباط با ما
        </h2>
        <p className="text-sm text-gray-500">نظرات، پیشنهادات یا سوالات خود را با ما در میان بگذارید</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="relative">
          <User className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" />
          <input
            type="text"
            required
            placeholder="نام و نام خانوادگی"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full border border-gray-200 rounded-xl pr-11 pl-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-gray-50/50"
          />
        </div>

        <div className="relative">
          <FileText className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" />
          <input
            type="text"
            required
            placeholder="موضوع پیام"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            className="w-full border border-gray-200 rounded-xl pr-11 pl-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-gray-50/50"
          />
        </div>

        <div className="relative">
          <Phone className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" />
          <input
            type="text"
            required
            placeholder="شماره تماس"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full border border-gray-200 rounded-xl pr-11 pl-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-gray-50/50 text-right"
          />
        </div>

        <div className="relative">
          <textarea
            required
            rows={4}
            placeholder="متن پیام شما..."
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full border border-gray-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-gray-50/50 resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition duration-200 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
        >
          <Send className="w-4 h-4 rotate-185" />
          {loading ? "در حال ارسال..." : "ارسال پیام"}
        </button>
      </form>

      {status && (
        <div className={`mt-5 flex items-center gap-2 p-4 rounded-xl text-sm border ${
          status.type === "success" ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-700"
        }`}>
          {status.type === "success" ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span>{status.text}</span>
        </div>
      )}
    </div>
  );
}