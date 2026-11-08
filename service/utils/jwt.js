import jwt from "jsonwebtoken";
import authConfig from "../config/auth.config.js";

/**
 * Generate Access and Refresh Tokens
 * @param {object} payload - e.g. { id, user_id, role_id }
 * @returns {{ accessToken: string, refreshToken: string }}
 */
export const generateTokens = (payload) => {
  const accessToken = jwt.sign(payload, authConfig.jwt.accessSecret, {
    expiresIn: authConfig.jwt.accessExpiresIn,
  });

  const refreshToken = jwt.sign(payload, authConfig.jwt.refreshSecret, {
    expiresIn: authConfig.jwt.refreshExpiresIn,
  });

  return { accessToken, refreshToken };
};

/**
 * Generate only Access Token (e.g. for token rotation)
 * @param {object} payload
 * @returns {string}
 */
export const generateAccessToken = (payload) => {
  return jwt.sign(payload, authConfig.jwt.accessSecret, {
    expiresIn: authConfig.jwt.accessExpiresIn,
  });
};

/**
 * Verify Access Token
 * @param {string} token
 * @returns {object} decoded token payload
 */
export const verifyAccessToken = (token) => {
  return jwt.verify(token, authConfig.jwt.accessSecret);
};

/**
 * Verify Refresh Token
 * @param {string} token
 * @returns {object} decoded token payload
 */
export const verifyRefreshToken = (token) => {
  return jwt.verify(token, authConfig.jwt.refreshSecret);
};

export default {
  generateTokens,
  generateAccessToken,
  verifyAccessToken,
  verifyRefreshToken,
};
