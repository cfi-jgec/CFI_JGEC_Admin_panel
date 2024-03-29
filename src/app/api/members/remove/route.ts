import { connectDB } from "@/db/connection"; 
import Member from "@/model/membersModel";
import { NextRequest, NextResponse } from "next/server"

connectDB();
export async function POST(req: NextRequest) {
    try {
        const { _id } = await req.json();
        await Member.findByIdAndDelete(_id);
        return NextResponse.json({ message: "Member is removed successfully" }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "Internal error" }, { status: 500 });
    }
}