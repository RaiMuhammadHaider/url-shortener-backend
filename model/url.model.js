import { text, pgTable, varchar, uuid , timestamp} from "drizzle-orm/pg-core";
import { usersTable } from "./index.ts";

export const urlTable = pgTable("Urls", {
  id: uuid("id").primaryKey().defaultRandom(),
  shortCode: varchar("code").notNull(), // 👈 maps to DB "code"
  targetUrl: varchar("target_url").notNull(), // 👈 maps to DB "target_url"
  userId: uuid("user_id").references(() => usersTable.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
