"use client";

import { useActionState } from "react";
import { authenticate } from "@/app/lib/actions";

export default function SignInForm() {
	const [errorMessage, formAction, isPending] = useActionState(
		authenticate,
		undefined,
	);
	return (
		<form action={formAction} className="flex flex-col">
			{errorMessage && (
				<div role="alert" aria-live="polite" className=" text-red-600">
					{errorMessage}
				</div>
			)}
			<label className="flex flex-col">
				<span>Email</span>
				<input
					type="email"
					name="email"
					placeholder="Enter your email address"
					required
				/>
			</label>
			<label className="flex flex-col">
				<span>Password</span>
				<input
					type="password"
					name="password"
					placeholder="Enter your password"
					required
				/>
			</label>
			<button type="submit" disabled={isPending} className="btn">
				{isPending ? "Signing in..." : "Sign in"}
			</button>
		</form>
	);
}
