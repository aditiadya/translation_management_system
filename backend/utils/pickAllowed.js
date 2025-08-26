export const pickAllowed = (obj, allowed) =>
  Object.fromEntries(Object.entries(obj).filter(([k, v]) => allowed.includes(k) && v !== undefined));