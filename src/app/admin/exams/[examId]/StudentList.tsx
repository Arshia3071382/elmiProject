import StudentItem from "./StudentItem";
import { IStudentResult } from "./constants";

interface StudentListProps {
  students: IStudentResult[];
  onStudentSelect: (student: IStudentResult) => void;
}

export default function StudentList({ students, onStudentSelect }: StudentListProps) {
  if (students.length === 0) {
    return (
      <div className="text-center py-8 text-slate-400 font-[iranSans-r] text-sm">
        هیچ دانش‌آموزی یافت نشد.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {[...students]
        .sort((a, b) => (a.rank || 999) - (b.rank || 999))
        .map((stu) => (
          <StudentItem key={stu.studentId || stu._id} student={stu} onSelect={onStudentSelect} />
        ))}
    </div>
  );
}