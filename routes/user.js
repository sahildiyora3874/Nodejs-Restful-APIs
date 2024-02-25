const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const User = require("../models/user");
const { sequelize, pool } = require("../config/db");
const { where } = require("sequelize");
const router = express();

// Sign-Up
router.post("/signup", async (req, res) => {
  const { firstname, lastname, email, username, password } = req.body;

  try {
    if (!firstname || !lastname || !email || !username || !password) {
      throw new Error("Please Reuire All Fileds", Error);
    }
    const existingEmail = await User.findOne({
      where: { email },
    });
    if (!existingEmail) {
      return res.status(400).json({ message: "Email already in use." });
    }

    const existingUser = await User.findOne({
      where: { username },
    });
    if (!existingUser) {
      return res.status(400).json({ message: "Username already in use." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      firstname,
      lastname,
      email,
      username,
      password: hashedPassword,
    });
    console.log("uer was created..!", user);

    return res.status(201).json({ message: "Signup successful!", data: user });
  } catch (error) {
    console.log("Error in signing up:", error);
    return res.status(500).json({ error: "SomeThing Went Wrong !" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  console.log(req.body);
  console.log(username);
  console.log(password);

  try {
    if (!username || !password) {
      res.json({ message: "Please enter Username and Password" });
    }
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
    console.log(result);

    if (
      result.rows.length === 1 &&
      (await bcrypt.compare(password, result.rows[0].password))
    ) {
      res.status(200).json({ message: "Login successfull!" });
    } else {
      res.status(401).json({ message: "Invalid Password and Username" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "SomeThing Went Wrong !" });
  }
});

// Forgot-Password
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  console.log(req.body);
  console.log(email);
  if (!email) {
    return res.json({ error: "Please Enter Email!" });
  }

  try {
    const user = await User.findOne({ where: { email } });
    console.log(user);

    if (!user) {
      return res.status(404).json({ error: "User Not Found!" });
    }

    const token = uuidv4();
    console.log(token);
    console.log(token);
    const expiresAt = new Date(Date.now() + 3600000);

    await user.update({
      resetToken: token,
      resetTokenExpiresAt: expiresAt,
    });
      const jwtToken = jwt.sign(
        { email, token },
        process.env.JWT_SECRET || "456",
        {
          expiresIn: "2h",
        }
      );
    return res.json({
      message: "Token generated successfully!",
      jwtToken,
    });
  } catch (error) {
    console.error("Error updating reset token:", error);
    return res.status(500).json({ error: "Something Went Wrong!" });
  }
});

//Reset-Password
router.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const secret = process.env.JWT_SECRET || "456";

    const decoded = jwt.verify(token, secret, { expiresIn: "1h" });
    console.log("----> Decode Token : ", decoded);

    if (!newPassword || !decoded.email) {
      return res
        .status(400)
        .json({ error: "Invalid request. Please provide a new password." });
    }

    const user = await User.findOne({
      where: {
        email: decoded.email,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await user.update({
      password: hashedPassword,
    });

    res.json({ message: "Password reset successfully." });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(400).json({ error: "Invalid token." });
  }
});

module.exports = sequelize;
module.exports = router;
