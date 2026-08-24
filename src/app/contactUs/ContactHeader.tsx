// Contact page header
"use client";

import { Sparkles } from "lucide-react";

export default function ContactHeader() {
  return (
    <div className="text-center mb-12">
      <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
        <Sparkles className="w-8 h-8 text-secondary" />
        <h1
          className="text-4xl md:text-5xl font-bold tracking-tight"
          style={{ fontFamily: "iranBold" }}
        >
          ارتباط با ما
        </h1>
      </div>
      <p
        className="text-text-secondary text-lg max-w-2xl mx-auto"
        style={{ fontFamily: "iranSans-r" }}
      >
        خوشحال می‌شویم نظرات، پیشنهادات علمی و سوالات شما را بشنویم. تیم
        متخصص ما آماده پاسخگویی است.
      </p>
    </div>
  );
}