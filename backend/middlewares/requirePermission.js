import db from "../models/index.js";

const { UserRoles, Roles, Permissions, RolePermission } = db;

/**
 * requirePermission(module, action)
 *
 * Permission-gating middleware. Must be used AFTER authenticateToken.
 * Checks whether the authenticated user's role has a specific permission
 * via the roles → role_permissions → permissions chain.
 *
 * This does a DB hit on every call. For high-traffic routes, consider
 * adding a Redis/in-memory permission cache keyed by roleSlug.
 *
 * @param {string} module  - The resource module, e.g. "invoices", "vendors", "jobs"
 * @param {string} action  - The action, e.g. "read", "write", "delete"
 *
 * Usage:
 *   requirePermission("invoices", "write")
 *   requirePermission("vendors", "read")
 *   requirePermission("jobs", "delete")
 *
 * Examples:
 *   // Only users whose role has invoices:write permission
 *   router.post("/invoices",
 *     authenticateToken,
 *     requirePermission("invoices", "write"),
 *     createInvoiceHandler
 *   );
 *
 *   // Combine with requireRole for explicit + permission-based control
 *   router.delete("/vendors/:id",
 *     authenticateToken,
 *     requireRole("admin"),
 *     requirePermission("vendors", "delete"),
 *     deleteVendorHandler
 *   );
 */
export const requirePermission = (module, action) => {
  return async (req, res, next) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      // Load the user's role with its permissions in one query
      const userRole = await UserRoles.findOne({
        where: { auth_id: req.user.id },
        include: [
          {
            model: Roles,
            as: "role",
            include: [
              {
                model: Permissions,
                as: "permissions",
                through: { attributes: [] }, // hide RolePermission join fields
                where: { module, action },
                required: false,
              },
            ],
          },
        ],
      });

      if (!userRole || !userRole.role) {
        return res.status(403).json({ error: "No role assigned" });
      }

      const hasPermission =
        userRole.role.permissions && userRole.role.permissions.length > 0;

      if (!hasPermission) {
        return res.status(403).json({
          error: "Permission denied",
          required: `${module}:${action}`,
        });
      }

      next();
    } catch (err) {
      console.error("requirePermission error:", err);
      return res.status(500).json({ error: "Permission check failed" });
    }
  };
};