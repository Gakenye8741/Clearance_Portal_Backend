// Imports
import "dotenv/config"
import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import * as schema from "../drizzle/schema"

// define Pool for local postgres connection
export const pool = new Pool({
    connectionString: process.env.DATABASE_URL as string,
})

// establish connection and test it
const main = async () => {
   const client = await pool.connect()
   try {
     console.log("Successfully connected to local PostgreSQL database")
   } finally {
     client.release()
   }
}

// Catch the errors
main().catch(console.error);

const db = drizzle(pool, { schema, logger: true });

export default db;


// import "dotenv/config";
// import { drizzle } from "drizzle-orm/node-postgres";
// import { Pool } from "pg";
// import * as schema from "./schema";

// if (!process.env.DATABASE_URL) {
//   throw new Error("DATABASE_URL is not defined in environment variables");
// }

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: {
//     rejectUnauthorized: false, // if needed by Neon, often required
//   },
// });

// const db = drizzle(pool, { schema, logger: true });

// export default db;