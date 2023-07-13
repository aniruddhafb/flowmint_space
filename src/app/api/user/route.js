import { NextResponse } from "next/server";
import axios, { all } from "axios";
import dbConnect from "@/lib/dbConnect";
import User from "../../../models/User";

export async function GET(request) {
  dbConnect();

  const { wallet } = await request.json();
  const user = await User.findOne({ wallet });
  if (!user) {
    return NextResponse.json("cannot find user");
  }

  return NextResponse.json(user);
}

export async function POST(request) {
  dbConnect();

  const { wallet } = await request.json();

  const save_user = await User.create({
    wallet,
  });

  return NextResponse.json(save_user);
}
