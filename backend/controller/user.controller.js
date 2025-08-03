const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

async function userList(req, res) {
  try {
    const getAllUsers = await User.find().select("-password");
    res.status(200).json(getAllUsers);
  } catch (error) {
    console.log("error in userList controller:", error.message);
    res.status(500).json({ error: "Failed to list all users" });
  }
}

async function getUser(req, res) {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: `User with ID ${id} not found` });
    }
    res.status(200).json(user);
  } catch (error) {
    console.log("Error in getUser Controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function createUser(req, res) {
  try {
    const {
      username,
      email,
      color,
      password,
      phone,
      isAdmin,
      street,
      apartment,
      zip,
      city,
      country,
    } = req.body;

    const user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ error: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      color,
      password: hashedPassword,
      phone,
      isAdmin,
      street,
      apartment,
      zip,
      city,
      country,
    });

    if (newUser) {
      await newUser.save();
      res
        .status(201)
        .json({ message: "new user created successfully", newUser });
    } else {
      return res.status(400).json({ error: "Invalid user data" });
    }
  } catch (error) {
    console.log("error creating user", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    const secret = process.env.JWT_SECRET;
    if (!user) {
      return res.status(401).json({ message: "Invalid Credential" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid Password" });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        isAdmin: user.isAdmin,
      },
      secret,
      { expiresIn: "15d" }
    );
    res.status(200).json({ message: "Login Successful", token: token });
  } catch (error) {
    console.log("error in login controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
async function register(req, res) {
  try {
    const {
      username,
      email,
      color,
      password,
      phone,
      isAdmin,
      street,
      apartment,
      zip,
      city,
      country,
    } = req.body;

    const user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ error: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      color,
      password: hashedPassword,
      phone,
      isAdmin,
      street,
      apartment,
      zip,
      city,
      country,
    });

    if (newUser) {
      await newUser.save();
      res
        .status(201)
        .json({ message: "new user created successfully", newUser });
    } else {
      return res.status(400).json({ error: "Invalid user data" });
    }
  } catch (error) {
    console.log("error creating user", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function countUsers(req, res) {
  try {
    const count = await User.countDocuments();
    res.status(200).json({ UsersCount: count });
  } catch (error) {
    console.log("error counting users", error.message);
    res.status(500).json({ error: "Internal Serval error" });
  }
}

async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    const user = await Category.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ message: `User with ID ${id} found` });
    }
    res
      .status(200)
      .json({ message: `User with ID ${id} deleted successfully` });
  } catch (error) {
    console.log("Error in deleteProduct Controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
module.exports = {
  userList,
  getUser,
  createUser,
  login,
  register,
  countUsers,
  deleteUser,
};
