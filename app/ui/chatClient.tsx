"use client";

import { Role } from "@prisma/client";
import { useRouter } from "next/navigation";
import type { User } from "next-auth";
import { type FormEvent, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import type { Message } from "@/app/types/types";

export default function ChatClient({
	user,
	chatID,
}: {
	user?: User;
	chatID?: string;
}) {
	const router = useRouter();
	const [messages, setMessages] = useState<Message[]>([
		{
			id: "m1",
			role: Role.USER,
			content: "Show me a demo message",
			createdAt: new Date(),
			tokenCount: -1,
		},
		{
			id: "m2",
			role: Role.MISTIGRI,
			content:
				"Hi there! This is a sample message created for demonstration purposes. Feel free to customize it, expand it, or replace it entirely to suit your needs. Let me know if you'd like a more formal, fun, or professional version!",
			createdAt: new Date(),
			tokenCount: -1,
		},
	]);
	const [input, setInput] = useState<string>("");
	const [isPending, setIsPending] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	async function handleSend(e: FormEvent) {
		e.preventDefault();
		const trimmed = input.trim();
		if (!trimmed || isPending) {
			return;
		}
		setError(null);
		setIsPending(true);

		const tempId = `temp${Date.now()}`;
		const tempMessage: Message = {
			id: tempId,
			role: Role.USER,
			content: trimmed,
			createdAt: new Date(),
			tokenCount: -1,
		};
		setMessages((s) => [...s, tempMessage]);
		setInput("");

		try {
			if (!chatID) {
				// if "new chat"
				const res = await fetch("/api/chat", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ message: trimmed }),
				});
				if (!res.ok) {
					const txt = await res.text().catch(() => res.statusText);
					throw new Error(txt || "Request failed");
				}
				const data = await res.json().catch(() => null);
				const newID = data.id;
				if (!newID) {
					throw new Error("Server did not returnnew chat id");
				}
				router.push(`/chats/${newID}`);
				return;
			}
			const res = await fetch(`/api/${chatID}`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ message: trimmed }),
			});
			if (!res.ok) {
				const txt = await res.text().catch(() => res.statusText);
				throw new Error(txt || "Request failed");
			}
			const data = await res.json().catch(() => null);

			// FIXME: server responds with single msg, not full conv
			// server is expected to return the ai's response
			const serverMessages = // default to empty array
				(Array.isArray(data?.messages) && data.messages) || [];

			serverMessages.forEach((msg: any) => {
				console.log(msg);
			});

			const mapped: Message[] = serverMessages.map((message: any) => ({
				id: String(message?.id ?? "[empty id]"),
				role: message.role === "USER" ? Role.USER : Role.MISTIGRI,
				content: String(message.content ?? "[empty content]"),
				createdAt: message.createdAt ?? new Date(0),
			}));
			setMessages((prev) => [...prev, ...mapped]);
		} catch (err) {
			if (!(err instanceof Error)) {
				setError("Failed to send message");
			} else {
				setError(err.message);
			}
		} finally {
			setIsPending(false);
		}
	}

	return (
		<div className="flex flex-col h-full justify-between w-[50%]">
			{/* messages area */}
			<div>
				{messages.map((message) => {
					let alignClass =
						message.role === Role.USER ? "justify-end" : "justify-start";
					alignClass = message.role === Role.USER ? "ml-auto" : "mr-auto";
					return (
						<div
							key={message.id}
							className={`${alignClass} standard-dialog w-fit max-w-[80%] mb-4`}
						>
							<p className="text-base whitespace-pre-wrap">{message.content}</p>
							<p className="text-xs text-(--tertiary)">
								{message.createdAt.toISOString()}
							</p>
							<p className="text-xs text-(--tertiary)">{message.role}</p>
						</div>
					);
				})}
			</div>
			{error && (
				<div role="alert" className="text-red-600 mb-2">
					{error}
				</div>
			)}

			{/* input */}
			<form
				onSubmit={handleSend}
				className="standard-dialog flex items-center flex-row"
			>
				<TextareaAutosize
					id="input"
					placeholder="Ask Mistigri"
					value={input}
					onChange={(e) => setInput(e.target.value)}
					disabled={isPending}
					className="w-full resize-none"
				/>
				<button type="submit" disabled={isPending} className="btn">
					{isPending ? "Sending..." : "Send"}
				</button>
			</form>
		</div>
	);
}
