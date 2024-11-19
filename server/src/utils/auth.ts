import { sign, verify } from "jsonwebtoken";
import bcrypt from "bcrypt";
import ms from "ms";

import { ApiError } from "../classes/ApiError";
import HttpStatusCodes from "../constants/HttpStatusCodes";

const accessTokenExpiresIn = Number(
  eval(process.env.ACCESS_EXP || "15 * 60 * 1000")
);
const refreshTokenExpiresIn = Number(
  eval(process.env.REFRESH_EXP || "7 * 24 * 60 * 60 * 1000")
);

export default {
  createAccessToken(userId: string) {
    const secret = process.env.ACCESS_SECRET;
    if (!secret) {
      throw new ApiError(
        HttpStatusCodes.BAD_REQUEST,
        "ACCESS_SECRET is not set"
      );
    }
    return sign({ userId }, secret, {
      expiresIn: ms(accessTokenExpiresIn),
    });
  },

  createRefreshToken(userId: string) {
    const secret = process.env.REFRESH_SECRET;
    if (!secret) {
      throw new ApiError(
        HttpStatusCodes.BAD_REQUEST,
        "REFRESH_SECRET is not set"
      );
    }
    return sign({ userId }, secret, {
      expiresIn: ms(refreshTokenExpiresIn),
    });
  },

  verifyRefreshToken(refreshToken: string) {
    const secret = process.env.REFRESH_SECRET;
    if (!secret) {
      throw new ApiError(
        HttpStatusCodes.BAD_REQUEST,
        "REFRESH_SECRET is not set"
      );
    }
    try {
      return verify(refreshToken, secret);
    } catch (error: Error | any) {
      if (error.name === "TokenExpiredError") {
        throw new ApiError(
          HttpStatusCodes.UNAUTHORIZED,
          "Refresh token expired"
        );
      } else if (error.name === "JsonWebTokenError") {
        throw new ApiError(
          HttpStatusCodes.UNAUTHORIZED,
          "Invalid refresh token"
        );
      } else {
        throw new ApiError(
          HttpStatusCodes.INTERNAL_SERVER_ERROR,
          "An error occurred"
        );
      }
    }
  },

  verifyAccessToken(accessToken: string) {
    const secret = process.env.ACCESS_SECRET;
    if (!secret) {
      throw new ApiError(
        HttpStatusCodes.BAD_REQUEST,
        "ACCESS_SECRET is not set"
      );
    }
    try {
      return verify(accessToken, secret);
    } catch (error: Error | any) {
      if (error.name === "TokenExpiredError") {
        throw new ApiError(
          HttpStatusCodes.UNAUTHORIZED,
          "Access token expired"
        );
      } else if (error.name === "JsonWebTokenError") {
        throw new ApiError(
          HttpStatusCodes.UNAUTHORIZED,
          "Invalid access token"
        );
      } else {
        throw new ApiError(
          HttpStatusCodes.INTERNAL_SERVER_ERROR,
          "An error occurred"
        );
      }
    }
  },

  hashPassword(password: string) {
    const saltRounds = Number(process.env.SALT_ROUNDS);
    if (!Number.isInteger(saltRounds)) {
      throw new ApiError(
        HttpStatusCodes.BAD_REQUEST,
        "SALT_ROUNDS must be an integer"
      );
    }
    return bcrypt.hashSync(password, saltRounds);
  },

  async comparePassword(password: string, hash: string) {
    return bcrypt.compareSync(password, hash);
  },
};
