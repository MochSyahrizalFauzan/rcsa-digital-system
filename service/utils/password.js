import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

/**
 * Hash a plain password using bcrypt
 * @param {string} password
 * @returns {Promise<string>}
 */
export const hashPassword = async (password) => {
  if (!password) {
    throw new Error("Password cannot be empty");
  }
  return await bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Compare plain password against bcrypt hash
 * @param {string} plainPassword
 * @param {string} hashedPassword
 * @returns {Promise<boolean>}
 */
export const comparePassword = async (plainPassword, hashedPassword) => {
  if (!plainPassword || !hashedPassword) {
    return false;
  }
  return await bcrypt.compare(plainPassword, hashedPassword);
};

export default {
  hashPassword,
  comparePassword,
};
