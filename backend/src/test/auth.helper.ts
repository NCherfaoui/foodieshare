import jwt from "jsonwebtoken";
import { User } from "../models/User";

export const createTestUser = async () => {
  const user = await User.create({
    username: "testuser",
    email: "test@test.com",
    password: "password123",
  });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
    expiresIn: "1h",
  });

  return { user, token };
};
