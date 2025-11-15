import { Role } from "@prisma/client";
import { z } from "zod";

export const MessageSchema = z.object({
	id: z.string(),
	createdAt: z.date(),
	role: z.nativeEnum(Role),
	content: z.string(),
	tokenCount: z.number(),
});

export const ErrorResponseSchema = z.object({
	error: z.string(),
});

export const GetChatSchema = z.object({
	id: z.string(),
	createdAt: z.date(),
	title: z.string(),
	messages: z.array(MessageSchema),
});

export const IDParamsSchema = z.object({
	params: z.promise(z.object({ id: z.string() })),
});

export const CreateChatRequestSchema = z.object({
	message: z.string(),
});

export const CreateChatResponseSchema = z.object({
	id: z.string(),
	message: z.string(),
});
