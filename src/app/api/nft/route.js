import { NextResponse } from "next/server";
import axios from "axios";
import dbConnect from "@/lib/dbConnect";
import NFT from "../../../models/NFT";
export async function GET(request) {
  dbConnect();
  const nfts = await NFT.find();
  return NextResponse.json(nfts);
}

export async function POST(request) {
  dbConnect();

  const { metadata } = await request.json();

  const new_nft = await NFT.create({
    metadata,
  });

  return NextResponse.json(new_nft);
}
