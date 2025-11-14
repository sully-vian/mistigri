"use client";

import SignInForm from "@/app/ui/signInForm";

export default function Page() {
	return (
		<div className="window">
			<div className="title-bar">
				<h1 className="title">Sign In</h1>
			</div>
			<SignInForm />
			<p>
				No account ? <a href="/signUp">Sign up</a>
			</p>
		</div>
	);
}
