import { connectDB } from "@/db/connection";
import Event from "@/model/eventsModel";
import { NextRequest, NextResponse } from "next/server"

connectDB();
export async function POST(req: NextRequest) {
    try { 
        const { _id } = await req.json();
        await Event.findByIdAndDelete(_id)
        return NextResponse.json({ message: "Event is deleted" }, { status: 201 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Internal error" }, { status: 500 });
    }
}