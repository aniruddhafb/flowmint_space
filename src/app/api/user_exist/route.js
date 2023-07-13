import { NextResponse } from "next/server";
import axios, { all } from "axios";
import dbConnect from "@/lib/dbConnect";
import User from "../../../models/User";

export async function POST(request) {
  dbConnect();

  const { wallet } = await request.json();
  const user = await User.findOne({ wallet });
  if (!user) {
    return NextResponse.json({ success: false, message: "user doesn't exist" });
  }

  return NextResponse.json({ success: true, user });
}
