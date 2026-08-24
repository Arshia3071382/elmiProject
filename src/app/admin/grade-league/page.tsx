// Admin grade league page - Main component
"use client";

import { useState, useEffect, useCallback } from "react";
import GradeHeader from "./GradeHeader";
import StudentForm from "./StudentForm";
import StudentList from "./StudentList";
import ActivityModal from "./ActivityModal";
import { GRADES, Student } from "./constants";

export default function AdminGradeLeaguePage() {
  // Student form state
  const [newName, setNewName] = useState("");
  const [newGrade, setNewGrade] = useState<number>(2);
  const [creating, setCreating] = useState(false);

  // Student list state
  const [gradeFilter, setGradeFilter] = useState<number>(2);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);

  // Activity modal state
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [activeCheckboxes, setActiveCheckboxes] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [searchActivity, setSearchActivity] = useState("");

  // Fetch students
  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/league/grade?grade=${gradeFilter}`).then((r) =>
        r.json()
      );
      if (Array.isArray(res)) setStudents(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [gradeFilter]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // Create student
  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    setCreating(true);
    try {
      const res = await fetch("/api/league/grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName, grade: newGrade }),
      });
      if (res.ok) {
        setNewName("");
        if (newGrade === gradeFilter) {
          fetchStudents();
        } else {
          setGradeFilter(newGrade);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  // Open activity modal
  const handleOpenModal = (student: Student) => {
    setSelectedStudent(student);
    setActiveCheckboxes(student.selectedActivities || []);
  };

  // Toggle activity
  const toggleActivity = (id: string) => {
    setActiveCheckboxes((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Save activities
  const handleSaveActivities = async () => {
    if (!selectedStudent) return;
    setSaving(true);
    try {
      const res = await fetch("/api/league/grade", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: selectedStudent._id,
          selectedActivities: activeCheckboxes,
        }),
      });
      if (res.ok) {
        setSelectedStudent(null);
        fetchStudents();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-slate-100 text-slate-800 p-4 md:p-8 font-[iranBold]">
      <div className="max-w-6xl mx-auto space-y-8">
        <GradeHeader />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <StudentForm
            name={newName}
            grade={newGrade}
            creating={creating}
            onNameChange={setNewName}
            onGradeChange={setNewGrade}
            onSubmit={handleCreateStudent}
          />

          <StudentList
            students={students}
            loading={loading}
            gradeFilter={gradeFilter}
            onGradeFilterChange={setGradeFilter}
            onStudentSelect={handleOpenModal}
          />
        </div>
      </div>

      <ActivityModal
        student={selectedStudent}
        activeCheckboxes={activeCheckboxes}
        searchActivity={searchActivity}
        saving={saving}
        onClose={() => setSelectedStudent(null)}
        onToggle={toggleActivity}
        onSearchChange={setSearchActivity}
        onSave={handleSaveActivities}
      />
    </div>
  );
}