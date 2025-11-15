import type { z } from "zod";
import type {
	CreateChatRequestSchema,
	CreateChatResponseSchema,
	ErrorResponseSchema,
	GetChatSchema,
	IDParamsSchema,
	MessageSchema,
} from "@/app/schemas/schemas";

export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
export type Message = z.infer<typeof MessageSchema>;
export type GetChatDTO = z.infer<typeof GetChatSchema>;
export type IDParams = z.infer<typeof IDParamsSchema>;
export type CreateChatRequestDTO = z.infer<typeof CreateChatRequestSchema>;
export type CreateChatResponseDTO = z.infer<typeof CreateChatResponseSchema>;
