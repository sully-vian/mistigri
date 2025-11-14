import { Role } from "@prisma/client";
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

// create a chat
export async function POST(request: Request): Promise<NextResponse<any>> {
	const body = await request.json().catch(() => {});
	const messageContent = body.message as string;

	// ensure exist
	const dummyUser = await prisma.user.upsert({
		where: { email: "temp.user@example.com" },
		update: { name: "Temp Chat User" },
		create: {
			name: "Temp Chat User",
			email: "temp.user@example.com",
			password: "123456",
		},
	});

	const newChat = await prisma.chat.create({
		data: {
			user: { connect: { id: dummyUser.id } },
			messages: {
				create: {
					role: Role.USER,
					content: messageContent,
					tokenCount: 0, // dummy
				},
			},
		},
		select: {
			id: true,
			createdAt: true,
			user: { select: { name: true } },
			messages: true,
		},
	});
	return NextResponse.json(newChat);
}
