const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ================= REGISTER =================
const registerUser = async (req, res) => {
  try {
    const { name, phone, aadhaar, password } = req.body;

    // 1. Validation
    if (!name || !phone || !aadhaar || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (phone.length !== 10) {
      return res.status(400).json({ message: "Phone must be 10 digits" });
    }

    if (aadhaar.length !== 12) {
      return res.status(400).json({ message: "Aadhaar must be 12 digits" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password min 6 chars" });
    }

    // 2. Check duplicates
    const [existing] = await db.execute(
      "SELECT id FROM users WHERE phone = ? OR aadhaar = ?",
      [phone, aadhaar]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Insert user
    const [result] = await db.execute(
      `INSERT INTO users (name, phone, aadhaar, password, role, status)
       VALUES (?, ?, ?, ?, 'user', 'active')`,
      [name, phone, aadhaar, hashedPassword]
    );

    // 5. Generate JWT
    const token = jwt.sign(
      {
        userId: result.insertId,
        role: "user"
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      user_id: result.insertId,
      name,
      role: "user",
      token,
      message: "Registration successful"
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


// ================= LOGIN =================
const loginUser = async (req, res) => {
  try {
    const { phone, aadhaar, password } = req.body;

    if ((!phone && !aadhaar) || !password) {
      return res.status(400).json({ message: "Phone/Aadhaar & password required" });
    }

    // 1. Fetch user
    const [users] = await db.execute(
      phone
        ? "SELECT * FROM users WHERE phone = ?"
        : "SELECT * FROM users WHERE aadhaar = ?",
      [phone || aadhaar]
    );

    if (users.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    const user = users[0];

    // 2. Check status
    if (user.status !== "active") {
      return res.status(403).json({ message: "User is blocked" });
    }

    // 3. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 4. Generate JWT
    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      user_id: user.id,
      name: user.name,
      role: user.role,
      token,
      message: "Login successful"
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { registerUser, loginUser };
