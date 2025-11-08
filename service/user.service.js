import { db } from "../src/index.js";
// import { usersTable } from "../src/db/schema.ts";
import { eq } from "drizzle-orm";
import { usersTable } from "../model/user.model.js";
import { urlTable } from "../model/url.model.js";
import {nanoid} from 'nanoid' 
export async function getUserByEmail(email) {
     const [existingUser] = await db.select(
          {
              id : usersTable.id,
              email : usersTable.email,
              firstName : usersTable.firstName,
              lastName : usersTable.lastName,
              salt : usersTable.salt,
              password : usersTable.password

            }
    
        ).from(usersTable).where(eq(usersTable.email , email))
       

            return existingUser
}

export async function createShortUrl(url, code, userId) {
  const shortCode = code ?? nanoid(6);

  const [result] = await db
    .insert(urlTable)
    .values({
      shortCode,
      targetUrl: url,
      userId,
    })
    .returning({
      id: urlTable.id,
      shortCode: urlTable.shortCode,
      targetUrl: urlTable.targetUrl,
    });

  return {
    id: result.id,
    shortCode: result.shortCode,
    targetUrl: result.targetUrl,
  };
}