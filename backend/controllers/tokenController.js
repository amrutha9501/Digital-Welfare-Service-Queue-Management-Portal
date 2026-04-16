const db = require("../db");

const generateToken = async (req, res) => {
    const { user_id, service_id, priority } = req.body;
    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();

        // 1. GLOBAL DUPLICATE CHECK: Check for ANY active token for this user today
        const [existing] = await conn.execute(
            `SELECT id, token_display FROM tokens 
         WHERE user_id=? AND status IN ('waiting','serving') 
         AND DATE(created_at)=CURDATE()`,
            [user_id]
        );

        if (existing.length) {
            await conn.rollback();
            return res.status(400).json({
                message: `You already have an active token (${existing[0].token_display}). Complete it to book another.`
            });
        }

        // 2. COUNTER & DISPLAY ID LOGIC
        const [[svc]] = await conn.execute("SELECT code FROM services WHERE id=?", [service_id]);
        const [cnt] = await conn.execute("SELECT counter_id FROM counter_services cs JOIN counters c ON c.id=cs.counter_id WHERE service_id=? AND c.is_active=1 LIMIT 1", [service_id]);
        const [[qty]] = await conn.execute("SELECT COUNT(*) as total FROM tokens WHERE service_id=? AND DATE(created_at)=CURDATE()", [service_id]);

        const display = `${svc.code}-${String(qty.total + 1).padStart(3, '0')}`;

        // 3. INSERT
        await conn.execute("INSERT INTO tokens (user_id, service_id, counter_id, token_number, token_display, priority) VALUES (?,?,?,?,?,?)",
            [user_id, service_id, cnt[0]?.counter_id || null, qty.total + 1, display, priority]);

        await conn.commit();
        res.json({ tokenDisplay: display });
    } catch (err) { if (conn) await conn.rollback(); res.status(500).json({ message: err.message }); }
    finally { conn.release(); }
};

const getUserTokens = async (req, res) => {
    // Returns all active tokens for the user to the frontend
    const [rows] = await db.execute("SELECT status FROM tokens WHERE user_id=? AND DATE(created_at)=CURDATE()", [req.params.userId]);
    res.json(rows);
}



module.exports = { generateToken, getUserTokens };