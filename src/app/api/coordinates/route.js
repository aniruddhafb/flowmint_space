import { NextResponse } from "next/server";
import axios, { all } from "axios";
import dbConnect from "@/lib/dbConnect";
import coordinates from "../../../models/coordinates";

export async function GET(request) {
  dbConnect();

  const all_coordinates = await coordinates.find();

  let arr = [];

  for (let i = 0; i < all_coordinates.length; i++) {
    JSON.parse(all_coordinates[i]["coordinates"]).map((e) => arr.push(e));
  }

  return NextResponse.json(arr);
}

export async function POST(request) {
  dbConnect();

  const { new_coordinate } = await request.json();

  const save_coordinate = await coordinates.create({
    coordinates: new_coordinate,
  });

  return NextResponse.json(save_coordinate);
}
