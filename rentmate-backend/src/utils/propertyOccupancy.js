import pool from "../config/db.js";

/**
 * Recalculate property occupancy from units table
 * This makes units the source of truth, NOT leases
 */
export const syncPropertyOccupancy = async (client, propertyId) => {
  const db = client || pool;

  const unitsResult = await db.query(
    `
    SELECT
      COUNT(*)::int AS total_units,
      COUNT(*) FILTER (WHERE is_occupied = true)::int AS occupied_units,
      COUNT(*) FILTER (WHERE COALESCE(is_occupied, false) = false)::int AS vacant_units
    FROM units
    WHERE property_id = $1
    `,
    [propertyId]
  );

  const totals = unitsResult.rows[0] || {
    total_units: 0,
    occupied_units: 0,
    vacant_units: 0,
  };

  const totalUnits = Number(totals.total_units || 0);
  const occupiedUnits = Number(totals.occupied_units || 0);
  const vacantUnits = Number(totals.vacant_units || 0);

  let propertyStatus = "Vacant";

  if (totalUnits > 0 && occupiedUnits === totalUnits) {
    propertyStatus = "Occupied";
  } else if (occupiedUnits > 0 && occupiedUnits < totalUnits) {
    propertyStatus = "Partially Occupied";
  } else {
    propertyStatus = "Vacant";
  }

  await db.query(
    `
    UPDATE properties
    SET
      total_units = $1,
      vacant_units = $2,
      property_status = $3,
      updated_at = NOW()
    WHERE id = $4
    `,
    [totalUnits, vacantUnits, propertyStatus, propertyId]
  );

  return {
    totalUnits,
    occupiedUnits,
    vacantUnits,
    propertyStatus,
  };
};