const db = require("../db");

// Helper to handle server errors
const handleError = (res, err, msg = "Server error") => (console.error(err), res.status(500).json({ message: msg }));

// GET ALL & GET BY ID
const getAllServices = async (req, res) => {
    try {
        const [rows] = await db.execute("SELECT * FROM services ORDER BY id ASC");
        res.json(rows);
    } catch (err) { handleError(res, err); }
};

const getServiceById = async (req, res) => {
    try {
        const [s] = await db.execute("SELECT * FROM services WHERE id = ?", [req.params.id]);
        if (!s.length) return res.status(404).json({ message: "Not found" });
        const [docs] = await db.execute("SELECT document_name FROM service_documents WHERE service_id = ?", [req.params.id]);
        res.json({ ...s[0], documents: docs.map(d => d.document_name) });
    } catch (err) { handleError(res, err); }
};

// ADD & UPDATE (Combined Logic Pattern)
const upsertService = async (req, res) => {
    const { id } = req.params; // This will be undefined for "New Add"
    const { name, code, description, icon, avg_time, documents } = req.body;
    const conn = await db.getConnection();

    try {
        await conn.beginTransaction();

        let serviceId = id;

        if (id) {
            // --- UPDATE PATH ---
            await conn.query(
                `UPDATE services SET 
                 name = ?, code = ?, description = ?, icon = ?, avg_time_per_token = ? 
                 WHERE id = ?`,
                [name, code, description, icon, avg_time, id]
            );
        } else {
            // --- INSERT PATH (New Add) ---
            const [result] = await conn.query(
                `INSERT INTO services (name, code, description, icon, avg_time_per_token) 
                 VALUES (?, ?, ?, ?, ?)`,
                [name, code, description, icon, avg_time]
            );
            serviceId = result.insertId;
        }

        // 2. Sync documents (Common for both Add and Update)
        // Delete any existing docs for this ID (clean slate)
        await conn.query("DELETE FROM service_documents WHERE service_id = ?", [serviceId]);
        
        if (documents && documents.length > 0) {
            const docValues = documents.map(doc => [serviceId, doc]);
            await conn.query("INSERT INTO service_documents (service_id, document_name) VALUES ?", [docValues]);
        }

        await conn.commit();
        res.json({ 
            message: id ? "Service updated" : "Service created", 
            id: serviceId 
        });
    } catch (err) {
        await conn.rollback();
        console.error("Upsert Error:", err);
        res.status(500).json({ message: err.message });
    } finally {
        conn.release();
    }
};

// DELETE & TOGGLE
const deleteService = async (req, res) => {
    try {
        // service_documents will delete automatically if you have ON DELETE CASCADE in DB, 
        // otherwise, manual delete first:
        await db.execute("DELETE FROM service_documents WHERE service_id = ?", [req.params.id]);
        await db.execute("DELETE FROM services WHERE id = ?", [req.params.id]);
        res.json({ message: "Deleted successfully" });
    } catch (err) { handleError(res, err, "Delete failed. Check foreign keys."); }
};

const toggleService = async (req, res) => {
    try {
        await db.execute("UPDATE services SET is_active = ? WHERE id = ?", [req.body.is_active, req.params.id]);
        res.json({ message: "Status toggled" });
    } catch (err) { handleError(res, err); }
};



const getLiveQueueStatus = async (req, res) => {
    try {
        const [services] = await db.execute(`
            SELECT 
                s.id, 
                s.name, 
                s.avg_time_per_token,
                -- Get the display ID of the token currently being served (latest 'serving' status)
                COALESCE(
                    (SELECT token_display FROM tokens 
                     WHERE service_id = s.id AND status = 'serving' 
                     AND DATE(created_at) = CURDATE() 
                     ORDER BY served_at DESC LIMIT 1), 
                    'None'
                ) as current_token,
                -- Count people currently 'waiting' for this specific service today
                (SELECT COUNT(*) FROM tokens 
                 WHERE service_id = s.id AND status = 'waiting' 
                 AND DATE(created_at) = CURDATE()) as waiting_count
            FROM services s
            WHERE s.is_active = 1
        `);

        // Transform the data for the frontend
        const dynamicStatus = services.map(s => {
            const totalWaitMinutes = s.waiting_count * s.avg_time_per_token;
            
            return {
                id: s.id,
                name: s.name,
                current: s.current_token,
                waiting: s.waiting_count,
                time: `${totalWaitMinutes}m`,
                // Logic-based status labels
                status: s.waiting_count > 10 ? "Busy" : s.waiting_count > 5 ? "Active" : "Fast",
                color: s.waiting_count > 10 ? "text-amber-600" : "text-emerald-600",
                bg: s.waiting_count > 10 ? "bg-amber-50" : "bg-emerald-50"
            };
        });

        res.json(dynamicStatus);
    } catch (err) {
        console.error("Live Status Error:", err);
        res.status(500).json({ message: "Error fetching live board" });
    }
};



module.exports = { getAllServices, getServiceById, addService: upsertService, updateService: upsertService, deleteService, toggleService, getLiveQueueStatus};