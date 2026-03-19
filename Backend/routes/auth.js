const express = require("express");
const router = express.Router();
const User = require("../models/User");

// SIGNUP
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.json({ msg: "All fields required" });
    }

    const exists = await User.findOne({ email });

    if (exists) return res.json({ msg: "User exists" });

    const user = new User({
      name,
      email,
      password,
      expenses: [],
      limits: {}
    });

    await user.save();

    res.json(user);

  } catch (err) {
    console.log("SIGNUP ERROR:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, password });

    if (!user) return res.json({ msg: "Invalid credentials" });

    res.json(user);

  } catch (err) {
    console.log("LOGIN ERROR:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// UPDATE
router.post("/update", async (req, res) => {
  try {
    const { email, expenses, limits } = req.body;

    const user = await User.findOneAndUpdate(
      { email },
      { expenses, limits },
      { returnDocument: "after" }
    );

    res.json(user);

  } catch (err) {
    console.log("UPDATE ERROR:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;