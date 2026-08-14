// lib/auth.ts
import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-student-secret-key';

export async function getSessionStudentId(req: NextRequest | Request): Promise<string | null> {
  try {
    // استخراج کوکی از ریکوئست (سازگار با NextRequest و Request معمولی)
    let token: string | undefined;

    if ('cookies' in req && typeof req.cookies.get === 'function') {
      token = req.cookies.get('student_token')?.value;
    } else if (req.headers && typeof req.headers.get === 'function') {
      const cookieHeader = req.headers.get('cookie');
      if (cookieHeader) {
        const cookies = Object.fromEntries(
          cookieHeader.split('; ').map(c => c.split('='))
        );
        token = cookies['student_token'];
      }
    }

    if (!token) return null;

    // رمزگشایی توکن و استخراج شناسه
    const decoded = jwt.verify(token, JWT_SECRET) as { studentId: string };
    return decoded.studentId || null;
  } catch (error) {
    console.error('Session verification error:', error);
    return null;
  }
}