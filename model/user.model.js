import { text, pgTable, varchar, uuid , timestamp} from "drizzle-orm/pg-core";

export const usersTable = pgTable("Users", {
  id : uuid().primaryKey().defaultRandom(),
  firstName: varchar('First_Name' , { length: 255 }).notNull(),
  lastName: varchar('Last_Name' , { length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  salt : text().notNull(),
  password : text().notNull(),
  createdAt : timestamp('created_at').defaultNow().notNull(),
  updatedAt : timestamp('updated_at').$onUpdate(()=> new Date())

});
