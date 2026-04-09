import pool from "../config/db.js";
import { emitToAdmin, emitAdminMessageEvent } from "../socket/socket.js";

/**
 * =========================================
 * HELPER: NORMALIZE MESSAGE FOR FRONTEND
 * =========================================
 */
const mapMessage = (row) => {
  if (!row) return null;

  return {
    id: row.id,
    message_id: row.id, // optional frontend-safe alias
    first_name: row.first_name || "",
    last_name: row.last_name || "",
    email: row.email || "",
    phone: row.phone || "",
    subject: row.subject || "",
    message: row.message || "",
    source_page: row.source_page || "contact_page",
    ip_address: row.ip_address || null,
    user_agent: row.user_agent || null,
    status: row.status || "unread",
    is_read: row.is_read ?? false,
    is_archived: row.is_archived ?? false,
    is_deleted: row.is_deleted ?? false,
    admin_reply: row.admin_reply || "",
    replied_at: row.replied_at || null,
    replied_by: row.replied_by || null,
    created_at: row.created_at || null,
    updated_at: row.updated_at || null,
  };
};

/**
 * =========================================
 * HELPER: FETCH MESSAGE STATS
 * =========================================
 */
const getDashboardStats = async () => {
  const result = await pool.query(`
    SELECT * FROM messages_dashboard_stats;
  `);

  return (
    result.rows[0] || {
      total_messages: 0,
      unread_messages: 0,
      read_messages: 0,
      replied_messages: 0,
      archived_messages: 0,
      today_messages: 0,
    }
  );
};

/**
 * =========================================
 * HELPER: EMIT LIVE ADMIN STATS
 * =========================================
 */
const emitAdminStats = async () => {
  try {
    const stats = await getDashboardStats();

    emitToAdmin("admin:message:stats", {
      stats,
      timestamp: new Date().toISOString(),
    });

    emitToAdmin("messages_stats_updated", stats);
  } catch (error) {
    console.error("emitAdminStats error:", error.message);
  }
};

/**
 * =========================================
 * CREATE NEW CONTACT MESSAGE
 * POST /api/messages
 * =========================================
 */
export const createMessage = async (req, res) => {
  const client = await pool.connect();

  try {
    const {
      first_name,
      last_name,
      email,
      phone,
      subject,
      message,
      source_page,
    } = req.body;

    if (!first_name || !last_name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message:
          "First name, last name, email, subject, and message are required.",
      });
    }

    const ip_address =
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
      req.socket?.remoteAddress ||
      null;

    const user_agent = req.headers["user-agent"] || null;

    await client.query("BEGIN");

    const insertResult = await client.query(
      `
      INSERT INTO messages (
        first_name,
        last_name,
        email,
        phone,
        subject,
        message,
        ip_address,
        user_agent,
        source_page
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING *;
      `,
      [
        first_name.trim(),
        last_name.trim(),
        email.trim().toLowerCase(),
        phone?.trim() || null,
        subject.trim(),
        message.trim(),
        ip_address, // ✅ correct order
        user_agent, // ✅ correct order
        source_page?.trim() || "contact_page", // ✅ correct order
      ]
    );

    await client.query("COMMIT");

    const newMessage = mapMessage(insertResult.rows[0]);

    await emitAdminMessageEvent("message_created", newMessage);
    await emitAdminStats();

    return res.status(201).json({
      success: true,
      message: "Message sent successfully.",
      data: newMessage,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("createMessage error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while sending message.",
      error: error.message,
    });
  } finally {
    client.release();
  }
};

/**
 * =========================================
 * GET ALL ACTIVE MESSAGES (ADMIN)
 * GET /api/messages
 * =========================================
 */
export const getAllMessages = async (req, res) => {
  try {
    const {
      status,
      search,
      limit = 100,
      page = 1,
      archived,
      replied,
      unread,
    } = req.query;

    const safeLimit = Math.min(parseInt(limit, 10) || 100, 200);
    const safePage = Math.max(parseInt(page, 10) || 1, 1);
    const offset = (safePage - 1) * safeLimit;

    const conditions = [`is_deleted = FALSE`];
    const values = [];
    let idx = 1;

    // -----------------------------------------
    // FILTER BY STATUS
    // -----------------------------------------
    if (status && ["unread", "read", "replied", "archived"].includes(status)) {
      conditions.push(`status = $${idx++}`);
      values.push(status);
    }

    // -----------------------------------------
    // FILTER ARCHIVED
    // -----------------------------------------
    if (archived === "true") {
      conditions.push(`is_archived = TRUE`);
    } else if (archived === "false") {
      conditions.push(`is_archived = FALSE`);
    }

    // -----------------------------------------
    // FILTER REPLIED
    // -----------------------------------------
    if (replied === "true") {
      conditions.push(`admin_reply IS NOT NULL AND TRIM(admin_reply) <> ''`);
    } else if (replied === "false") {
      conditions.push(`(admin_reply IS NULL OR TRIM(admin_reply) = '')`);
    }

    // -----------------------------------------
    // FILTER UNREAD
    // -----------------------------------------
    if (unread === "true") {
      conditions.push(`is_read = FALSE`);
    }

    // -----------------------------------------
    // SEARCH
    // -----------------------------------------
    if (search?.trim()) {
      conditions.push(`
        (
          first_name ILIKE $${idx}
          OR last_name ILIKE $${idx}
          OR email ILIKE $${idx}
          OR subject ILIKE $${idx}
          OR message ILIKE $${idx}
        )
      `);
      values.push(`%${search.trim()}%`);
      idx++;
    }

    const whereClause = `WHERE ${conditions.join(" AND ")}`;

    const dataQuery = `
      SELECT *
      FROM messages
      ${whereClause}
      ORDER BY
        CASE WHEN is_read = FALSE THEN 0 ELSE 1 END,
        created_at DESC
      LIMIT $${idx++}
      OFFSET $${idx++};
    `;

    const countQuery = `
      SELECT COUNT(*)::INT AS total
      FROM messages
      ${whereClause};
    `;

    const dataValues = [...values, safeLimit, offset];

    const [dataResult, countResult] = await Promise.all([
      pool.query(dataQuery, dataValues),
      pool.query(countQuery, values),
    ]);

    const mappedMessages = dataResult.rows.map(mapMessage);

    return res.status(200).json({
      success: true,
      count: mappedMessages.length,
      total: countResult.rows[0]?.total || 0,
      page: safePage,
      limit: safeLimit,
      data: mappedMessages,
      messages: mappedMessages, // optional frontend-safe alias
    });
  } catch (error) {
    console.error("getAllMessages error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching messages.",
      error: error.message,
    });
  }
};

/**
 * =========================================
 * GET DASHBOARD STATS
 * GET /api/messages/stats/summary
 * =========================================
 */
export const getMessageStats = async (req, res) => {
  try {
    const stats = await getDashboardStats();

    return res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("getMessageStats error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching message stats.",
      error: error.message,
    });
  }
};

/**
 * =========================================
 * GET SINGLE MESSAGE
 * GET /api/messages/:id
 * =========================================
 */
export const getSingleMessage = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT *
      FROM messages
      WHERE id = $1 AND is_deleted = FALSE;
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Message not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: mapMessage(result.rows[0]),
    });
  } catch (error) {
    console.error("getSingleMessage error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching message.",
      error: error.message,
    });
  }
};

/**
 * =========================================
 * MARK MESSAGE AS READ
 * PATCH /api/messages/:id/read
 * =========================================
 */
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(`SELECT mark_message_as_read($1);`, [id]);

    const updated = await pool.query(
      `
      SELECT *
      FROM messages
      WHERE id = $1 AND is_deleted = FALSE;
      `,
      [id]
    );

    if (updated.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Message not found.",
      });
    }

    const updatedMessage = mapMessage(updated.rows[0]);

    await emitAdminMessageEvent("message_read", updatedMessage);
    await emitAdminStats();

    return res.status(200).json({
      success: true,
      message: "Message marked as read.",
      data: updatedMessage,
    });
  } catch (error) {
    console.error("markAsRead error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while updating message.",
      error: error.message,
    });
  }
};

/**
 * =========================================
 * REPLY TO MESSAGE
 * PATCH /api/messages/:id/reply
 * =========================================
 */
export const replyToMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { admin_reply, replied_by } = req.body;

    if (!admin_reply || !admin_reply.trim()) {
      return res.status(400).json({
        success: false,
        message: "Admin reply is required.",
      });
    }

    await pool.query(`SELECT reply_to_message($1, $2, $3);`, [
      id,
      admin_reply.trim(),
      replied_by || null,
    ]);

    const updated = await pool.query(
      `
      SELECT *
      FROM messages
      WHERE id = $1 AND is_deleted = FALSE;
      `,
      [id]
    );

    if (updated.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Message not found.",
      });
    }

    const updatedMessage = mapMessage(updated.rows[0]);

    await emitAdminMessageEvent("message_replied", updatedMessage);
    await emitAdminStats();

    return res.status(200).json({
      success: true,
      message: "Reply saved successfully.",
      data: updatedMessage,
    });
  } catch (error) {
    console.error("replyToMessage error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while replying to message.",
      error: error.message,
    });
  }
};

/**
 * =========================================
 * ARCHIVE MESSAGE
 * PATCH /api/messages/:id/archive
 * =========================================
 */
export const archiveMessage = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(`SELECT archive_message($1);`, [id]);

    const updated = await pool.query(
      `
      SELECT *
      FROM messages
      WHERE id = $1 AND is_deleted = FALSE;
      `,
      [id]
    );

    if (updated.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Message not found.",
      });
    }

    const updatedMessage = mapMessage(updated.rows[0]);

    await emitAdminMessageEvent("message_archived", updatedMessage);
    await emitAdminStats();

    return res.status(200).json({
      success: true,
      message: "Message archived successfully.",
      data: updatedMessage,
    });
  } catch (error) {
    console.error("archiveMessage error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while archiving message.",
      error: error.message,
    });
  }
};

/**
 * =========================================
 * SOFT DELETE MESSAGE
 * DELETE /api/messages/:id
 * =========================================
 */
export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await pool.query(
      `
      SELECT *
      FROM messages
      WHERE id = $1 AND is_deleted = FALSE;
      `,
      [id]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Message not found.",
      });
    }

    await pool.query(`SELECT soft_delete_message($1);`, [id]);

    await emitAdminMessageEvent("message_deleted", { id });
    await emitAdminStats();

    return res.status(200).json({
      success: true,
      message: "Message deleted successfully.",
      data: { id },
    });
  } catch (error) {
    console.error("deleteMessage error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while deleting message.",
      error: error.message,
    });
  }
};