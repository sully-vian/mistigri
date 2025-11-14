import type { Prisma } from "@prisma/client";
import bcrypt from "bcrypt";
import prisma from "@/app/lib/prisma";

const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;

const userData: Prisma.UserCreateInput[] = [
	{
		name: "John Doe",
		email: "john.doe@gmail.com",
		password: "123456",
	},
	{
		name: "Tony Start",
		email: "imhim@stark.com",
		password: "123456",
	},
];

async function main() {
	for (const user of userData) {
		const hashedPassword = await bcrypt.hash(
			String(user.password),
			SALT_ROUNDS,
		);
		await prisma.user.create({
			data: {
				...user,
				password: hashedPassword,
			},
		});
	}
	console.log("DB seeded");
}

main();
