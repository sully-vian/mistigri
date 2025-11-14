import ChatClient from "@/app/ui/chatClient";
import { auth } from "@/auth";

export default async function Page() {
	const session = await auth();

	return session ? (
		<div className="h-screen p-4">
			<h1>New Chat</h1>
			{session.user ? (
				<>
					<p className="mb-4">Signed in as {session.user.name}</p>
					<ChatClient user={session.user} />
				</>
			) : (
				<p className="mb-4">No user found</p>
			)}
		</div>
	) : (
		<div className="h-screen p-4">
			<h1>No active Session</h1>
		</div>
	);
}
