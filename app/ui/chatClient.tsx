"use client";

import type { User } from "next-auth";

type Role = "USER" | "MISTIGRI";
type Message = {
	id: string;
	role: Role;
	content: string;
	createdAt: string;
};

export default function ChatClient({ user }: { user?: User }) {
	return <div>ChatClient</div>;
}
