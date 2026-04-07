const db = require("../db");

const callNextToken = async (req, res) => {
  try {
    const { service_id } = req.body;

    // 1️⃣ Find available counter
    const [counters] = await db.execute(
      `SELECT * FROM counters 
       WHERE service_id = ? AND is_active = TRUE
       LIMIT 1`,
      [service_id]
    );

    if (counters.length === 0) {
      return res.status(400).json({ message: "No active counters" });
    }

    const counter = counters[0];

    // 2️⃣ PRIORITY FIRST 🔥
    const [priorityToken] = await db.execute(
      `SELECT * FROM tokens
       WHERE service_id = ?
       AND status = 'waiting'
       AND priority IN ('senior','disabled')
       ORDER BY created_at ASC
       LIMIT 1`,
      [service_id]
    );

    let token;

    if (priorityToken.length > 0) {
      token = priorityToken[0];
    } else {
      // 3️⃣ Normal FIFO
      const [normalToken] = await db.execute(
        `SELECT * FROM tokens
         WHERE service_id = ?
         AND status = 'waiting'
         ORDER BY created_at ASC
         LIMIT 1`,
        [service_id]
      );

      if (normalToken.length === 0) {
        return res.status(400).json({ message: "No tokens in queue" });
      }

      token = normalToken[0];
    }

    // 4️⃣ Assign token to counter
    await db.execute(
      `UPDATE tokens
       SET status = 'serving',
           counter_id = ?
       WHERE id = ?`,
      [counter.id, token.id]
    );

    res.status(200).json({
      message: "Next token called",
      token_number: token.token_number,
      counter: counter.name
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const completeToken = async (req, res) => {
  try {
    const { token_id } = req.body;

    // 1️⃣ Check token
    const [tokens] = await db.execute(
      "SELECT * FROM tokens WHERE id = ?",
      [token_id]
    );

    if (tokens.length === 0) {
      return res.status(404).json({ message: "Token not found" });
    }

    const token = tokens[0];

    if (token.status !== "serving") {
      return res.status(400).json({
        message: "Only serving tokens can be completed"
      });
    }

    // 2️⃣ Complete token
    await db.execute(
      `UPDATE tokens
       SET status = 'completed',
           served_at = NOW()
       WHERE id = ?`,
      [token_id]
    );

    res.status(200).json({
      message: "Token completed successfully"
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { callNextToken, completeToken };