import { betterAuth } from "better-auth";
import { Pool } from "pg";

// Ensure your DATABASE_URL is set in your environment variables.
// This should be the PostgreSQL connection string from your Supabase project settings.
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL environment variable is not set. Please provide your Supabase PostgreSQL connection string."
  );
}

const pool = new Pool({
  connectionString,
});

export const auth = betterAuth({
  database: pool,
  // We will add more configurations here, like enabled authentication methods (e.g., email & password)
  // and potentially plugins later.
  emailAndPassword: { 
    enabled: true, 
    // We can add options like 'caseSensitive' for email if needed
  },
  // Example: Configure where to redirect after certain actions if not handled by Server Action redirects
  // This might be more relevant for client-side flows or if Better Auth handles redirects directly.
  // redirects: {
  //   loginSuccess: '/',
  //   logoutSuccess: '/login',
  //   // ... other redirects
  // }
});

// You might also want to export the pool if you need to use it elsewhere for Kysely or other direct DB access,
// though Better Auth's adapter should handle most auth-related DB interactions.
// export { pool }; 