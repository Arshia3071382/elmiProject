// Exam subjects editor component
"use client";

import { useState } from "react";
import { BookOpen, Settings } from "lucide-react";
import SubjectCard from "./SubjectCard";
import AddSubjectForm from "./AddSubjectForm";
import { IExamSubject, DEFAULT_EXAM_SUBJECTS } from "./constants";

interface ExamSubjectsEditorProps {
  examSubjects: IExamSubject[];
  isEditing: boolean;
  saving: boolean;
  onToggleEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
  onSubjectChange: (index: number, field: keyof IExamSubject, value: number) => void;
  onRemoveSubject: (index: number) => void;
  onAddSubject: (subject: IExamSubject) => void;
}

export default function ExamSubjectsEditor({
  examSubjects,
  isEditing,
  saving,
  onToggleEdit,
  onCancel,
  onSave,
  onSubjectChange,
  onRemoveSubject,
  onAddSubject,
}: ExamSubjectsEditorProps) {
  const [newName, setNewName] = useState("");
  const [newTotal, setNewTotal] = useState<number | "">("");
  const [newCoeff, setNewCoeff] = useState<number | "">(1);

  const handleAddSubject = () => {
    if (!newName.trim() || newTotal === "" || Number(newTotal) <= 0) {
      alert("لطفاً نام درس و تعداد کل سوالات معتبر وارد کنید.");
      return;
    }
    onAddSubject({
      subjectName: newName.trim(),
      totalQuestions: Number(newTotal),
      coefficient: Number(newCoeff) || 1,
    });
    setNewName("");
    setNewTotal("");
    setNewCoeff(1);
  };

  // ✅ حتماً باید JSX برگردونه
  return (
    <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-emerald-600" />
          <h3 className="font-black text-slate-800 text-sm sm:text-base">
            ساختار دروس و تعداد کل سوالات این آزمون
          </h3>
        </div>
        {!isEditing ? (
          <button
            onClick={onToggleEdit}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <Settings className="w-4 h-4" />
            مدیریت و ویرایش دروس
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={onCancel}
              className="bg-slate-200 text-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold"
            >
              انصراف
            </button>
            <button
              onClick={onSave}
              disabled={saving}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 rounded-xl text-xs font-bold disabled:opacity-50"
            >
              {saving ? "در حال ذخیره..." : "ذخیره تغییرات ساختار دروس"}
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {examSubjects.map((sub, idx) => (
          <SubjectCard
            key={idx}
            subject={sub}
            index={idx}
            isEditing={isEditing}
            onRemove={onRemoveSubject}
            onSubjectChange={onSubjectChange}
          />
        ))}
      </div>

      {isEditing && (
        <AddSubjectForm
          name={newName}
          total={newTotal}
          coefficient={newCoeff}
          onNameChange={setNewName}
          onTotalChange={setNewTotal}
          onCoefficientChange={setNewCoeff}
          onAdd={handleAddSubject}
        />
      )}
    </div>
  );
}