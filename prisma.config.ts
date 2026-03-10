import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // DIRECT_URL (port 5432) for migrations/push — pgbouncer (port 6543) doesn't support DDL
    url: process.env["DIRECT_URL"] || process.env["DATABASE_URL"],
    directUrl: process.env["DIRECT_URL"],
  } as any,
});
