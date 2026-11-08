import "dotenv/config";

export const authConfig = {
  jwt: {
    accessSecret: process.env.JWT_SECRET || "access_secret_key",
    refreshSecret: process.env.REFRESH_SECRET || "refresh_secret_key",
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "1h",
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  },
  cookies: {
    accessTokenMaxAge: 60 * 60 * 1000, // 1 hour in ms
    refreshTokenMaxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    path: "/",
  },
};

export default authConfig;
