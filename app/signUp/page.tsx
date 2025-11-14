"use client";
import SignUpForm from "@/app/ui/signUpForm";

export default function Page() {
	return (
		<div className="window">
			<div className="title-bar">
				<h1 className="title">Sign up</h1>
			</div>
			<SignUpForm />
			<p>
				Already have an account ? <a href="/signIn">Sign in</a>
			</p>
		</div>
	);
}
