export const requireRole = (...allowedSlugs) => {
  return (req, res, next) => {
    if (!req.user || !req.user.roleSlug) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    if (!allowedSlugs.includes(req.user.roleSlug)) {
      return res.status(403).json({
        error: "Access denied",
        required: allowedSlugs,
        current: req.user.roleSlug,
      });
    }

    next();
  };
};