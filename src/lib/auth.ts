import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { nextCookies } from "better-auth/next-js";
import { db, mongoClient } from "@/lib/db";

const secret = process.env.BETTER_AUTH_SECRET;
const baseURL = process.env.BETTER_AUTH_URL;

if (!secret || secret.length < 32) {
  throw new Error(
    "BETTER_AUTH_SECRET must contain at least 32 characters"
  );
}

if (!baseURL) {
  throw new Error("BETTER_AUTH_URL is missing");
}

export const auth = betterAuth({
  appName: "BazarDor",
  baseURL,
  secret,

  trustedOrigins: [new URL(baseURL).origin],

  database: mongodbAdapter(db, {
    client: mongoClient,
  }),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    autoSignIn: false,
    minPasswordLength: 8,
    maxPasswordLength: 128,
  },

  socialProviders: {
    ...(process.env.GOOGLE_CLIENT_ID &&
    process.env.GOOGLE_CLIENT_SECRET
      ? {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          },
        }
      : {}),

    ...(process.env.GITHUB_CLIENT_ID &&
    process.env.GITHUB_CLIENT_SECRET
      ? {
          github: {
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
          },
        }
      : {}),
  },

  plugins: [nextCookies()],
});