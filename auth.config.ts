import type { NextAuthConfig } from "next-auth";

export const authConfig = {
	pages: { signIn: "/signIn" },
	providers: [
		// in auth.ts
	],
	callbacks: {
		authorized({ auth, request: { nextUrl } }) {
			// Allow requests to the auth endpoints (avoid redirect loops)
			const isAuthRoute =
				nextUrl.pathname.startsWith("/signIn") ||
				nextUrl.pathname.startsWith("/signUp") ||
				nextUrl.pathname.startsWith("/api/auth");

			const isApiRoute = nextUrl.pathname.startsWith("/api");
			const isSignedIn = !!auth?.user;

			// skip auth page if already signed in
			if (isSignedIn && isAuthRoute) {
				if (isApiRoute) {
					// no redirect for api calls
					return true;
				}
				return Response.redirect(new URL("/chats/new", nextUrl));
			}

			// if not signed in:
			// - API -> 401
			// - Page -> redirect to sign in
			if (!isSignedIn && !isAuthRoute) {
				if (isApiRoute) {
					return new Response("Unauthorized", { status: 401 });
				}
				return Response.redirect(new URL("/signIn", nextUrl));
			}
			return true;
		},
	},
} satisfies NextAuthConfig;
