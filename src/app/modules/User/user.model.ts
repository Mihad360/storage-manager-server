import { model, Schema } from "mongoose";
import { IUser, UserModel } from "./user.interface";
import bcrypt from "bcrypt";
import config from "../../config";

const userSchema = new Schema<IUser, UserModel>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    totalStorage: { type: Number, default: 15 * 1024 * 1024 * 1024 },
    usedStorage: { type: Number, default: 0 },
    name: { type: String, required: true },
    profileImage: { type: String },
    role: { type: String },
    otp: { type: String, default: null },
    expiresAt: { type: Date, default: null },
    isVerified: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_rounds),
  );
  next();
});

userSchema.statics.isUserExistByEmail = async function (email: string) {
  return await User.findOne({ email });
};

userSchema.statics.compareUserPassword = async function (
  payloadPassword: string,
  hashedPassword: string,
) {
  const compare = await bcrypt.compare(payloadPassword, hashedPassword);
  return compare;
};

userSchema.statics.newHashedPassword = async function (newPassword: string) {
  const newPass = await bcrypt.hash(
    newPassword,
    Number(config.bcrypt_salt_rounds as string),
  );
  return newPass;
};

export const User = model<IUser, UserModel>("User", userSchema);
