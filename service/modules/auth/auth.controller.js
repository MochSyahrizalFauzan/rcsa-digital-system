import authConfig from "../../config/auth.config.js";

const createAuthController = (authService) => {
  return {
    /**
     * POST /login
     */
    login: async (req, res, next) => {
      try {
        const { user_id, password } = req.body;
        const ipAddress = req.ip || req.connection?.remoteAddress || "";
        const userAgent = req.get("User-Agent") || "";

        const result = await authService.login({
          userId: user_id,
          password,
          ipAddress,
          userAgent,
        });

        // Set HttpOnly Cookies
        res.cookie("accessToken", result.tokens.accessToken, {
          httpOnly: authConfig.cookies.httpOnly,
          sameSite: authConfig.cookies.sameSite,
          secure: authConfig.cookies.secure,
          path: authConfig.cookies.path,
          maxAge: authConfig.cookies.accessTokenMaxAge,
        });

        res.cookie("refreshToken", result.tokens.refreshToken, {
          httpOnly: authConfig.cookies.httpOnly,
          sameSite: authConfig.cookies.sameSite,
          secure: authConfig.cookies.secure,
          path: authConfig.cookies.path,
          maxAge: authConfig.cookies.refreshTokenMaxAge,
        });

        return res.status(200).json({
          message: "Login success",
          user: result.user,
        });
      } catch (error) {
        next(error);
      }
    },

    /**
     * POST /refresh-token
     */
    refreshToken: async (req, res, next) => {
      try {
        const refreshToken = req.cookies?.refreshToken;
        const result = await authService.refreshAccessToken(refreshToken);

        res.cookie("accessToken", result.accessToken, {
          httpOnly: authConfig.cookies.httpOnly,
          sameSite: authConfig.cookies.sameSite,
          secure: authConfig.cookies.secure,
          path: authConfig.cookies.path,
          maxAge: authConfig.cookies.accessTokenMaxAge,
        });

        return res.status(200).json({ message: "Token diperbarui" });
      } catch (error) {
        next(error);
      }
    },

    /**
     * POST /logout
     */
    logout: async (req, res, next) => {
      try {
        const userId = req.user?.id;
        const result = await authService.logout(userId);

        res.clearCookie("accessToken", { path: "/" });
        res.clearCookie("refreshToken", { path: "/" });

        return res.status(200).json(result);
      } catch (error) {
        next(error);
      }
    },

    /**
     * GET /me
     */
    getMe: async (req, res, next) => {
      try {
        res.set({
          "Cache-Control": "no-store, no-cache, must-revalidate, private",
          Pragma: "no-cache",
          Expires: "0",
        });

        const user = await authService.getCurrentUser(req.user.id);
        return res.status(200).json(user);
      } catch (error) {
        next(error);
      }
    },

    /**
     * GET /profile
     */
    getProfile: async (req, res, next) => {
      try {
        const profile = await authService.getProfile(req.user.id);
        return res.status(200).json(profile);
      } catch (error) {
        next(error);
      }
    },
  };
};

export default createAuthController;
