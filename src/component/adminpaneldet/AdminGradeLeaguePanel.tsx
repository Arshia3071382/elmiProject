// Main grade league management component
"use client";

import { useState, useEffect, useCallback } from "react";
import GradeSelector from "./grade-league/GradeSelector";
import GradeHeader from "./grade-league/GradeHeader";
import PublishBar from "./grade-league/PublishBar";
import StudentForm from "./grade-league/StudentForm";
import StudentTable from "./grade-league/StudentTable";
import StudentEditModal from "./grade-league/StudentEditModal";
import ActivityModal from "./grade-league/ActivityModal";
import { LEAGUE_ACTIVITIES } from "../../../lib/leagueActivities";

interface IStudent {
  _id: string;
  firstName: string;
  lastName: string;
  nationalId: string;
  grade: number;
  selectedActivities: string[];
  totalScore: number;
  published: boolean;
}

export default function AdminGradeLeaguePanel() {
  // States
  const [activeGrade, setActiveGrade] = useState<number | null>(null);
  const [students, setStudents] = useState<IStudent[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);

  // New student form
  const [newFirstName, setNewFirstName] = useState<string>("");
  const [newLastName, setNewLastName] = useState<string>("");
  const [newNationalId, setNewNationalId] = useState<string>("");
  const [creating, setCreating] = useState<boolean>(false);

  // Edit student
  const [editingStudent, setEditingStudent] = useState<IStudent | null>(null);
  const [editFirstName, setEditFirstName] = useState<string>("");
  const [editLastName, setEditLastName] = useState<string>("");
  const [editNationalId, setEditNationalId] = useState<string>("");
  const [editingSave, setEditingSave] = useState<boolean>(false);

  // Activity modal
  const [selectedStudent, setSelectedStudent] = useState<IStudent | null>(null);
  const [activeCheckboxes, setActiveCheckboxes] = useState<string[]>([]);
  const [saving, setSaving] = useState<boolean>(false);
  const [searchActivity, setSearchActivity] = useState<string>("");

  // لیست پایه‌ها برای نوار ناوبری بالا
  const allGrades = [2, 3, 4, 5, 6, 7, 8, 9];

  // Fetch students
  const fetchStudents = useCallback(async () => {
    if (activeGrade === null) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/league/grade?grade=${activeGrade}`);
      const data = await res.json();
      if (data.success && data.students) {
        setStudents(data.students);
        if (data.lastUpdate) setLastUpdate(data.lastUpdate);
      }
    } catch (err) {
      console.error("Error fetching students:", err);
    } finally {
      setLoading(false);
    }
  }, [activeGrade]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // Create student
  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFirstName.trim() || !newLastName.trim() || !newNationalId.trim() || activeGrade === null) return;

    setCreating(true);
    try {
      const res = await fetch("/api/league/grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: newFirstName.trim(),
          lastName: newLastName.trim(),
          nationalId: newNationalId.trim(),
          grade: activeGrade,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setNewFirstName("");
        setNewLastName("");
        setNewNationalId("");
        await fetchStudents();
      } else {
        alert(`Error: ${data.error || "Failed to create student"}`);
      }
    } catch (err) {
      console.error("Error creating student:", err);
      alert("Server error");
    } finally {
      setCreating(false);
    }
  };

  // Delete student
  const handleDeleteStudent = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await fetch(`/api/league/grade?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        await fetchStudents();
      } else {
        alert(`Error: ${data.error || "Failed to delete"}`);
      }
    } catch (err) {
      console.error("Error deleting student:", err);
      alert("Server error");
    }
  };

  // Edit student
  const handleEditStudent = (student: IStudent) => {
    setEditingStudent(student);
    setEditFirstName(student.firstName || "");
    setEditLastName(student.lastName || "");
    setEditNationalId(student.nationalId || "");
  };

  const handleSaveEdit = async () => {
    if (!editingStudent) return;
    setEditingSave(true);
    try {
      const res = await fetch("/api/league/grade", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingStudent._id,
          firstName: editFirstName.trim(),
          lastName: editLastName.trim(),
          nationalId: editNationalId.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setEditingStudent(null);
        await fetchStudents();
      } else {
        alert(`Error: ${data.error || "Failed to update"}`);
      }
    } catch (err) {
      console.error("Error updating student:", err);
      alert("Server error");
    } finally {
      setEditingSave(false);
    }
  };

  // Activity modal handlers
  const handleOpenModal = (student: IStudent) => {
    setSelectedStudent(student);
    setActiveCheckboxes([]);
    setSearchActivity("");
  };

  const toggleActivity = (id: string) => {
    setActiveCheckboxes((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSaveActivities = async () => {
    if (!selectedStudent) return;
    setSaving(true);
    const addedScore = activeCheckboxes.reduce((sum, id) => {
      const activity = LEAGUE_ACTIVITIES.find((a) => a.id === id);
      return sum + (activity?.score || 0);
    }, 0);

    try {
      const res = await fetch("/api/league/grade", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedStudent._id,
          selectedActivities: activeCheckboxes,
          addedScore,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setActiveCheckboxes([]);
        setSearchActivity("");
        setSelectedStudent(null);
        await fetchStudents();
      } else {
        alert(`Error: ${data.error || "Failed to save activities"}`);
      }
    } catch (err) {
      console.error("Error saving activities:", err);
      alert("Server error");
    } finally {
      setSaving(false);
    }
  };

  // Publish changes
  const handlePublishChanges = async () => {
    setIsPublishing(true);
    try {
      const res = await fetch("/api/league/grade", { method: "PATCH" });
      const data = await res.json();
      if (data.success) {
        setLastUpdate(data.lastUpdate);
        alert("Changes published successfully!");
        await fetchStudents();
      } else {
        alert(`Error: ${data.error || "Failed to publish"}`);
      }
    } catch (err) {
      console.error("Error publishing:", err);
      alert("Server error");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div dir="rtl" className="w-full bg-slate-50 min-h-screen p-4 md:p-8 font-[IRANSansXFaNum-Bold] text-slate-800">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* نوار ناوبری سریع پایه‌ها (نمایش در صورت انتخاب یک پایه) */}
        {activeGrade !== null && (
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-2 overflow-x-auto">
            <span className="text-sm font-bold text-slate-500 pl-4 border-l ml-2">تغییر سریع پایه:</span>
            {allGrades.map((g) => (
              <button
                key={g}
                onClick={() => setActiveGrade(g)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition whitespace-nowrap ${
                  activeGrade === g 
                    ? "bg-blue-600 text-white shadow-md" 
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                پایه {g}
              </button>
            ))}
            <button
              onClick={() => setActiveGrade(null)}
              className="mr-auto px-4 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-bold hover:bg-red-100 whitespace-nowrap border border-red-100"
            >
              بازگشت به منوی اصلی
            </button>
          </div>
        )}

        {activeGrade === null ? (
          <GradeSelector onSelectGrade={setActiveGrade} />
        ) : (
          <>
            <GradeHeader gradeId={activeGrade} onBack={() => setActiveGrade(null)} />
            <PublishBar 
              lastUpdate={lastUpdate} 
              isPublishing={isPublishing} 
              onPublish={handlePublishChanges} 
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <StudentForm
                gradeId={activeGrade}
                firstName={newFirstName}
                lastName={newLastName}
                nationalId={newNationalId}
                creating={creating}
                onFirstNameChange={setNewFirstName}
                onLastNameChange={setNewLastName}
                onNationalIdChange={setNewNationalId}
                onSubmit={handleCreateStudent}
              />
              
              <StudentTable
                students={students}
                gradeId={activeGrade}
                loading={loading}
                onEdit={handleEditStudent}
                onDelete={handleDeleteStudent}
                onOpenModal={handleOpenModal}
              />
            </div>
          </>
        )}
      </div>

      {/* Modals */}
      <StudentEditModal
        student={editingStudent}
        firstName={editFirstName}
        lastName={editLastName}
        nationalId={editNationalId}
        saving={editingSave}
        onClose={() => setEditingStudent(null)}
        onFirstNameChange={setEditFirstName}
        onLastNameChange={setEditLastName}
        onNationalIdChange={setEditNationalId}
        onSave={handleSaveEdit}
      />

      <ActivityModal
        student={selectedStudent}
        activeCheckboxes={activeCheckboxes}
        searchActivity={searchActivity}
        saving={saving}
        onClose={() => setSelectedStudent(null)}
        onToggleActivity={toggleActivity}
        onSearchChange={setSearchActivity}
        onSave={handleSaveActivities}
      />
    </div>
  );
}