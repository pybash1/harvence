import { sql } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const usersTable = sqliteTable("history", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  barcode: text().notNull(),
  quantity: text(),
  nutrition: text(),
  createdAt: text().default(sql`(CURRENT_TIMESTAMP)`),
});
