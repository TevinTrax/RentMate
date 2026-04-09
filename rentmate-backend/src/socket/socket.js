import { Server } from "socket.io";
import pool from "../config/db.js";

let io = null;

/**
 * =========================================
 * ROOM HELPERS
 * =========================================
 */
const landlordRoom = (landlordId) => `landlord_dashboard_${landlordId}`;
const tenantRoom = (tenantId) => `tenant_dashboard_${tenantId}`;
const adminRoom = () => "admin_dashboard";

/**
 * =========================================
 * FETCH ADMIN MESSAGE STATS
 * =========================================
 */
const getMessageStats = async () => {
  try {
    const statsResult = await pool.query(`
      SELECT * FROM messages_dashboard_stats;
    `);

    return (
      statsResult.rows[0] || {
        total_messages: 0,
        unread_messages: 0,
        read_messages: 0,
        replied_messages: 0,
        archived_messages: 0,
        today_messages: 0,
      }
    );
  } catch (error) {
    console.error("❌ Error fetching message stats:", error.message);
    return {
      total_messages: 0,
      unread_messages: 0,
      read_messages: 0,
      replied_messages: 0,
      archived_messages: 0,
      today_messages: 0,
    };
  }
};

/**
 * =========================================
 * INITIALIZE SOCKET.IO
 * =========================================
 */
export const initSocket = (server) => {
  if (io) {
    console.warn("⚠️ Socket.IO already initialized. Reusing existing instance.");
    return io;
  }

  io = new Server(server, {
    cors: {
      origin: [
        process.env.CLIENT_URL,
        process.env.FRONTEND_URL,
        "http://localhost:5173",
        "http://127.0.0.1:5173",
      ].filter(Boolean),
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`✅ Socket connected: ${socket.id}`);

    const token = socket.handshake.auth?.token || null;
    if (token) {
      console.log(`🔐 Socket auth token received for ${socket.id}`);
    }

    /**
     * -----------------------------------------
     * LANDLORD ROOM
     * -----------------------------------------
     */
    socket.on("join_landlord_dashboard", (payload) => {
      const landlordId =
        typeof payload === "object" ? payload?.landlordId : payload;

      if (!landlordId) return;

      const room = landlordRoom(landlordId);
      socket.join(room);

      console.log(`🏠 Landlord ${landlordId} joined room: ${room}`);
      socket.emit("joined_room", { room, role: "landlord", landlordId });
    });

    socket.on("leave_landlord_dashboard", (payload) => {
      const landlordId =
        typeof payload === "object" ? payload?.landlordId : payload;

      if (!landlordId) return;

      const room = landlordRoom(landlordId);
      socket.leave(room);

      console.log(`🚪 Landlord ${landlordId} left room: ${room}`);
      socket.emit("left_room", { room, role: "landlord", landlordId });
    });

    /**
     * -----------------------------------------
     * TENANT ROOM
     * -----------------------------------------
     */
    socket.on("join_tenant_dashboard", (payload) => {
      const tenantId =
        typeof payload === "object" ? payload?.tenantId : payload;

      if (!tenantId) return;

      const room = tenantRoom(tenantId);
      socket.join(room);

      console.log(`👤 Tenant ${tenantId} joined room: ${room}`);
      socket.emit("joined_room", { room, role: "tenant", tenantId });
    });

    socket.on("leave_tenant_dashboard", (payload) => {
      const tenantId =
        typeof payload === "object" ? payload?.tenantId : payload;

      if (!tenantId) return;

      const room = tenantRoom(tenantId);
      socket.leave(room);

      console.log(`🚪 Tenant ${tenantId} left room: ${room}`);
      socket.emit("left_room", { room, role: "tenant", tenantId });
    });

    /**
     * -----------------------------------------
     * OPTIONAL LEGACY SUPPORT
     * (in case frontend still emits old event names)
     * -----------------------------------------
     */
    socket.on("join_tenant_room", (payload = {}) => {
      const tenantId = payload?.tenantId;
      if (!tenantId) return;

      const room = tenantRoom(tenantId);
      socket.join(room);

      console.log(`👤 Tenant ${tenantId} joined room (legacy): ${room}`);
      socket.emit("joined_room", { room, role: "tenant", tenantId });
    });

    /**
     * -----------------------------------------
     * ADMIN ROOM
     * -----------------------------------------
     */
    socket.on("join_admin_dashboard", async () => {
      const room = adminRoom();
      socket.join(room);

      console.log(`🛡️ Admin joined room: ${room}`);

      try {
        const stats = await getMessageStats();
        socket.emit("messages_stats_updated", stats);
        socket.emit("joined_room", { room, role: "admin" });
      } catch (error) {
        console.error("❌ Error sending initial admin stats:", error.message);
      }
    });

    socket.on("leave_admin_dashboard", () => {
      const room = adminRoom();
      socket.leave(room);

      console.log(`🚪 Admin left room: ${room}`);
      socket.emit("left_room", { room, role: "admin" });
    });

    /**
     * -----------------------------------------
     * PING / HEALTHCHECK
     * -----------------------------------------
     */
    socket.on("ping_server", () => {
      socket.emit("pong_server", {
        success: true,
        socketId: socket.id,
        timestamp: new Date().toISOString(),
      });
    });

    /**
     * -----------------------------------------
     * DISCONNECT
     * -----------------------------------------
     */
    socket.on("disconnect", (reason) => {
      console.log(`❌ Socket disconnected: ${socket.id} | Reason: ${reason}`);
    });

    /**
     * -----------------------------------------
     * ERROR HANDLER
     * -----------------------------------------
     */
    socket.on("error", (error) => {
      console.error(`❌ Socket error (${socket.id}):`, error);
    });
  });

  return io;
};

/**
 * =========================================
 * EMIT TO LANDLORD
 * =========================================
 */
export const emitToLandlord = (landlordId, event, payload = {}) => {
  if (!io || !landlordId) return;

  const room = landlordRoom(landlordId);
  io.to(room).emit(event, payload);

  console.log(`📡 Emitted "${event}" to ${room}`);
};

/**
 * =========================================
 * EMIT TO TENANT
 * =========================================
 */
export const emitToTenant = (tenantId, event, payload = {}) => {
  if (!io || !tenantId) return;

  const room = tenantRoom(tenantId);
  io.to(room).emit(event, payload);

  console.log(`📡 Emitted "${event}" to ${room}`);
};

/**
 * =========================================
 * EMIT TO ADMIN
 * =========================================
 */
export const emitToAdmin = (event, payload = {}) => {
  if (!io) return;

  const room = adminRoom();
  io.to(room).emit(event, payload);

  console.log(`📡 Emitted "${event}" to ${room}`);
};

/**
 * =========================================
 * EMIT ADMIN MESSAGE EVENTS
 * =========================================
 */
export const emitAdminMessageEvent = async (event, payload = {}) => {
  if (!io) return;

  try {
    const stats = await getMessageStats();

    emitToAdmin("admin:message:event", {
      event,
      payload,
      stats,
      timestamp: new Date().toISOString(),
    });

    switch (event) {
      case "message_created":
        emitToAdmin("new_message", payload);
        break;

      case "message_read":
      case "message_replied":
      case "message_archived":
        emitToAdmin("message_updated", payload);
        break;

      case "message_deleted":
        emitToAdmin("message_deleted", { id: payload.id });
        break;

      default:
        break;
    }

    emitToAdmin("messages_stats_updated", stats);
  } catch (error) {
    console.error("❌ emitAdminMessageEvent error:", error.message);
  }
};

/**
 * =========================================
 * EMIT TO ALL DASHBOARDS
 * =========================================
 */
export const emitToAllDashboards = (event, payload = {}) => {
  if (!io) return;

  io.emit(event, payload);
  console.log(`📡 Broadcasted "${event}" to all connected dashboards`);
};

/**
 * =========================================
 * GET IO INSTANCE
 * =========================================
 */
export const getIO = () => {
  if (!io) {
    throw new Error("❌ Socket.IO not initialized");
  }

  return io;
};