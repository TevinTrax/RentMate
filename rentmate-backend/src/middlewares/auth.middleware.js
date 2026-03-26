import jwt from "jsonwebtoken";

// VERIFY TOKEN
export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Check if Authorization header exists
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach decoded user info to request
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    console.error("JWT verifyToken error:", error.message);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

// REQUIRE ROLE
export const requireRole = (...roles) => {
  return (req, res, next) => {
    try {
      if (!req.user || !req.user.role) {
        return res.status(403).json({ error: "Access denied" });
      }

      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          error: `Access denied. Allowed roles: ${roles.join(", ")}`,
        });
      }

      next();
    } catch (error) {
      console.error("requireRole error:", error.message);
      return res.status(500).json({ error: "Authorization error" });
    }
  };
};