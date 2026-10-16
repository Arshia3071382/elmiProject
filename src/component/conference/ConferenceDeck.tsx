"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  Crown, Shield, Award, Trophy, Users, Brain, Zap, Video, MessageSquare, LineChart,
  FlaskConical, Sparkles, LayoutGrid, ChevronRight, ChevronLeft, BookOpen, Cpu, Terminal,
  Gamepad2, FileSpreadsheet, Smartphone, Monitor, Heart, Play, Pause, Maximize2, Minimize2,
  CheckCircle2, Target, ImageOff, Bell, TrendingUp,
} from "lucide-react";
import { levels, classScores, scienceScores, impactScores } from "./../../../data/leagueData";

/* ═════════════ تنظیمات: عکس‌ها و زمان‌بندی (فقط این بخش را ویرایش کنید) ═════════════ */

const REVEAL_GAP = 1;     // فاصله نمایش هر عکس/کارت (ثانیه)
const REVEAL_START = 0.6; // تأخیر اولین مورد بعد از ورود اسلاید
const AUTOPLAY_BASE = 10; // زمان پایه هر اسلاید در پخش خودکار (+ یک ثانیه به ازای هر عکس)
const LEVELS_SECONDS = 25; // مدت اسلاید مدال‌ها در پخش خودکار
const MEDAL_SECONDS_EACH = 5; // سرعت قطار مدال‌ها: هر مدال چند ثانیه طول بکشد تا رد شود

type Img = { src: string; caption?: string; sub?: string };
const C = "/image/conf";
const LOGO = "/icons/logo6.png";
const LEVEL_IMAGES = [1, 2, 3, 4, 5, 6, 7].map((n) => `/image/levels/le${n}.png`); // اسم و بازه از leagueData
// اگر مسیر عکس پسوند نداشته باشد (مثل "/image/app")، این پسوندها به‌ترتیب امتحان می‌شوند
const EXTS = ["png", "jpg", "jpeg", "webp", "JPG", "PNG"];

const media: Record<string, Img[]> = {
  exam: [{ src: `${C}/main.png` }], // صفحه اصلی سایت (عمودی، سمت راست)
  leagues: [1, 2, 3, 4].map((n) => ({ src: `${C}/leg${n}.png` })),
  academy: [1, 2, 3].map((n) => ({ src: `${C}/cou${n}.png` })),
  goftino: [1, 2, 3].map((n) => ({ src: `${C}/gof${n}.png` })),
  studentPanel: [
    { src: `${C}/stup1.png`, caption: "رادار تعقیب‌کننده جدول", sub: "جایگاه لحظه‌ای نسبت به رقبا" },
    { src: `${C}/stup2.png`, caption: "فاصله تا برترین‌ها", sub: "امتیاز لازم برای صعود" },
    { src: `${C}/stup3.png`, caption: "مدال‌ها و کارنامه", sub: "دستاوردها و نمودار پیشرفت" },
  ],
  // سه عکس اسلاید کارنامه: نام فایل‌ها را با فایل‌های واقعی‌تان یکی کنید (پسوند لازم نیست)
  report: [
    { src: `${C}/azp1`, caption: "کارنامه تحصیلی", sub: "نمرات و وضعیت درسی" },
    { src: `${C}/azp2`, caption: "درصد پیشرفت", sub: "میزان رشد نسبت به ماه قبل" },
    { src: `${C}/azp3`, caption: "نمودار روند پیشرفت", sub: "مسیر رشد در طول سال" },
  ],
  // این سه فایل هنوز در پروژه نیستند: با همین نام در public/image/conf بگذارید یا مسیر را عوض کنید
  mentorPanel: [
    { src: `${C}/adp2.png`, caption: "ثبت کارنامه درسی" },
    { src: `${C}/adp1.png`, caption: "ثبت امتیازات لیگ نخبگان" },
  ],
  media: [{ src: `${C}/station.png`, caption: "ایستگاه کنجکاوی" }],
  appSlide: [{ src: "/image/conf/app" }], // public/image/app.* : صفحه موبایل (عمودی، سمت راست). پسوند خودکار پیدا می‌شود
};

// نوع قاب هر اسلاید: plain | browser | phone | neon
const frameKind: Record<string, "plain" | "browser" | "phone" | "neon"> = {
  exam: "browser", leagues: "plain", academy: "browser", goftino: "phone",
  studentPanel: "plain", report: "browser", mentorPanel: "browser", media: "neon", appSlide: "phone",
};
const frameUrl: Record<string, string> = {
  exam: "montazeran.ir", academy: "montazeran.ir/courses", report: "montazeran.ir/student/dashboard", mentorPanel: "montazeran.ir/admin",
};

/* ═════════════ اسلایدها ═════════════ */

const steps = [
  { id: "intro", title: "معرفی سامانه", subtitle: "سامانه جامع علمی آموزشی منتظران", accent: "#60a5fa", icon: Sparkles, kicker: "" },
  { id: "structure", title: "کادر تشکیلاتی", subtitle: "مدیریت سه سطحی و ساختار یافته", accent: "#fbbf24", icon: Crown, kicker: "ویژه ناظران" },
  { id: "exam", title: "آزمون مدارس", subtitle: "جذب و تعیین سطح هوشمند", accent: "#38bdf8", icon: Monitor, kicker: "سامانه آزمون آنلاین" },
  { id: "leagues", title: "لیگ نخبگان علمی منتظران", subtitle: "رقابت‌های پویا و جوایز ماهانه", accent: "#a78bfa", icon: Trophy, kicker: "جوایز ماهانه و فصلی" },
  { id: "scores", title: "امتیازدهی", subtitle: "معیارهای جامع ارزیابی دانش‌آموز", accent: "#34d399", icon: LineChart, kicker: "شفاف و قابل پیگیری" },
  { id: "levels", title: "سطح‌بندی علمی", subtitle: "نشان شهدا و درجات علمی", accent: "#f59e0b", icon: Award, kicker: "از آغاز راه تا اوج" },
  { id: "academy", title: "دوره‌های آموزشی", subtitle: "ویدیوهای تخصصی و مهارت‌آموزی", accent: "#22d3ee", icon: BookOpen, kicker: "در سایت و کانال آپارات مجموعه" },
  { id: "goftino", title: "گفتینو", subtitle: "مشاور تحصیلی هوشمند", accent: "#2dd4bf", icon: MessageSquare, kicker: "پاسخ‌گویی آنی و راهنمایی تخصصی" },
  { id: "studentPanel", title: "پنل دانش‌آموز", subtitle: "امکانات پیشرفته پیگیری وضعیت", accent: "#818cf8", icon: Brain, kicker: "جایگاه من در رقابت" },
  { id: "report", title: "کارنامه و پیشرفت", subtitle: "کارنامه تحصیلی و درصد پیشرفت دانش‌آموز", accent: "#f472b6", icon: TrendingUp, kicker: "رشد من، ماه به ماه" },
  { id: "mentorPanel", title: "پنل معین‌ها", subtitle: "ابزارهای نظارتی و مدیریتی", accent: "#60a5fa", icon: Shield, kicker: "نظارت و مدیریت علمی" },
  { id: "media", title: "ایستگاه کنجکاوی", subtitle: "مقالات داغ علمی و فناوری", accent: "#fb923c", icon: FlaskConical, kicker: "نجوم، فیزیک و فناوری‌های نوین" },
  { id: "appSlide", title: "اپلیکیشن علمی", subtitle: "سامانه همراه منتظران", accent: "#38bdf8", icon: Smartphone, kicker: "همیشه همراه" },
  { id: "thanksSlide", title: "تشکر و پایان", subtitle: "قدردانی از همراهی شما", accent: "#34d399", icon: Heart, kicker: "" },
];

/* ═════════════ ابزارها ═════════════ */

const EASE = [0.22, 1, 0.36, 1] as const;
const glass = "rounded-3xl border border-white/10 bg-white/[0.045] backdrop-blur-md";
const chip = "flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-5 py-2 text-lg text-slate-200";
const fa = (v: number | string) => String(v).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[+d]);
const rows = (v: unknown): (string | number)[][] => (Array.isArray(v) ? (v as (string | number)[][]) : []);

const stagger: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } } };
const rise: Variants = { hidden: { opacity: 0, y: 22 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } } };
const slideVariants: Variants = {
  enter: (d: number) => ({ opacity: 0, x: d * -60, scale: 0.985 }),
  center: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.5, ease: EASE } },
  exit: (d: number) => ({ opacity: 0, x: d * 60, scale: 0.985, transition: { duration: 0.28 } }),
};

type LevelRow = { name: string; from: number | string; to: number | string };

/* ═════════════ کامپوننت اصلی ═════════════ */

export default function ConferenceDeck() {
  const total = steps.length;
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "slider">("slider");
  const [playing, setPlaying] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [zoom, setZoom] = useState<Img | null>(null);
  const [failed, setFailed] = useState<Record<string, boolean>>({});
  const [ratios, setRatios] = useState<Record<string, number>>({}); // نسبت عرض به ارتفاع هر عکس
  const [extTry, setExtTry] = useState<Record<string, number>>({}); // شمارنده امتحان پسوند برای مسیرهای بدون پسوند
  const indexRef = useRef(0);

  const step = steps[index];
  const Icon = step.icon;

  // مدال‌ها: اسم و بازه امتیاز از leagueData
  const levelList = levels as unknown as LevelRow[];
  const levelSrc: (LevelRow | null)[] = levelList.length ? levelList : LEVEL_IMAGES.map(() => null);
  const levelItems: Img[] = levelSrc.map((l, i) => ({
    src: LEVEL_IMAGES[i] ?? "",
    caption: l?.name,
    sub: l ? `${fa(l.from)} تا ${fa(l.to)} امتیاز` : undefined,
  }));

  const itemsOf = (id: string): Img[] => (id === "levels" ? levelItems : media[id] ?? []);
  const durationOf = (i: number) => {
    const id = steps[i].id;
    return id === "levels" ? LEVELS_SECONDS : AUTOPLAY_BASE + itemsOf(id).length * REVEAL_GAP;
  };

  const go = useCallback((n: number) => {
    const t = Math.max(0, Math.min(total - 1, n));
    setDir(t >= indexRef.current ? 1 : -1);
    indexRef.current = t;
    setIndex(t);
  }, [total]);
  const next = useCallback(() => go(indexRef.current + 1), [go]);
  const prev = useCallback(() => go(indexRef.current - 1), [go]);
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.().catch(() => {});
    else document.exitFullscreen?.().catch(() => {});
  };

  useEffect(() => {
    const onFs = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  // کلیدها (راست‌به‌چپ: فلش چپ = بعدی؛ PageUp/PageDown برای ریموت پرزنتیشن)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft": case "PageDown": case " ": e.preventDefault(); if (viewMode === "slider") next(); break;
        case "ArrowRight": case "PageUp": e.preventDefault(); if (viewMode === "slider") prev(); break;
        case "Home": go(0); break;
        case "End": go(total - 1); break;
        case "Escape": setViewMode("grid"); setPlaying(false); break;
        case "Enter": if (viewMode === "grid") setViewMode("slider"); break;
        case "p": case "P": setPlaying((v) => !v); setViewMode("slider"); break;
        case "f": case "F": toggleFullscreen(); break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [viewMode, next, prev, go, total]);

  // وقتی عکس تمام‌صفحه است، هر کلیدی فقط آن را می‌بندد
  useEffect(() => {
    if (!zoom) return;
    const h = (e: KeyboardEvent) => { e.stopImmediatePropagation(); e.preventDefault(); setZoom(null); };
    window.addEventListener("keydown", h, true);
    return () => window.removeEventListener("keydown", h, true);
  }, [zoom]);

  // پخش خودکار
  useEffect(() => {
    if (!playing || viewMode !== "slider") return;
    if (index >= total - 1) { setPlaying(false); return; }
    const t = setTimeout(next, durationOf(index) * 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, viewMode, index, total, next]);

  const selectStep = (i: number) => { go(i); setViewMode("slider"); };

  /* ───── داده‌های رندر اسلاید فعلی ───── */
  const items = step.id === "levels" ? [] : itemsOf(step.id);
  const hasGallery = items.length > 0;
  const side = step.id === "exam" || step.id === "appSlide";        // عکس عمودی سمت راست
  const rowExtras = step.id === "leagues" || step.id === "academy"; // هدر و محتوای کمکی در یک ردیف
  const bigTitle = step.id === "intro" || step.id === "thanksSlide";
  const centered = ["intro", "structure", "thanksSlide"].includes(step.id);
  const kind = frameKind[step.id] ?? "plain";

  const markFailed = (src: string) => setFailed((f) => ({ ...f, [src]: true }));
  const hasExt = (src: string) => /\.\w{2,5}$/.test(src);
  const resolve = (src: string) => (hasExt(src) ? src : `${src}.${EXTS[extTry[src] ?? 0]}`);
  const onImgError = (src: string) => {
    if (!hasExt(src) && (extTry[src] ?? 0) < EXTS.length - 1) setExtTry((t) => ({ ...t, [src]: (t[src] ?? 0) + 1 }));
    else markFailed(src);
  };
  const markRatio = (src: string, e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth: w, naturalHeight: h } = e.currentTarget;
    if (w && h) setRatios((r) => (r[src] ? r : { ...r, [src]: w / h }));
  };

  /* امتیازدهی: «تحقیق علمی» همیشه ۱۵۰ امتیاز نمایش داده می‌شود و حتماً در لیست هست */
  type Row = (string | number)[];
  const norm = (v: unknown) => String(v).replace(/ي/g, "ی").replace(/ك/g, "ک");
  const isResearch = (r: Row) => norm(r[0]).includes("تحقیق علمی");
  const fixRows = (list: unknown): Row[] => rows(list).map((r) => (isResearch(r) ? [r[0], 150] : r));
  const pick = (list: Row[]): Row[] => {
    const s = list.slice(0, 4);
    const t = list.find(isResearch);
    if (t && !s.includes(t)) s[s.length - 1] = t;
    return s;
  };
  const clsRows = fixRows(classScores);
  let sciRows = fixRows(scienceScores);
  const impRows = fixRows(impactScores);
  if (![...clsRows, ...sciRows, ...impRows].some(isResearch)) sciRows = [...sciRows.slice(0, 3), ["تحقیق علمی", 150]];
  const scoreCols = [
    { t: "امتیاز کلاس", c: "#60a5fa", r: pick(clsRows) },
    { t: "فعالیت علمی", c: "#c084fc", r: pick(sciRows) },
    { t: "اثرگذاری", c: "#fbbf24", r: pick(impRows) },
  ];

  /* هدر اسلاید */
  const headerEl = (
    <motion.div variants={rise} className="flex shrink-0 items-center gap-4">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border" style={{ background: `${step.accent}1f`, borderColor: `${step.accent}55`, color: step.accent, boxShadow: `0 0 40px ${step.accent}33` }}>
        <Icon className="h-7 w-7" />
      </div>
      <div>
        {step.kicker && <div className="text-sm font-medium" style={{ color: step.accent }}>{step.kicker}</div>}
        <h2 className="text-3xl font-black leading-tight text-white xl:text-4xl">{step.title}</h2>
        <p className="mt-0.5 text-base text-slate-400">{step.subtitle}</p>
      </div>
    </motion.div>
  );

  /* محتوای کمکی کنار هدر یا ستون متن */
  const extrasEl =
    step.id === "exam" ? (
      <motion.div variants={rise} className="space-y-5">
        <p className="text-xl leading-9 text-slate-300">جذب دانش‌آموزان از مدارس و طبقه‌بندی هوشمند آن‌ها بر اساس تراز آزمون و ارزیابی استاندارد.</p>
        {["جذب دانش‌آموزان از مدارس", "تعیین سطح هوشمند بر اساس تراز", "ارزیابی استاندارد و نتیجه آنی"].map((t) => (
          <div key={t} className="flex items-center gap-3 text-2xl text-slate-100"><CheckCircle2 className="h-7 w-7 shrink-0 text-sky-400" /> {t}</div>
        ))}
      </motion.div>
    ) : step.id === "appSlide" ? (
      <motion.div variants={rise} className="space-y-6">
        <p className="text-xl leading-9 text-slate-300">دسترسی سریع و همیشه همراه به همه امکانات سامانه؛ آزمون‌های آنلاین، کارنامه درسی و پیگیری لیگ‌های علمی در قالب اپلیکیشن موبایل.</p>
        <div className="flex flex-col items-start gap-3">
          {[["نسخه اندروید و PWA", Smartphone], ["اعلان‌های آنی آزمون", Bell], ["کارنامه و لیگ در جیب شما", Trophy]].map(([t, I]) => {
            const Ic = I as React.ElementType;
            return <span key={t as string} className={chip}><Ic className="h-5 w-5 text-sky-300" /> {t as string}</span>;
          })}
        </div>
      </motion.div>
    ) : step.id === "leagues" ? (
      <div className="flex gap-4">
        {[
          { icon: Trophy, color: "#60a5fa", title: "لیگ علمی پایه", tag: "رقابت درون‌پایه‌ای", desc: "جوایز ماهانه برای نفرات برتر هر پایه" },
          { icon: Users, color: "#c084fc", title: "لیگ نخبگان مقطع", tag: "رقابت سراسری", desc: "جام نخبگان و جوایز پایان سال" },
        ].map((c) => (
          <motion.div key={c.title} variants={rise} className={`${glass} flex items-center gap-3 px-4 py-3`} style={{ borderColor: `${c.color}40`, background: `linear-gradient(135deg, ${c.color}14, transparent 70%)` }}>
            <div className="rounded-xl p-2.5" style={{ background: `${c.color}1f`, color: c.color }}><c.icon className="h-6 w-6" /></div>
            <div>
              <div className="flex items-center gap-2"><span className="text-lg font-bold text-white">{c.title}</span><span className="text-sm" style={{ color: c.color }}>{c.tag}</span></div>
              <p className="text-sm text-slate-300">{c.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    ) : step.id === "academy" ? (
      <div className="flex shrink-0 items-center gap-3">
        {[
          { t: "آموزش آفیس", i: FileSpreadsheet, c: "#60a5fa" }, { t: "ریاضی راهنمایی", i: BookOpen, c: "#c084fc" },
          { t: "فیزیک کنکور", i: Zap, c: "#fbbf24" }, { t: "فتوشاپ با هوش مصنوعی", i: Cpu, c: "#22d3ee" },
          { t: "پایتون پیشرفته", i: Terminal, c: "#34d399" }, { t: "بازی‌سازی با هوش مصنوعی", i: Gamepad2, c: "#fb7185" },
        ].map((k, i) => (
          <motion.div
            key={k.t}
            initial={{ opacity: 0, scale: 0.6, rotate: -8 }} animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.2 + i * 0.12 }}
            className="relative flex aspect-square w-[8.4rem] flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border p-2 text-center"
            style={{ borderColor: `${k.c}55`, background: `linear-gradient(160deg, ${k.c}2a, transparent 75%)`, boxShadow: `0 10px 30px -12px ${k.c}66` }}
          >
            <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 2.6, repeat: Infinity, delay: i * 0.3, ease: "easeInOut" }} style={{ color: k.c }}>
              <k.i className="h-10 w-10" />
            </motion.div>
            <span className="text-sm font-bold leading-5 text-slate-100">{k.t}</span>
            <motion.span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-white/10" animate={{ x: ["0%", "420%"] }} transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 3 + i * 0.7, ease: "easeInOut" }} />
          </motion.div>
        ))}
      </div>
    ) : null;

  /* گالری: هر عکس داخل قابی می‌نشیند که دقیقاً هم‌اندازه خود عکس است (بدون حاشیه اضافه) و تا حد ممکن بزرگ می‌شود */
  const galleryEl = hasGallery && (
    <div className={side ? "h-full w-[36%] shrink-0" : "min-h-0 flex-1"}>
      <div className="grid h-full min-h-0 gap-6" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))`, gridAutoRows: "minmax(0, 1fr)" }}>
        {items.map((it, i) => {
          const ar = ratios[it.src] ?? 1.6;
          const bar = kind === "browser" ? 2.25 : 0; // ارتفاع نوار مرورگر (rem)
          const tilt = step.id === "mentorPanel" ? (i - (items.length - 1) / 2) * -8 : 0;
          const ring =
            kind === "phone" ? `0 0 0 7px #0b1020, 0 0 0 9px ${step.accent}99, 0 30px 80px -20px ${step.accent}88`
            : kind === "neon" ? `0 0 0 2px ${step.accent}, 0 0 40px ${step.accent}88, 0 0 110px ${step.accent}44`
            : `0 0 0 1px ${step.accent}55, 0 30px 80px -24px ${step.accent}88`;
          return (
            <motion.figure
              key={`${step.id}-${i}`}
              initial={{ opacity: 0, y: 40, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, ease: EASE, delay: REVEAL_START + i * REVEAL_GAP }}
              className="flex min-h-0 min-w-0 flex-col gap-3"
            >
              <div className={`flex min-h-0 flex-1 items-center ${side ? "justify-start" : "justify-center"}`} style={{ containerType: "size" } as React.CSSProperties}>
                <button
                  onClick={() => !failed[it.src] && setZoom(it)}
                  className="relative block cursor-zoom-in overflow-hidden bg-slate-950 transition-transform duration-300 hover:scale-[1.02]"
                  style={{
                    width: `min(100cqw, calc((100cqh - ${bar}rem) * ${ar}))`,
                    borderRadius: kind === "phone" ? "2.2rem" : "1.1rem",
                    boxShadow: ring,
                    transform: tilt ? `perspective(1600px) rotateY(${tilt}deg)` : undefined,
                  }}
                >
                  {kind === "browser" && (
                    <div className="flex items-center gap-3 bg-slate-900 px-4" style={{ height: `${bar}rem` }}>
                      <span className="flex gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-rose-400/80" /><i className="h-2.5 w-2.5 rounded-full bg-amber-400/80" /><i className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" /></span>
                      <span dir="ltr" className="mx-auto rounded-full border border-white/10 bg-black/30 px-4 py-0.5 font-mono text-[11px] text-slate-400">{frameUrl[step.id] ?? "montazeran.ir"}</span>
                    </div>
                  )}
                  {!it.src || failed[it.src] ? (
                    <div className="flex w-full flex-col items-center justify-center gap-3 text-slate-600" style={{ aspectRatio: ar }}>
                      <ImageOff className="h-12 w-12" />
                      {process.env.NODE_ENV !== "production" && <span dir="ltr" className="px-4 text-center font-mono text-xs">{it.src || "no image"}</span>}
                    </div>
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={resolve(it.src)} alt={it.caption ?? ""} onLoad={(e) => markRatio(it.src, e)} onError={() => onImgError(it.src)} className="block w-full" style={{ aspectRatio: ar }} />
                  )}
                  {kind === "phone" && <span className="pointer-events-none absolute left-1/2 top-2 h-1.5 w-20 -translate-x-1/2 rounded-full bg-black/60" />}
                </button>
              </div>
              {(it.caption || it.sub) && (
                <figcaption className="shrink-0 text-center">
                  {it.caption && <div className="text-xl font-bold text-white">{it.caption}</div>}
                  {it.sub && <div className="mt-0.5 text-base text-slate-400">{it.sub}</div>}
                </figcaption>
              )}
            </motion.figure>
          );
        })}
      </div>
    </div>
  );

  return (
    <div
      dir="rtl"
      className="relative flex h-screen w-full flex-col overflow-hidden bg-[#050816] text-slate-100 antialiased"
      style={{ fontFamily: '"IRANSansXDeck", var(--font-vazirmatn), Vazirmatn, Tahoma, sans-serif' }}
    >
      {/* فونت پروژه (IRANSansX داخل public/font) تا همه‌ی عنوان‌ها واضح و هماهنگ با سایت دیده شوند */}
      <style>{`
        @font-face{font-family:"IRANSansXDeck";src:url("/font/IRANSansXFaNum-Regular.ttf") format("truetype");font-weight:400;font-display:swap}
        @font-face{font-family:"IRANSansXDeck";src:url("/font/IRANSansXFaNum-Bold.ttf") format("truetype");font-weight:600 900;font-display:swap}
      `}</style>

      {/* پس‌زمینه */}
      <div className="pointer-events-none absolute inset-0">
        <motion.div className="absolute -right-24 -top-32 h-[620px] w-[620px] rounded-full blur-[130px]" animate={{ background: `${step.accent}38`, x: [0, 40, 0] }} transition={{ background: { duration: 1.2 }, x: { duration: 18, repeat: Infinity, ease: "easeInOut" } }} />
        <motion.div className="absolute -bottom-40 -left-32 h-[700px] w-[700px] rounded-full blur-[130px]" animate={{ background: `${step.accent}30`, x: [0, -50, 0] }} transition={{ background: { duration: 1.2 }, x: { duration: 22, repeat: Infinity, ease: "easeInOut" } }} />
        <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "56px 56px", maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)", WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)" }} />
      </div>

      {/* هدر */}
      <header className="relative z-10 flex shrink-0 items-center justify-between gap-4 px-6 py-3 xl:px-8">
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-sky-400 shadow-lg shadow-blue-500/30">
            {failed[LOGO] ? <span className="text-xl font-black text-white">م</span>
              // eslint-disable-next-line @next/next/no-img-element
              : <img src={LOGO} alt="لوگو" onError={() => markFailed(LOGO)} className="h-full w-full object-contain p-1.5" />}
          </div>
          <div>
            <div className="text-lg font-bold text-white">سامانه علمی منتظران</div>
            <div className="text-sm text-slate-400">ویترین تعاملی همایش</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-1 rounded-2xl border border-white/10 bg-white/[0.05] p-1">
            {([["grid", "انتخاب موضوع", LayoutGrid], ["slider", "نمای اسلایدر", Video]] as const).map(([m, label, I]) => (
              <button key={m} onClick={() => setViewMode(m)} className={`flex items-center gap-2 rounded-xl px-4 py-1.5 text-base font-medium transition-colors ${viewMode === m ? "bg-blue-600 text-white shadow-md shadow-blue-600/30" : "text-slate-400 hover:text-white"}`}>
                <I className="h-4 w-4" /> {label}
              </button>
            ))}
          </div>
          <button onClick={toggleFullscreen} title="تمام‌صفحه (F)" className="rounded-xl border border-white/10 bg-white/[0.05] p-2.5 text-slate-300 transition-colors hover:text-white">
            {fullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* محتوا (بدون اسکرول) */}
      <main className="relative z-10 min-h-0 flex-1 px-6 pb-2 xl:px-8">
        <AnimatePresence mode="wait" custom={dir}>
          {viewMode === "grid" ? (
            <motion.div key="grid" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3 }} className="grid h-full auto-rows-fr grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
              {steps.map((s, i) => (
                <motion.button key={s.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} onClick={() => selectStep(i)}
                  className="group relative flex min-h-0 flex-col justify-between overflow-hidden rounded-3xl border bg-slate-900/85 p-4 text-right transition-all duration-300 hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-400"
                  style={{ borderColor: `${s.accent}66`, boxShadow: `0 14px 40px -20px ${s.accent}88` }}>
                  <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full opacity-40 blur-3xl transition-opacity duration-300 group-hover:opacity-100" style={{ background: `${s.accent}66` }} />
                  <div className="relative flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: `${s.accent}26`, color: s.accent }}><s.icon className="h-6 w-6" /></div>
                    <span className="text-lg font-bold" style={{ color: s.accent }}>{fa(i + 1)}</span>
                  </div>
                  <div className="relative">
                    <div className="font-black leading-snug text-white" style={{ fontSize: "clamp(1.2rem, 2.5vh, 1.8rem)" }}>{s.title}</div>
                    <div className="mt-1 leading-snug text-slate-300" style={{ fontSize: "clamp(0.9rem, 1.8vh, 1.2rem)" }}>{s.subtitle}</div>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          ) : (
            <motion.div key={step.id} custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit" className={`${glass} relative h-full overflow-hidden p-6 shadow-2xl shadow-black/40`}>
              <div className="absolute inset-x-0 top-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${step.accent}, transparent)` }} />

              <motion.div variants={stagger} initial="hidden" animate="show" className={`flex h-full min-h-0 w-full flex-col gap-5 ${centered ? "justify-center" : ""} ${bigTitle ? "items-center text-center" : ""}`}>

                {/* هدر (اسلایدهای عادی؛ در حالت side داخل ستون متن است) */}
                {!bigTitle && !side && (rowExtras ? <div className="flex shrink-0 items-center justify-between gap-6">{headerEl}{extrasEl}</div> : headerEl)}

                {/* ۱: معرفی */}
                {step.id === "intro" && (
                  <>
                    <motion.div variants={rise} className="relative flex h-40 w-40 items-center justify-center">
                      {[0, 1].map((i) => (
                        <motion.span key={i} className="absolute inset-0 rounded-[2.2rem] border" style={{ borderColor: `${step.accent}66` }} animate={{ scale: [1, 1.55], opacity: [0.6, 0] }} transition={{ duration: 3, repeat: Infinity, delay: i * 1.5, ease: "easeOut" }} />
                      ))}
                      <div className="relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-[2rem] bg-gradient-to-tr from-blue-600 via-indigo-500 to-sky-400 shadow-2xl shadow-blue-500/40">
                        {failed[LOGO] ? <span className="text-6xl font-black text-white">م</span>
                          // eslint-disable-next-line @next/next/no-img-element
                          : <img src={LOGO} alt="لوگوی مجموعه" onError={() => markFailed(LOGO)} className="h-full w-full object-contain p-3" />}
                      </div>
                    </motion.div>
                    <motion.h1 variants={rise} className="text-5xl font-black leading-[1.4] text-white xl:text-7xl">
                      سامانه جامع علمی آموزشی <span className="bg-gradient-to-l from-sky-300 via-blue-400 to-indigo-300 bg-clip-text text-transparent">منتظران</span>
                    </motion.h1>
                    <motion.p variants={rise} className="max-w-3xl text-xl leading-9 text-slate-300">جایی که یادگیری به رقابت سالم، و رقابت به رشد علمی تبدیل می‌شود.</motion.p>
                    <motion.div variants={rise} className="flex flex-wrap justify-center gap-3">
                      {[["گیمیفیکیشن علمی", Gamepad2], ["آزمون آنلاین", Monitor], ["سطح‌بندی دانش‌آموزان", Award], ["هدایت تحصیلی", Target]].map(([t, I]) => {
                        const Ic = I as React.ElementType;
                        return <span key={t as string} className={chip}><Ic className="h-5 w-5 text-sky-300" /> {t as string}</span>;
                      })}
                    </motion.div>
                  </>
                )}

                {/* ۲: کادر تشکیلاتی: سه کارت افقی، یکی‌یکی با فاصله ۱ ثانیه */}
                {step.id === "structure" && (
                  <div className="flex items-stretch gap-4 py-6">
                    {[
                      { icon: Crown, color: "#fbbf24", title: "مسئول علمی", desc: "راهبری کلان علمی و سیاست‌گذاری مجموعه" },
                      { icon: Shield, color: "#60a5fa", title: "معین ارشد علمی", desc: "معین کل مقطع تحصیلی (ابتدایی یا راهنمایی)" },
                      { icon: Award, color: "#34d399", title: "معین علمی پایه", desc: "مسئول مستقیم علمی و هدایت تحصیلی هر پایه" },
                    ].map((t, i) => (
                      <React.Fragment key={t.title}>
                        {i > 0 && (
                          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: REVEAL_START + i * REVEAL_GAP - 0.4 }} className="flex items-center text-slate-500">
                            <ChevronLeft className="h-10 w-10" />
                          </motion.div>
                        )}
                        <motion.div
                          initial={{ opacity: 0, y: 40, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ duration: 0.6, ease: EASE, delay: REVEAL_START + i * REVEAL_GAP }}
                          className={`${glass} flex flex-1 flex-col items-center justify-center p-10 text-center`}
                          style={{ borderColor: `${t.color}40`, background: `linear-gradient(160deg, ${t.color}18, transparent 70%)` }}
                        >
                          <div className="mb-6 flex h-32 w-32 items-center justify-center rounded-full border-2" style={{ borderColor: t.color, background: `${t.color}1a`, color: t.color, boxShadow: `0 0 60px ${t.color}45` }}><t.icon className="h-14 w-14" /></div>
                          <h3 className="text-3xl font-bold text-white">{t.title}</h3>
                          <p className="mt-4 text-xl leading-9 text-slate-300">{t.desc}</p>
                        </motion.div>
                      </React.Fragment>
                    ))}
                  </div>
                )}

                {/* ۵: امتیازدهی (کارت‌های کوچک‌تر تا عنوان کامل دیده شود) */}
                {step.id === "scores" && (
                  <div className="grid grid-cols-3 gap-5">
                    {scoreCols.map((col) => (
                      <motion.div key={col.t} variants={rise} className={`${glass} overflow-hidden`}>
                        <div className="px-5 py-3 text-lg font-bold" style={{ background: `${col.c}1f`, color: col.c, borderBottom: `1px solid ${col.c}33` }}>{col.t}</div>
                        <div className="divide-y divide-white/5">
                          {col.r.map((r, i) => (
                            <div key={i} className="flex items-center justify-between gap-3 px-5 py-2.5 text-base">
                              <span className="text-slate-200">{r[0]}</span>
                              <span dir="ltr" className="rounded-lg bg-emerald-400/10 px-2.5 py-0.5 font-bold text-emerald-400">+{fa(r[1])}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* ۶: سطح‌بندی: مدال‌های بزرگ در قالب قطار بی‌وقفه و بی‌انتها */}
                {step.id === "levels" && (
                  <div
                    dir="ltr"
                    className="relative min-h-0 flex-1 overflow-hidden"
                    style={{ maskImage: "linear-gradient(90deg, transparent, black 7%, black 93%, transparent)", WebkitMaskImage: "linear-gradient(90deg, transparent, black 7%, black 93%, transparent)" }}
                  >
                    <motion.div
                      className="absolute inset-0 flex w-max"
                      animate={{ x: ["0%", "-50%"] }}
                      transition={{ duration: Math.max(levelItems.length, 1) * MEDAL_SECONDS_EACH, ease: "linear", repeat: Infinity }}
                    >
                      {[...levelItems, ...levelItems].map((m, i) => (
                        <div key={i} className="flex h-full shrink-0 flex-col items-center gap-2 px-10">
                          <div className="flex items-center justify-center" style={{ height: "calc(100% - 4.5rem)", aspectRatio: "1" }}>
                            {!m.src || failed[m.src] ? (
                              <Award className="h-1/2 w-1/2 text-slate-700" />
                            ) : (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={m.src} alt={m.caption ?? ""} onError={() => markFailed(m.src)} className="h-full w-full object-contain" style={{ filter: `drop-shadow(0 20px 40px ${step.accent}66)` }} />
                            )}
                          </div>
                          <div dir="rtl" className="text-center">
                            {m.caption && <div className="text-2xl font-bold text-white">{m.caption}</div>}
                            {m.sub && <div className="text-base text-slate-400">{m.sub}</div>}
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  </div>
                )}

                {/* ۱۳: تشکر */}
                {step.id === "thanksSlide" && (
                  <>
                    <motion.div variants={rise}>
                      <motion.div animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }} className="flex h-28 w-28 items-center justify-center rounded-[2rem] bg-gradient-to-tr from-emerald-500 to-teal-500 shadow-2xl shadow-emerald-500/40">
                        <Heart className="h-14 w-14 fill-white/25 text-white" />
                      </motion.div>
                    </motion.div>
                    <motion.h2 variants={rise} className="text-5xl font-black text-white xl:text-7xl">با تشکر از همراهی شما</motion.h2>
                    <motion.p variants={rise} className="max-w-2xl text-xl leading-10 text-slate-300">امیدواریم قدمی مؤثر در راستای رشد، اعتلا و پیشرفت علمی آینده‌سازان میهن عزیز برداشته باشیم.</motion.p>
                    <motion.div variants={rise} className="border-t border-white/10 pt-5 text-base text-slate-500">سامانه علمی آموزشی منتظران</motion.div>
                  </>
                )}

                {/* گالری عکس معمولی */}
                {!side && galleryEl}

                {/* چیدمان کناری: عکس عمودی سمت راست، متن سمت چپ (اسلایدهای ۳ و ۱۲) */}
                {side && (
                  <div className="flex min-h-0 flex-1 gap-10">
                    {galleryEl}
                    <div className="flex min-w-0 flex-1 flex-col justify-center gap-8">
                      {headerEl}
                      {extrasEl}
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* فوتر */}
      {viewMode === "slider" && (
        <footer className="relative z-10 shrink-0 px-6 pb-4 pt-2 xl:px-8">
          {playing && (
            <div className="mb-2 h-1 overflow-hidden rounded-full bg-white/10">
              <motion.div key={index} className="h-full rounded-full" style={{ background: step.accent }} initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: durationOf(index), ease: "linear" }} />
            </div>
          )}
          <div className="flex items-center justify-between gap-4">
            <button onClick={prev} disabled={index === 0} className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-5 py-2 text-base font-medium text-slate-200 transition-all hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30">
              <ChevronRight className="h-5 w-5" /> قبلی
            </button>
            <div className="flex items-center gap-5">
              <button onClick={() => setPlaying((v) => !v)} title="پخش خودکار (P)" className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2 text-base text-slate-200 transition-colors hover:bg-white/10">
                {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />} {playing ? "توقف" : "پخش خودکار"}
              </button>
              <div className="flex items-center gap-2">
                {steps.map((s, i) => (
                  <button key={s.id} aria-label={s.title} title={s.title} onClick={() => go(i)} className="h-2.5 rounded-full transition-all duration-300" style={{ width: i === index ? 34 : 10, background: i === index ? step.accent : "rgba(255,255,255,0.2)" }} />
                ))}
              </div>
              <span className="min-w-[72px] text-center text-base text-slate-400">{fa(index + 1)} از {fa(total)}</span>
            </div>
            <button onClick={next} disabled={index === total - 1} className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2 text-base font-medium text-white shadow-lg shadow-blue-600/30 transition-all hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-30">
              بعدی <ChevronLeft className="h-5 w-5" />
            </button>
          </div>
        </footer>
      )}

      {/* نمایش تمام‌صفحه عکس (کلیک روی هر عکس). عکس‌های بلند و عمودی با چرخ ماوس اسکرول می‌شوند */}
      <AnimatePresence>
        {zoom && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setZoom(null)} className="fixed inset-0 z-50 flex cursor-zoom-out flex-col items-center gap-4 overflow-y-auto bg-black/90 p-6 backdrop-blur-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={resolve(zoom.src)} alt={zoom.caption ?? ""}
              className={`my-auto rounded-2xl shadow-2xl ${(ratios[zoom.src] ?? 1) < 0.75 ? "h-auto w-[min(62vw,860px)]" : "max-h-[88vh] max-w-[94vw] object-contain"}`}
            />
            {zoom.caption && <div className="shrink-0 text-2xl font-bold text-white">{zoom.caption}</div>}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}