import { authOptions } from "@backend/lib/auth";
import { connectToDatabase } from "@backend/lib/db";
import Video from "@backend/models/Video";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";


export async function GET() {
  try {
    await connectToDatabase();
   const videos  = await Video.find({}).sort({ createdAt: -1 }).lean()

   if(!videos || videos.length==0){
    return NextResponse.json([],{status:200})
   }
   return NextResponse.json(videos)

  } catch { return NextResponse.json({error:"Failed to load fetch videos"},{status:500})}
}

export async function POST(request:NextRequest){
   try{
    const session= await  getServerSession(authOptions)
    if(!session){
      return NextResponse.json({error:"Unauthorized"},{status:401})
    }
    await connectToDatabase()

    const body = (await request.json()) as {
      title?: string;
      description?: string;
      videoUrl?: string;
      thumbnailUrl?: string;
      controls?: boolean;
      transformation?: { quality?: number };
    };
    if(
      !body.title || !body.description || !body.videoUrl || !body.thumbnailUrl
    ){
      return NextResponse.json({error:"Missing required fields"},{status:400})
    }
const videoData={
  ...body, 
  controls:body?.controls?? true,
  transformation: {
    height: 1920,
    width: 1080,
    quality: body.transformation?.quality?? 100
  }

};

   const newVideo= await Video.create(videoData)
   return NextResponse.json(newVideo);
   }catch{
    return NextResponse.json({error:"Failed to create video"},{status:500})
   }
}