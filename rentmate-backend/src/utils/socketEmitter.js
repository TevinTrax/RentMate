import { getIO } from "../socket/socket.js";

// Emit event to a specific landlord room
export const emitToLandlord = (landlordId, event, payload) => {
  if (!landlordId) return;

  const io = getIO();
  const room = `landlord_dashboard_${landlordId}`;

  io.to(room).emit(event, payload);

  console.log(`📡 Emitted ${event} to ${room}`);
};

// Emit event to a specific tenant room
export const emitToTenant = (tenantId, event, payload) => {
  if (!tenantId) return;

  const io = getIO();
  const room = `tenant_dashboard_${tenantId}`;

  io.to(room).emit(event, payload);

  console.log(`📡 Emitted ${event} to ${room}`);
};

// Emit event to admin dashboard
export const emitToAdmin = (event, payload) => {
  const io = getIO();

  io.to("admin_dashboard").emit(event, payload);

  console.log(`📡 Emitted ${event} to admin_dashboard`);
};