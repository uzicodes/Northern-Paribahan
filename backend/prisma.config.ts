// backend/prisma.config.ts
import { defineConfig } from '@prisma/config';

export default defineConfig({
    // Points to your schema file
    schema: 'prisma/schema.prisma',

    datasource: {
        provider: 'postgresql',
        // For CLI commands (migrate, db pull), we MUST use the Direct Connection (Port 5432)
        // This reads "DIRECT_URL" from your .env file
        url: process.env.DIRECT_URL,
    },
});