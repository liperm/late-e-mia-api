import { createUser, getUserById } from "../repositories/user.repository.js";
import { hashData } from "../helpers/encription.js";


export const postUserController = async (req, res) => {
  const reqBody = req.body;
  try {
    const userData = {
      name: reqBody.name,
      username: reqBody.username,
      password: await hashData(reqBody.password)
    }

    const user = await createUser(userData);
    res.status(201).json({id: user.id});
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ error: 'Error creating user' });
  }
};

export const getMeController = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ id: user.id, name: user.name, username: user.username });
  } catch (err) {
    console.error('Error fetching user data:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

