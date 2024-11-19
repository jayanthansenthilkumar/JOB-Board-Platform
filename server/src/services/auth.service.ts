import { Role, Token, User } from "@prisma/client";

import userService from "./user.service";
import { ApiError } from "../classes/ApiError";
import HttpStatusCodes from "../constants/HttpStatusCodes";
import authUtils from "../utils/auth";
import tokenService from "./token.service";

export default {
  async register(name: string, email: string, password: string, role: Role) {
    try {
      const candidate = await userService.getUserByEmail(email);
      if (candidate) {
        throw new ApiError(HttpStatusCodes.CONFLICT, "User already exists");
      }
    } catch (error) {
      console.log(error);
    }
    const hashedPassword = authUtils.hashPassword(password);
    const user = await userService.createUser(
      name,
      email,
      hashedPassword,
      role
    );
    return user;
  },

  async login(userId: string) {
    const accessToken = authUtils.createAccessToken(userId);
    const refreshToken = authUtils.createRefreshToken(userId);

    const refreshTokenExpiresIn = Number(
      eval(process.env.REFRESH_EXP || "7 * 24 * 60 * 60 * 1000")
    );

    const expiresAt = new Date(Date.now() + refreshTokenExpiresIn);

    try {
      await tokenService.createToken(userId, refreshToken, expiresAt);
    } catch (error) {
      throw new ApiError(
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
        "Failed to create token"
      );
    }

    return { accessToken, refreshToken };
  },

  async logout(refreshToken: string) {
    const decoded = authUtils.verifyRefreshToken(refreshToken) as Token;
    if (!refreshToken) {
      throw new ApiError(HttpStatusCodes.BAD_REQUEST, "Missing refresh token");
    }
    const token = await tokenService.deleteTokenByUserId(
      decoded.userId,
      refreshToken
    );
    return token;
  },

  async refresh(refreshToken: string) {
    try {
      const decoded = authUtils.verifyRefreshToken(refreshToken) as Token;
      if (decoded.expirationDate < new Date()) {
        await tokenService.deleteTokenByUserId(decoded.userId, refreshToken);
        throw new ApiError(
          HttpStatusCodes.UNAUTHORIZED,
          "Refresh token expired"
        );
      }
      const storedToken = await tokenService.getTokenByUserId(
        decoded.userId,
        refreshToken
      );
      if (!storedToken) {
        throw new ApiError(
          HttpStatusCodes.UNAUTHORIZED,
          "Invalid refresh token"
        );
      }
      if (storedToken.refreshToken !== refreshToken) {
        throw new ApiError(
          HttpStatusCodes.UNAUTHORIZED,
          "Invalid refresh token"
        );
      }
      const newAccessToken = authUtils.createAccessToken(decoded.userId);
      return newAccessToken;
    } catch (error) {
      throw error;
    }
  },
};
