import { Role } from "@prisma/client";
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import type {
	ErrorResponse,
	GetChatDTO,
	IDParams,
	Message,
} from "@/app/types/types";

// GET: return the chat with its messages (ordered)
export async function GET(
	_request: Request,
	{ params }: IDParams,
): Promise<NextResponse<GetChatDTO | ErrorResponse>> {
	const { id } = await params;

	try {
		const chat = await prisma.chat.findUnique({
			where: { id },
			select: {
				id: true,
				createdAt: true,
				title: true,
				messages: { orderBy: { createdAt: "asc" } },
			},
		});

		if (!chat) {
			return NextResponse.json({ error: "Chat not found" }, { status: 404 });
		}
		return NextResponse.json(chat);
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: "Server error" }, { status: 500 });
	}
}

// add a new message to the chat and return the generated response (use a dummy)
export async function POST(
	request: Request,
	{ params }: IDParams,
): Promise<NextResponse<Message | ErrorResponse>> {
	const { id } = await params;
	try {
		const json = await request.json().catch(() => ({}));
		const { message: messageContent } = json;

		const chat = await prisma.chat.findUnique({ where: { id } });
		if (!chat) {
			return NextResponse.json({ error: "Chat not found" }, { status: 404 });
		}

		// Dummy before actual generation is called
		const replyContent = `Echo: ${messageContent}`;
		const tokenCount = -1; // placeholder
		const replyTokenCount = -1; // placeholder

		await prisma.message.create({
			data: {
				chat: { connect: { id } },
				role: Role.USER,
				content: messageContent,
				tokenCount,
			},
		});

		const assistantMessage = await prisma.message.create({
			data: {
				chat: { connect: { id } },
				role: Role.MISTIGRI,
				content: replyContent,
				tokenCount: replyTokenCount,
			},
		});
		return NextResponse.json(assistantMessage);
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: "Server error" }, { status: 500 });
	}
}
