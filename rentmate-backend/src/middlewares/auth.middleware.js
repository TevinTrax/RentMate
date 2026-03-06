import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    // Get token from headers
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to request
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    console.error("JWT error:", error);
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

// Middleware to check if user is admin
export const requireRole = (role) => {
  return (req, res, next) => {

    if (req.user.role !== role) {
      return res.status(403).json({
        error: "Access denied"
      });
    }

    next();
  };
};