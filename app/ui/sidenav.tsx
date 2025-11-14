import { signOut } from "@/auth";

export default function SideNav() {
	return (
		<div className="flex flex-col h-full bg-gray-500">
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
		</div>
	);
}
