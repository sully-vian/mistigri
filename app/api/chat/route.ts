import { Role } from "@prisma/client";
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import type { CreateChatResponseDTO, ErrorResponse } from "@/app/types/types";
import { auth } from "@/auth";

// create a chat
export async function POST(
	request: Request,
): Promise<NextResponse<CreateChatResponseDTO | ErrorResponse>> {
	const session = await auth();
	if (!session?.user?.id) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}
	const body = await request.json().catch(() => {});
	const messageContent = body.message as string;

	const newChat = await prisma.chat.create({
		data: {
			user: { connect: { id: session.user.id } },
			messages: {
				create: {
					role: Role.USER,
					content: messageContent,
					tokenCount: 0, // dummy
				},
			},
			title: "[dummy title]",
		},
		select: {
			id: true,
			createdAt: true,
			user: { select: { name: true } },
			messages: true,
		},
	});

	// Dummy before actual generation is called
	const replyContent = `Echo: ${messageContent}`;
	const tokenCount = -1; // placeholder
	const replyTokenCount = -1; // placeholder

	// TODO: use createMany or Promise.all
	await prisma.message.create({
		data: {
			chat: { connect: { id: newChat.id } },
			role: Role.USER,
			content: messageContent,
			tokenCount,
		},
	});

	await prisma.message.create({
		data: {
			chat: { connect: { id: newChat.id } },
			role: Role.MISTIGRI,
			content: replyContent,
			tokenCount: replyTokenCount,
		},
	});

	return NextResponse.json({ message: replyContent, id: newChat.id });
}
