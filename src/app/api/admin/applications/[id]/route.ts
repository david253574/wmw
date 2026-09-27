import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    const { status } = await req.json();
    let dataToUpdate: any = { status };
    
    // If approving, generate a card number if not exists
    if (status === "APPROVED") {
      const app = await prisma.application.findUnique({ where: { id: params.id } });
      if (app && !app.cardNumber) {
        // Generate random 8 digit card number
        dataToUpdate.cardNumber = "WME-" + Math.floor(10000000 + Math.random() * 90000000).toString();
        dataToUpdate.issueDate = new Date();
        const expiry = new Date();
        expiry.setFullYear(expiry.getFullYear() + 2); // 2 years validity
        dataToUpdate.expiryDate = expiry;
      }
    }

    const application = await prisma.application.update({
      where: { id: params.id },
      data: dataToUpdate
    });
    
    return NextResponse.json(application);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    const application = await prisma.application.findUnique({
      where: { id: params.id }
    });
    return NextResponse.json(application);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
