import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // In a real app, upload base64 strings to cloud storage and save URLs
    // For this MVP, we will save the data URLs directly if they aren't too massive, 
    // or just assume we have mock URLs to save DB space if they are large.
    // However, since SQLite supports large text blocks, we can save base64 directly for the demo.
    
    const application = await prisma.application.create({
      data: {
        legalName: body.legalName,
        preferredName: body.preferredName,
        dob: body.dob,
        gender: body.gender,
        nationality: body.nationality,
        phone: body.phone,
        email: body.email,
        address: body.address,
        
        idType: body.idType,
        idNumber: body.idNumber,
        idDocumentUrl: body.idDocumentUrl, // Store base64 string
        
        fanClubAffiliation: body.fanClubAffiliation,
        socialMediaHandle: body.socialMediaHandle,
        favoriteMovie: body.favoriteMovie,
        accessLevel: body.accessLevel,
        
        emergencyName: body.emergencyName,
        emergencyRelation: body.emergencyRelation,
        emergencyPhone: body.emergencyPhone,
        emergencyEmail: body.emergencyEmail,
        
        photoUrl: body.photoUrl,           // Store base64 string
        cardHolderName: body.cardHolderName,
        signatureUrl: body.signatureUrl,   // Store base64 string
        
        status: "PENDING",
        // cardNumber will be generated upon approval
      }
    });

    return NextResponse.json({ success: true, application });
  } catch (error: any) {
    console.error("API error", error);
    return NextResponse.json({ error: error.message || "Failed to submit" }, { status: 500 });
  }
}
