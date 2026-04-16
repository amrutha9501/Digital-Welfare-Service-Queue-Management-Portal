const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ================= REGISTER =================
const registerUser = async (req, res) => {
  try {
    const { name, phone, aadhaar, password } = req.body;

    if (!name || !phone || !aadhaar || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const [existing] = await db.execute(
      "SELECT id FROM users WHERE phone = ? OR aadhaar = ?",
      [phone, aadhaar]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.execute(
      `INSERT INTO users (name, phone, aadhaar, password, role, status)
       VALUES (?, ?, ?, ?, 'user', 'active')`,
      [name, phone, aadhaar, hashedPassword]
    );

    const newId = result.insertId;

    const token = jwt.sign(
      { userId: newId, role: "user" },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "24h" }
    );

    res.status(201).json({
      id: newId,
      name,
      role: "user",
      token,
      message: "Registration successful"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during registration" });
  }
};

// ================= LOGIN =================
const loginUser = async (req, res) => {
  try {
    const { phone, aadhaar, password } = req.body;

    if ((!phone && !aadhaar) || !password) {
      return res.status(400).json({ message: "Credentials required" });
    }

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

    if (user.status !== "active") {
      return res.status(403).json({ message: "User is blocked" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "24h" }
    );

    res.status(200).json({
      id: user.id,
      name: user.name,
      role: user.role,
      token,
      message: "Login successful"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during login" });
  }
};

// ================= GET PROFILE =================
/**
 * Now identifies user via the ID in the URL parameter (req.params.id)
 * to support dynamic URLs like /profile/7
 */
const getUserProfile = async (req, res) => {
  try {
    // We use the ID from the URL parameter instead of the JWT to allow dynamic navigation
    const targetUserId = req.params.id;

    const [rows] = await db.execute(`
            SELECT u.id, u.name, u.phone, u.aadhaar, u.created_at,
                   t.token_display, t.status, t.priority, s.name as service_name,
                   (SELECT COUNT(*) FROM tokens WHERE service_id = t.service_id AND status = 'waiting' 
                    AND created_at < t.created_at AND DATE(created_at) = CURDATE()) as ahead,
                   s.avg_time_per_token as avg
            FROM users u
            LEFT JOIN tokens t ON u.id = t.user_id AND t.status IN ('waiting', 'serving') AND DATE(t.created_at) = CURDATE()
            LEFT JOIN services s ON t.service_id = s.id
            WHERE u.id = ? 
            ORDER BY t.created_at DESC LIMIT 1
        `, [targetUserId]);

    if (!rows.length) return res.status(404).json({ message: "User not found" });

    const d = rows[0];
    
    // Logic: If currently 'serving', wait is 0. Else calculate based on people ahead.
    let estimated_wait = "Calculating...";
    if (d.status === 'serving') {
        estimated_wait = "It's your turn!";
    } else if (d.avg !== null) {
        const wait = (d.ahead + 1) * d.avg;
        estimated_wait = `${wait} Minutes`;
    }

    res.json({ 
        ...d, 
        estimated_wait,
        people_ahead: d.ahead || 0 
    });
  } catch (err) {
    console.error("Profile Fetch Error:", err);
    res.status(500).json({ message: "Server error fetching profile" });
  }
};

module.exports = { registerUser, loginUser, getUserProfile };