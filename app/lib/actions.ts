"use server";

import { Prisma } from "@prisma/client";
import bcrypt from "bcrypt";
import { AuthError } from "next-auth";
import prisma from "@/app/lib/prisma";
import { signIn } from "@/auth";

export async function authenticate(
	_prevState: string | undefined,
	formData: FormData,
) {
	try {
		await signIn("credentials", formData);
	} catch (error) {
		if (!(error instanceof AuthError)) {
			throw error;
		}
		switch (error.type) {
			case "CredentialsSignin":
				return "Invalid credentials.";
			default:
				return "Something went wrong.";
		}
	}
}

export async function register(
	_prevState: string | undefined,
	formData: FormData,
) {
	const email = formData.get("email");
	const name = formData.get("name");
	const password = formData.get("password");

	if (!email || !password || !name) {
		return "Email, name and password are required.";
	}

	try {
		const hashed = await bcrypt.hash(String(password), 10);
		await prisma.user.create({
			data: {
				email: String(email).trim().toLowerCase(),
				name: String(name),
				password: hashed,
			},
		});
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			if (error.code === "P2002") {
				return `Email "${email}" already in use`;
			}
		}
	}
}
