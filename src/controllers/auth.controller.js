import { getUserByUsername } from "../repositories/user.repository.js";
import { generateToken } from "../helpers/jwt.js";


export const loginController = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await getUserByUsername(username);
    if (!user) {
      return res.status(401).json({ message: "No user found with given credentials" });
    }

    const isPasswordValid = user.password === password;
    if (!isPasswordValid) {
      return res.status(401).json({ message: "No user found with given credentials" });
    }

    const token = generateToken({ id: user.id, username: user.username });
    res.cookie("access_token", `Bearer ${token}`);
    return res.json();
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ message: `Internal server error: ${error}` });
  }
};
