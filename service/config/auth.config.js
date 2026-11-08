import "dotenv/config";

export const authConfig = {
  jwt: {
    accessSecret: process.env.JWT_SECRET,
    refreshSecret: process.env.REFRESH_SECRET,
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  },
  cookies: {
    accessTokenMaxAge: 60 * 60 * 1000, // 1 jam in ms
    refreshTokenMaxAge: 7 * 24 * 60 * 60 * 1000, // 7 hari in ms
    sameSite: process.env.COOKIE_SAME_SITE || "lax",
    secure:
      process.env.COOKIE_SECURE === "true" ||
      process.env.NODE_ENV === "production",
    httpOnly: true,
    path: "/",
  },
};

export default authConfig;
