import { User } from "../models/user.model.js";

export const createUser = async (data) => {
  const createdUser = await User.create(
    {
      name: data.name,
      username: data.username,
      password: data.password
    }
  );

  return createdUser;
};

export const getUserByUsername = async (username) => {
  const user = await User.findOne({ where: { username } });
  return user? user : null;
};

export const getUserById = async (id) => {
  const user = await User.findOne({ where: { id } });
  return user? user : null;
};