"use client";

import { useActionState } from "react";
import { register } from "@/app/lib/actions";

export default function SignUpForm() {
	const [errorMessage, formAction, isPending] = useActionState(
		register,
		undefined,
	);
	return (
		<form action={formAction} className="flex flex-col">
			{errorMessage && (
				<div role="alert" aria-live="polite" className="text-red-600">
					{errorMessage}
				</div>
			)}
			<label className="flex flex-col">
				<span>Email</span>
				<input type="email" name="email" required />
			</label>
			<label className="flex flex-col">
				<span>Name</span>
				<input type="text" name="name" required />
			</label>
			<label className="flex flex-col">
				<span>Password</span>
				<input type="password" name="password" required />
			</label>
			<button type="submit" disabled={isPending} className="btn">
				{isPending ? "Signing up.." : "Sign up"}
			</button>
		</form>
	);
}
