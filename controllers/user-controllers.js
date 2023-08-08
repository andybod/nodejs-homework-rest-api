import fs from "fs/promises";

import path from "path";

import bcrypt from "bcryptjs";

import Jimp from "jimp";

import jwt from "jsonwebtoken";

import gravatar from "gravatar";

import "dotenv/config";

import User from "../models/user.js";

import { HttpError } from "../helpers/index.js";

import { ctrWrapper } from "../decorators/index.js";
import { error } from "console";

const { JWT_SECRET } = process.env;

const signup = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);
  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
  });
  res.status(201).json({
    email: newUser.email,
    subscription: newUser.subscription,
  });
};

const signin = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }
  const payload = {
    id: user._id,
  };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });
  await User.findByIdAndUpdate(user._id, { token });
  res.json({
    token,
    user: { email: user.email, subscription: user.subscription },
  });
};
const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });
  res.status(204).json("");
};

const getCurrent = (req, res) => {
  const { email, subscription } = req.user;
  res.json({ email, subscription });
};

const updateSubscription = async (req, res) => {
  const { _id } = req.user;
  const result = await User.findByIdAndUpdate(_id, req.body, {
    new: true,
  });
  if (!result) {
    throw HttpError(404);
  }
  res.json(result);
};

const avatarPath = path.resolve("public", "avatars");
console.log(avatarPath);

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: oldPath, filename } = req.file;
  try {
    const image = await Jimp.read(oldPath);
    await image.resize(250, 250);
    await image.writeAsync(oldPath);
    req.file.path = oldPath;
  } catch (error) {
    throw HttpError(400, `${error.message}`);
  }
  const newPath = path.join(avatarPath, filename);
  await fs.rename(oldPath, newPath);
  const url = path.join("avatars", filename);
  const result = await User.findByIdAndUpdate(
    _id,
    { avatarURL: url },
    {
      new: true,
    }
  );
  if (!result) {
    throw HttpError(401, "Not authorized");
  }
  res.json({ result });
};

export default {
  signup: ctrWrapper(signup),
  signin: ctrWrapper(signin),
  logout: ctrWrapper(logout),
  getCurrent: ctrWrapper(getCurrent),
  updateSubscription: ctrWrapper(updateSubscription),
  updateAvatar: ctrWrapper(updateAvatar),
};
