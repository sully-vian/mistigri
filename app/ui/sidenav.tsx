import { auth, signOut } from "@/auth";

export default async function SideNav() {
	const session = await auth();
	return (
		<aside className="flex flex-col h-full bg-(--tertiary)">
			<form
				action={async () => {
					"use server";
					await signOut({ redirectTo: "/" });
				}}
			>
				<button type="submit" className="btn">
					Sign Out
				</button>
			</form>
			<button type="button" className="btn">
				New Chat
			</button>
		</aside>
	);
}
