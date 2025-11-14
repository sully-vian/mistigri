import { config } from "dotenv";
import { defineConfig, env, type PrismaConfig } from "prisma/config";

config(); // load .env

const prismaConfig: PrismaConfig = {
	schema: "prisma/schema.prisma",
	migrations: {
		path: "prisma/migrations",
	},
	engine: "classic",
	datasource: {
		url: env("POSTGRES_URL_NON_POOLING"),
	},
};

export default defineConfig(prismaConfig);
