import { connectDB } from "@/db/connection";
import Member from "@/model/membersModel";
import { NextRequest, NextResponse } from "next/server"

connectDB();
export async function GET(req: NextRequest, { params }: { params: { year: string } }) {
    try {
        const { year } = params;
        const members = await Member.find({ year });
        return NextResponse.json({ members }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Internal error" }, { status: 500 });
    }
}