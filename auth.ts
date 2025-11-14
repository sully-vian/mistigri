import bcrypt from "bcrypt";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import prisma from "@/app/lib/prisma";
import { authConfig } from "./auth.config";

export const { auth, signIn, signOut } = NextAuth({
	...authConfig,
	providers: [
		Credentials({
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				const email = String(credentials?.email);
				const password = String(credentials?.password);
				if (!email || !password) {
					return null;
				}
				const user = await prisma.user.findUnique({
					where: { email: email.toLowerCase() },
				});
				if (!user || !user.password) {
					return null;
				}
				const valid = await bcrypt.compare(password, user.password);
				if (!valid) {
					console.log("Invalid credentials");
					return null;
				}
				return {
					id: String(user.id),
					email: user.email,
					name: user.name,
				};
			},
		}),
	],
});
