import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173", // your frontend
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`✅ Socket connected: ${socket.id}`);

    // Landlord joins their dashboard room
    socket.on("join_landlord_dashboard", (landlordId) => {
      if (!landlordId) return;
      const room = `landlord_dashboard_${landlordId}`;
      socket.join(room);
      console.log(`🏠 Landlord ${landlordId} joined room: ${room}`);
    });

    // Tenant joins their dashboard room
    socket.on("join_tenant_dashboard", (tenantId) => {
      if (!tenantId) return;
      const room = `tenant_dashboard_${tenantId}`;
      socket.join(room);
      console.log(`👤 Tenant ${tenantId} joined room: ${room}`);
    });

    // Admin joins admin dashboard room
    socket.on("join_admin_dashboard", () => {
      socket.join("admin_dashboard");
      console.log("🛡️ Admin joined room: admin_dashboard");
    });

    socket.on("disconnect", () => {
      console.log(`❌ Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};

// Emit events
export const emitToLandlord = (landlordId, event, payload) => {
  if (!io || !landlordId) return;
  io.to(`landlord_dashboard_${landlordId}`).emit(event, payload);
  console.log(`📡 Emitted ${event} to landlord ${landlordId}`);
};

export const emitToTenant = (tenantId, event, payload) => {
  if (!io || !tenantId) return;
  io.to(`tenant_dashboard_${tenantId}`).emit(event, payload);
  console.log(`📡 Emitted ${event} to tenant ${tenantId}`);
};

export const getIO = () => {
  if (!io) throw new Error("Socket.IO not initialized");
  return io;
};