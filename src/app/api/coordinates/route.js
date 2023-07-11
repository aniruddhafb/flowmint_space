import { NextResponse } from "next/server";
import axios from "axios";
import dbConnect from "@/lib/dbConnect";
import coordinates from "../../../models/coordinates";

export async function GET(request) {
  dbConnect();

  const all_coordinates = await coordinates.find();

  return new Response(all_coordinates);
}

export async function POST(request) {
  dbConnect();

  const { new_coordinate } = await request.json();

  const save_coordinate = await coordinates.create({
    coordinates: new_coordinate,
  });

  return NextResponse.json(save_coordinate);
}
