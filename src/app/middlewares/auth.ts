import jwt, { JwtPayload as jwtPayload } from "jsonwebtoken";
import HttpStatus from "http-status";
import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "../erros/AppError";
import config from "../config";
import { User } from "../modules/User/user.model";
import { TUserRole } from "../interface/global";
import { JwtPayload } from "../interface/global";

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    if (!token) {
      throw new AppError(HttpStatus.UNAUTHORIZED, "You are not authorized");
    }
    // verify token -----
    let decoded;
    try {
      decoded = jwt.verify(
        token,
        config.jwt_access_secret as string,
      ) as jwtPayload;
    } catch (error) {
      console.log(error);
      throw new AppError(HttpStatus.UNAUTHORIZED, "Unauthorized");
    }

    const { role, email } = decoded;

    const user = await User.isUserExistByEmail(email);
    if (!user) {
      throw new AppError(HttpStatus.NOT_FOUND, "This User is not exist");
    }
    if (user?.isDeleted) {
      throw new AppError(HttpStatus.FORBIDDEN, "This User is deleted");
    }

    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AppError(HttpStatus.UNAUTHORIZED, "You are not authorized");
    }

    req.user = decoded as JwtPayload;
    next();
  });
};

export default auth;
