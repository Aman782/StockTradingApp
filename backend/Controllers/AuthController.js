const User = require("../models/UserModel");
const { createSecretToken } = require("../utils/SecretToken");
const bcrypt = require("bcryptjs");

module.exports.Signup = async (req, res) => {
  console.log(req.body); // Log the request body to verify incoming data

  try {
    const { email, password, username } = req.body;
    if (!email || !password || !username) {
      return res.status(400).json({ message: "All fields are required" });
    }
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ message: "User already exists" });
    }
    
    const user = await User.create({ email, password, username });
    const token = createSecretToken(user._id);
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });
    res.status(201).json({ message: "User signed up successfully", success: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.Login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ message: 'Incorrect password or email' });
    }
    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      return res.json({ message: 'Incorrect password or email' });
    }
    const token = createSecretToken(user._id);
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });
    res.status(201).json({ message: "User logged in successfully", success: true });
    next();
  } catch (error) {
    console.error(error);
  }
};


module.exports.Logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: false,
    secure: false, // Set to true if using HTTPS
    sameSite: 'None', // Adjust based on your needs
  });
  res.status(200).json({ message: "User logged out successfully" });
};


module.exports.Verify = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ status: false, user: null });
    }

    // Decode the token to get user ID (you need to implement the decode function)
    const userId = decodeToken(token); 
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(401).json({ status: false, user: null });
    }

    res.json({ status: true, user: user.username });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, user: null });
  }
};
