"use client";

import { useState } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  LabelList,
} from "recharts";

import {
  TrendingUp,
  BarChart2,
  LineChart as LineIcon,
  AreaChart as AreaIcon,
  ChevronDown,
  Check,
} from "lucide-react";

// ============================================================
//  TYPES
// ============================================================

interface ExamResult {
  date: string;
  examTitle: string;
  math?: number;
  science?: number;
  persian?: number;
  general?: number;
}

interface ProgressChartProps {
  data: ExamResult[];
}

type ChartType = "line" | "bar" | "area";

// ============================================================
//  CONSTANTS
// ============================================================

const SUBJECTS = [
  { key: "all", label: "میانگین کل", color: "#6366f1" },
  { key: "math", label: "ریاضی", color: "#3b82f6" },
  { key: "science", label: "علوم", color: "#10b981" },
  { key: "persian", label: "فارسی", color: "#f59e0b" },
];

// ============================================================
//  MAIN COMPONENT
// ============================================================

export default function ProgressChart({ data }: ProgressChartProps) {
  // State
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [chartType, setChartType] = useState<ChartType>("line");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Derived
  const currentSubject = SUBJECTS.find((s) => s.key === selectedSubject)!;
  const chartData = data.slice(-3); // Last 3 exams only

  return (
    <div
      dir="rtl"
      className="bg-white/90 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-4 sm:p-8 shadow-sm space-y-5"
    >
      {/* Header */}
      <ChartHeader chartType={chartType} onChartTypeChange={setChartType} />

      {/* Subject Filter */}
      <SubjectFilter
        selectedSubject={selectedSubject}
        onSubjectChange={setSelectedSubject}
        isDropdownOpen={isDropdownOpen}
        onDropdownToggle={() => setIsDropdownOpen(!isDropdownOpen)}
        onDropdownClose={() => setIsDropdownOpen(false)}
        currentColor={currentSubject.color}
        currentSubjectLabel={currentSubject.label}
      />

      {/* Chart */}
      <ChartRenderer
        data={chartData}
        selectedSubject={selectedSubject}
        chartType={chartType}
        currentColor={currentSubject.color}
        currentSubjectLabel={currentSubject.label}
      />
    </div>
  );
}

// ============================================================
//  SUBCOMPONENTS
// ============================================================

// ---------- Chart Header ----------

interface ChartHeaderProps {
  chartType: ChartType;
  onChartTypeChange: (type: ChartType) => void;
}

function ChartHeader({ chartType, onChartTypeChange }: ChartHeaderProps) {
  return (
    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl">
            <TrendingUp className="w-5 h-5" />
          </div>
          <h2 className="text-base sm:text-xl font-extrabold text-slate-900 font-[iranBold]">
            نمودار روند پیشرفت تحصیلی
          </h2>
        </div>
        <p className="text-xs text-slate-500 font-[iranSans-r] mt-1">
          بررسی روند درصدگیری در آزمون‌های جامع
        </p>
      </div>

      {/* Chart type buttons */}
      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200/60 self-end lg:self-auto overflow-x-auto max-w-full">
        {[
          { type: "line" as const, icon: LineIcon, label: "خط‌شکسته" },
          { type: "area" as const, icon: AreaIcon, label: "ناحیه‌ای" },
          { type: "bar" as const, icon: BarChart2, label: "میله‌ای" },
        ].map(({ type, icon: Icon, label }) => (
          <button
            key={type}
            onClick={() => onChartTypeChange(type)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
              chartType === type
                ? "bg-white text-blue-600 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ---------- Subject Filter ----------

interface SubjectFilterProps {
  selectedSubject: string;
  onSubjectChange: (key: string) => void;
  isDropdownOpen: boolean;
  onDropdownToggle: () => void;
  onDropdownClose: () => void;
  currentColor: string;
  currentSubjectLabel: string;
}

function SubjectFilter({
  selectedSubject,
  onSubjectChange,
  isDropdownOpen,
  onDropdownToggle,
  onDropdownClose,
  currentColor,
  currentSubjectLabel,
}: SubjectFilterProps) {
  return (
    <div className="relative">
      {/* Mobile dropdown */}
      <div className="block sm:hidden">
        <button
          onClick={onDropdownToggle}
          className="w-full flex items-center justify-between bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-2xl text-xs font-bold text-slate-700 cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-md shadow-sm"
              style={{ backgroundColor: currentColor }}
            />
            <span>
              فیلتر درس: <strong className="text-slate-900">{currentSubjectLabel}</strong>
            </span>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform ${
              isDropdownOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isDropdownOpen && (
          <div className="absolute top-full mt-2 left-0 right-0 bg-white border border-slate-100 shadow-xl rounded-2xl p-2 z-50 space-y-1">
            {SUBJECTS.map((subject) => {
              const isSelected = selectedSubject === subject.key;
              return (
                <button
                  key={subject.key}
                  onClick={() => {
                    onSubjectChange(subject.key);
                    onDropdownClose();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-3 h-3 rounded-md shadow-sm"
                      style={{ backgroundColor: subject.color }}
                    />
                    <span>{subject.label}</span>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-blue-600" />}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Desktop filters */}
      <div className="hidden sm:flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs text-slate-400 font-bold shrink-0 ml-1">
          فیلتر درس:
        </span>
        {SUBJECTS.map((subject) => {
          const isActive = selectedSubject === subject.key;
          return (
            <button
              key={subject.key}
              onClick={() => onSubjectChange(subject.key)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer border ${
                isActive
                  ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20"
                  : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
              }`}
            >
              <span
                className="w-2.5 h-2.5 rounded-md shadow-sm"
                style={{ backgroundColor: isActive ? "#ffffff" : subject.color }}
              />
              <span>{subject.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ---------- Chart Renderer ----------

interface ChartRendererProps {
  data: ExamResult[];
  selectedSubject: string;
  chartType: ChartType;
  currentColor: string;
  currentSubjectLabel: string;
}

function ChartRenderer({
  data,
  selectedSubject,
  chartType,
  currentColor,
  currentSubjectLabel,
}: ChartRendererProps) {
  return (
    <div className="w-full h-[380px] sm:h-[400px] pt-2">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{ top: 25, right: 15, left: 10, bottom: 65 }}
        >
          {/* Grid lines */}
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />

          {/* X-Axis */}
          <XAxis
            dataKey="date"
            padding={{ left: 45, right: 45 }}
            stroke="#cbd5e1"
            interval={0}
            height={75}
            tickMargin={12}
            tick={<CustomXAxisTick />}
          />

          {/* Y-Axis (0-100%) */}
          <YAxis
            domain={[0, 100]}
            tick={{ fill: "#64748b", fontSize: 10, fontFamily: "inherit" }}
            stroke="#cbd5e1"
            tickFormatter={(value) => `${value}%`}
            width={42}
            tickMargin={6}
          />

          {/* Tooltip */}
          <Tooltip content={<CustomTooltip />} />

          {/* Legend */}
          <Legend
            verticalAlign="top"
            align="right"
            wrapperStyle={{ paddingBottom: "15px", fontSize: "11px" }}
          />

          {/* Chart content based on selection */}
          {selectedSubject === "all" ? (
            <AllSubjectsChart chartType={chartType} />
          ) : (
            <SingleSubjectChart
              subjectKey={selectedSubject}
              chartType={chartType}
              color={currentColor}
              label={currentSubjectLabel}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

// ---------- All Subjects Chart ----------

interface AllSubjectsChartProps {
  chartType: ChartType;
}

function AllSubjectsChart({ chartType }: AllSubjectsChartProps) {
  const configs = [
    { key: "general", label: "میانگین کل", color: "#6366f1", w: 3, size: 10 },
    { key: "math", label: "ریاضی", color: "#3b82f6", w: 2, size: 9 },
    { key: "science", label: "علوم", color: "#10b981", w: 2, size: 9 },
  ];

  const renderChart = (type: ChartType) => {
    if (type === "line") {
      return configs.map((c) => (
        <Line
          key={c.key}
          type="monotone"
          dataKey={c.key}
          name={c.label}
          stroke={c.color}
          strokeWidth={c.w}
          dot={{ r: c.key === "general" ? 4 : 3, strokeWidth: 2, fill: "#ffffff" }}
          activeDot={{ r: c.key === "general" ? 6 : 5 }}
        >
          <LabelList
            dataKey={c.key}
            position="top"
            offset={c.key === "general" ? 10 : 8}
            formatter={(v: any) => (v !== undefined ? `${v}%` : "")}
            fill={c.color}
            fontSize={c.size}
            fontWeight={700}
          />
        </Line>
      ));
    }

    if (type === "area") {
      return configs.slice(0, 2).map((c) => (
        <Area
          key={c.key}
          type="monotone"
          dataKey={c.key}
          name={c.label}
          stroke={c.color}
          fill={c.color}
          fillOpacity={c.key === "general" ? 0.15 : 0.1}
          strokeWidth={c.w}
        >
          <LabelList
            dataKey={c.key}
            position="top"
            offset={c.key === "general" ? 10 : 8}
            formatter={(v: any) => (v !== undefined ? `${v}%` : "")}
            fill={c.color}
            fontSize={c.size}
            fontWeight={700}
          />
        </Area>
      ));
    }

    // Bar
    return configs.map((c) => (
      <Bar
        key={c.key}
        dataKey={c.key}
        name={c.label}
        fill={c.color}
        radius={[4, 4, 0, 0]}
        barSize={12}
      >
        <LabelList
          dataKey={c.key}
          position="top"
          offset={5}
          formatter={(v: any) => (v !== undefined ? `${v}%` : "")}
          fill={c.color}
          fontSize={9}
          fontWeight={700}
        />
      </Bar>
    ));
  };

  return <>{renderChart(chartType)}</>;
}

// ---------- Single Subject Chart ----------

interface SingleSubjectChartProps {
  subjectKey: string;
  chartType: ChartType;
  color: string;
  label: string;
}

function SingleSubjectChart({
  subjectKey,
  chartType,
  color,
  label,
}: SingleSubjectChartProps) {
  const commonProps = {
    type: "monotone" as const,
    dataKey: subjectKey,
    name: label,
    stroke: color,
    strokeWidth: 3,
  };

  if (chartType === "line") {
    return (
      <Line {...commonProps} dot={{ r: 5, strokeWidth: 2, fill: "#ffffff" }} activeDot={{ r: 7 }}>
        <LabelList
          dataKey={subjectKey}
          position="top"
          offset={12}
          formatter={(v: any) => (v !== undefined ? `${v}%` : "")}
          fill={color}
          fontSize={11}
          fontWeight={800}
        />
      </Line>
    );
  }

  if (chartType === "area") {
    return (
      <Area {...commonProps} fill={color} fillOpacity={0.2} strokeWidth={3}>
        <LabelList
          dataKey={subjectKey}
          position="top"
          offset={12}
          formatter={(v: any) => (v !== undefined ? `${v}%` : "")}
          fill={color}
          fontSize={11}
          fontWeight={800}
        />
      </Area>
    );
  }

  // Bar
  return (
    <Bar
      dataKey={subjectKey}
      name={label}
      fill={color}
      radius={[6, 6, 0, 0]}
      barSize={24}
    >
      <LabelList
        dataKey={subjectKey}
        position="top"
        offset={7}
        formatter={(v: any) => (v !== undefined ? `${v}%` : "")}
        fill={color}
        fontSize={10}
        fontWeight={800}
      />
    </Bar>
  );
}

// ---------- Custom X-Axis Tick ----------

function CustomXAxisTick({ x, y, payload }: any) {
  return (
    <g transform={`translate(${x ?? 0},${y ?? 0})`}>
      {/* Desktop */}
      <text
        className="hidden sm:block"
        x={0}
        y={0}
        dy={15}
        textAnchor="middle"
        fill="#64748b"
        fontSize={10}
        fontFamily="inherit"
      >
        {payload?.value}
      </text>
      {/* Mobile (rotated) */}
      <text
        className="block sm:hidden"
        x={0}
        y={0}
        dy={10}
        textAnchor="middle"
        fill="#64748b"
        fontSize={10}
        fontFamily="inherit"
        transform="rotate(-90)"
      >
        {payload?.value}
      </text>
    </g>
  );
}

// ---------- Custom Tooltip ----------

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-slate-900/95 backdrop-blur-md text-white p-3 rounded-2xl shadow-xl border border-slate-700 text-xs space-y-1.5 min-w-[150px]">
      <div className="border-b border-slate-800 pb-1 font-bold text-slate-300">
        <span>تاریخ: {label}</span>
      </div>
      <div className="space-y-1 pt-1">
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-md" style={{ backgroundColor: entry.color }} />
              <span className="text-slate-300">{entry.name}:</span>
            </span>
            <span className="font-mono font-bold text-white">{entry.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}