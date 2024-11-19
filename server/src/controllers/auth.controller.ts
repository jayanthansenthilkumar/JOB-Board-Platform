import { NextFunction, Request, Response } from "express";

import HttpStatusCodes from "../constants/HttpStatusCodes";
import authService from "../services/auth.service";
import { ApiError } from "../classes/ApiError";
import userService from "../services/user.service";
import authUtils from "../utils/auth";

import Paths from "../constants/Paths";

export default {
  async register(req: Request, res: Response, next: NextFunction) {
    const { name, email, password: receivedPassword, role } = req.body;

    const requiredFields = ["name", "email", "password", "role"];
    for (let field of requiredFields) {
      if (!field) {
        throw new ApiError(HttpStatusCodes.BAD_REQUEST, `${field} is missing`);
      }
    }

    try {
      const user = await authService.register(
        name,
        email,
        receivedPassword,
        role
      );
      const { uid, password, ...strippedUser } = user;
      return res.status(HttpStatusCodes.CREATED).json({
        status: HttpStatusCodes.CREATED,
        message: `User ${strippedUser.email} successfully registered`,
        data: strippedUser,
      });
    } catch (error) {
      next(error);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    const { email, password: receivedPassword } = req.body;

    if (!email || !receivedPassword) {
      return next(
        new ApiError(HttpStatusCodes.BAD_REQUEST, "Missing email or password")
      );
    }
    try {
      const user = await userService.getUserByEmail(email);
      if (!user) {
        return next(new ApiError(HttpStatusCodes.NOT_FOUND, "User not found"));
      }
      const isPasswordValid = await authUtils.comparePassword(
        receivedPassword,
        user.password
      );
      if (!isPasswordValid) {
        return next(
          new ApiError(HttpStatusCodes.UNAUTHORIZED, "Invalid password")
        );
      }
      const { accessToken, refreshToken } = await authService.login(user.uid);

      const refreshTokenExpiresIn = Number(
        eval(process.env.REFRESH_EXP || "7 * 24 * 60 * 60 * 1000")
      );

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: Paths.Base + Paths.Auth.Base + Paths.Auth.Refresh,
        maxAge: refreshTokenExpiresIn,
      });

      res.set("Authorization", `Bearer ${accessToken}`);

      const { uid, password, ...strippedUser } = user;

      return res.status(HttpStatusCodes.OK).json({
        status: HttpStatusCodes.OK,
        message: "User logged in successfully",
        data: strippedUser,
      });
    } catch (error) {
      next(error);
    }
  },

  async logout(req: Request, res: Response, next: NextFunction) {
    const refreshToken = req.cookies["refreshToken"];
    if (!refreshToken) {
      return next(
        new ApiError(HttpStatusCodes.BAD_REQUEST, "Missing refresh token")
      );
    }
    try {
      await authService.logout(refreshToken);
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: Paths.Base + Paths.Auth.Base + Paths.Auth.Refresh,
        maxAge: -1,
      });

      return res.status(HttpStatusCodes.OK).json({
        status: HttpStatusCodes.OK,
        message: "User logged out",
      });
    } catch (error) {
      next(error);
    }
  },

  async refresh(req: Request, res: Response, next: NextFunction) {
    const refreshToken = req.cookies["refreshToken"];
    if (!refreshToken) {
      return next(
        new ApiError(HttpStatusCodes.BAD_REQUEST, "Missing refresh token")
      );
    }
    try {
      const newAccessToken = await authService.refresh(refreshToken);
      res.set("Authorization", `Bearer ${newAccessToken}`);

      return res.status(HttpStatusCodes.OK).json({
        status: HttpStatusCodes.OK,
        message: "Token refreshed",
      });
    } catch (error) {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: Paths.Base + Paths.Auth.Base + Paths.Auth.Refresh,
        maxAge: -1,
      });

      next(error);
    }
  },
};
