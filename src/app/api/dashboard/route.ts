import { NextResponse, NextRequest } from 'next/server';
import dbConnect from '../../../../lib/dbConnect';
import Student from '../../../../models/Student';
import GradeStudent from '../../../../models/GradeStudent';
import { EliteStudent } from '../../../../models/EliteStudent';
import { getSessionStudentId } from '../../../../lib/auth';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const studentId = await getSessionStudentId(req);
    if (!studentId) {
      return NextResponse.json(
        { success: false, message: 'دسترسی غیرمجاز. لطفاً وارد شوید.' },
        { status: 401 }
      );
    }

    const student = await Student.findById(studentId).select('firstName lastName grade isActive');
    if (!student || !student.isActive) {
      return NextResponse.json(
        { success: false, message: 'حساب کاربری یافت نشد.' },
        { status: 404 }
      );
    }

    // بررسی ثبت اطلاعات توسط مسئول علمی
    const gradeLeagueData = await GradeStudent.findOne({ studentId }).catch(() => null);
    const eliteLeagueData = await EliteStudent.findOne({ studentId }).catch(() => null);

    // اگر گرید لیگ ثبت نشده باشد یعنی اطلاعات کامل توسط مسئول ثبت نشده است
    const isProfileComplete = !!gradeLeagueData;

    const totalScore = gradeLeagueData?.totalScore || 0;
    const currentLevel = Math.floor(totalScore / 1000) + 1;
    const scoreToNextLevel = 1000 - (totalScore % 1000);

    return NextResponse.json({
      success: true,
      data: {
        isComplete: isProfileComplete, // پرچم وضعیت برای کلاینت
        profile: {
          name: `${student.firstName} ${student.lastName}`,
          grade: student.grade || 7,
          level: isProfileComplete ? `سطح ${currentLevel} - پژوهشگر جوان` : 'عضو جدید',
          totalScore,
          scoreToNextLevel,
        },
        gradeLeague: gradeLeagueData ? {
          score: gradeLeagueData.totalScore || 0,
          rank: gradeLeagueData.rank || 24,
          totalStudents: 320,
          scientificLevelTitle: 'شهید رضایی‌نژاد',
        } : null,
        eliteLeague: eliteLeagueData ? {
          score: eliteLeagueData.score || 0,
          rank: eliteLeagueData.rank || 12,
          category: eliteLeagueData.category === 'elementary' ? 'ابتدایی' : 'متوسطه',
        } : null,
        badges: isProfileComplete ? [
          { title: 'اولین آزمون', icon: '🏆' },
          { title: 'دانشمند پرتلاش', icon: '🔬' },
          { title: 'پژوهشگر کوچک', icon: '⭐' },
        ] : [],
        lastLeagueUpdate: 'امروز',
      },
    });
  } catch (error) {
    console.error('Dashboard API Error:', error);
    return NextResponse.json(
      { success: false, message: 'خطای داخلی سرور' },
      { status: 500 }
    );
  }
}