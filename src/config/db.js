import mongoose from "mongoose";

function atlasQuerySuffix() {
  const params = new URLSearchParams();
  params.set("retryWrites", "true");
  params.set("w", "majority");
  const appName = process.env.MONGODB_APP_NAME?.trim() || "novasa-backend";
  params.set("appName", appName);
  const authSource = process.env.MONGODB_AUTH_SOURCE?.trim() || "admin";
  if (authSource) params.set("authSource", authSource);
  return params.toString();
}

/** Full URI, or MONGODB_USER + MONGODB_PASSWORD (password may contain @ # % etc.). */
export function resolveMongoUri() {
  const direct = process.env.MONGODB_URI?.trim();
  if (direct && !direct.includes("<db_username>") && !direct.includes("<db_password>")) {
    if (direct.includes("authSource=") && direct.includes("retryWrites=")) return direct;
    const sep = direct.includes("?") ? "&" : "?";
    return `${direct}${sep}${atlasQuerySuffix()}`;
  }

  const user = process.env.MONGODB_USER?.trim();
  const password = process.env.MONGODB_PASSWORD?.trim();
  if (!user || !password) {
    return direct || "";
  }

  const host = process.env.MONGODB_HOST?.trim() || "twinkliz.3histwf.mongodb.net";
  const dbName = process.env.MONGODB_DB?.trim();
  const path = dbName ? `/${encodeURIComponent(dbName)}?${atlasQuerySuffix()}` : `/?${atlasQuerySuffix()}`;

  return `mongodb+srv://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}${path}`;
}

export async function connectDb() {
  const uri = resolveMongoUri();
  if (!uri) {
    console.warn(
      "[api] MongoDB not configured — set MONGODB_URI or MONGODB_USER + MONGODB_PASSWORD in backend/.env",
    );
    return;
  }
  mongoose.set("strictQuery", true);
  await mongoose.connect(uri);
  console.log("[api] Connected to MongoDB");
}
