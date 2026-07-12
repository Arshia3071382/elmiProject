import { NextResponse } from "next/server";
import { dbConnect } from "./../../../../lib/dbConnect";
import { EliteStudent } from "./../../../../models/EliteStudent";

// GET: Fetch top 20 students sorted by score descending
export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || "elementary";

    const students = await EliteStudent.find({ category })
      .sort({ score: -1 }) // Automatic sorting based on highest scores
      .limit(20);         // Restrict strictly to top 20 elite nodes

    return NextResponse.json(students, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch leaderboard data" }, { status: 500 });
  }
}

// POST: Add a new elite student record
export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { name, grade, score, category } = body;

    if (!name || !grade || score === undefined || !category) {
      return NextResponse.json({ error: "Missing required payload fields" }, { status: 400 });
    }

    const newStudent = await EliteStudent.create({ name, grade, score, category });
    return NextResponse.json(newStudent, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Insertion failed" }, { status: 500 });
  }
}

// PUT: Update score, name, or grade of an existing student
export async function PUT(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { id, name, grade, score, category } = body;

    if (!id) return NextResponse.json({ error: "Student ID required" }, { status: 400 });

    const updatedStudent = await EliteStudent.findByIdAndUpdate(
      id,
      { name, grade, score, category },
      { new: true } // Return updated document immediately
    );

    return NextResponse.json(updatedStudent, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

// DELETE: Remove a student from the elite board
export async function DELETE(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "Student ID required" }, { status: 400 });

    await EliteStudent.findByIdAndDelete(id);
    return NextResponse.json({ message: "Student deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Deletion failed" }, { status: 500 });
  }
}