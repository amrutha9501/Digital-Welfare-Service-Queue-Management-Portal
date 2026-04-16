const db = require("../db");

// Helper for consistent error responses
const handleError = (res, err, msg = "Server error") => {
    console.error(err);
    return res.status(500).json({ message: msg });
};

// ================= GET ALL COUNTERS =================
const getCounters = async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT c.id, c.counter_name, c.is_active,
            COALESCE(JSON_ARRAYAGG(IF(s.id IS NULL, NULL, JSON_OBJECT('id', s.id, 'name', s.name))), JSON_ARRAY()) AS services
            FROM counters c
            LEFT JOIN counter_services cs ON c.id = cs.counter_id
            LEFT JOIN services s ON cs.service_id = s.id
            GROUP BY c.id
        `);

        // Clean up JSON_ARRAYAGG's tendency to return [null] instead of []
        const data = rows.map(r => ({
            ...r,
            is_active: !!r.is_active,
            services: (r.services || []).filter(s => s !== null)
        }));

        res.json(data);
    } catch (err) { handleError(res, err); }
};

// ================= CREATE / UPDATE LOGIC =================

const createCounter = async (req, res) => {
    const { name, is_active, service_ids = [] } = req.body;
    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();

        const [result] = await conn.execute(
            "INSERT INTO counters (counter_name, is_active) VALUES (?, ?)",
            [name, is_active ? 1 : 0]
        );
        
        const counterId = result.insertId;

        // Only insert if there are actually IDs to insert
        if (Array.isArray(service_ids) && service_ids.length > 0) {
            const values = service_ids.map(sid => [counterId, sid]);
            await conn.query("INSERT INTO counter_services (counter_id, service_id) VALUES ?", [values]);
        }

        await conn.commit();
        res.status(201).json({ id: counterId });
    } catch (err) {
        await conn.rollback();
        handleError(res, err);
    } finally { conn.release(); }
};

const updateCounter = async (req, res) => {
    const { id } = req.params;
    const { name, is_active, service_ids = [] } = req.body;
    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();

        // 1. Update basic info
        await conn.execute(
            "UPDATE counters SET counter_name = ?, is_active = ? WHERE id = ?",
            [name, is_active ? 1 : 0, id]
        );

        // 2. Clear and Re-assign
        await conn.execute("DELETE FROM counter_services WHERE counter_id = ?", [id]);
        
        if (Array.isArray(service_ids) && service_ids.length > 0) {
            const values = service_ids.map(sid => [id, sid]);
            await conn.query("INSERT INTO counter_services (counter_id, service_id) VALUES ?", [values]);
        }

        await conn.commit();
        res.json({ message: "Updated" });
    } catch (err) {
        await conn.rollback();
        handleError(res, err);
    } finally { conn.release(); }
};

const deleteCounter = async (req, res) => {
    try {
        await db.execute("DELETE FROM counters WHERE id = ?", [req.params.id]);
        res.json({ message: "Deleted" });
    } catch (err) { handleError(res, err); }
};

module.exports = { getCounters, createCounter, updateCounter, deleteCounter };