import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	dialect: 'sqlite',
	schema: './server/database/schema.ts',
	out: './server/db/migrations',
});
