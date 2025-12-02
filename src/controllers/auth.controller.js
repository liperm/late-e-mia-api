import { getUserByUsername } from "../repositories/user.repository.js";
import { generateToken } from "../helpers/jwt.js";
import { verifyHash } from "../helpers/encription.js";


export const loginController = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await getUserByUsername(username);
    if (!user) {
      return res.status(401).json({ message: "No user found with given credentials" });
    }

    const isPasswordValid = await verifyHash(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "No user found with given credentials" });
    }

    const token = generateToken({ id: user.id, username: user.username });
    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.ENV === "production",
      sameSite: "none",
    });
    
    return res.json();
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ message: `Internal server error: ${error}` });
  }
};
