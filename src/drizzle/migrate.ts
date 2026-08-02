import "dotenv/config"
import { migrate } from "drizzle-orm/node-postgres/migrator"
import db, { pool } from "./db"

// Creating our migrations
async function migration() {
    console.log("-----Migration Started Successfully!-----");
    await migrate(db, { migrationsFolder: __dirname + "/migrations" });
    await pool.end();
    console.log("-----Migration Ended Successfully!-------");
    process.exit(0);
}

// Catch Errors
migration().catch((err) => {
    console.error("Migration failed!", err);
    process.exit(1);
});