import moment from "moment-timezone";

/**
 * Get all available timezones
 * Returns an array of timezone objects with value and label
 */
export const getTimezones = () => {
  const timezones = moment.tz.names();
  return timezones.map((tz) => ({
    value: tz,
    label: tz,
  }));
};

/**
 * Get common/popular timezones (for initial display)
 * Returns an array of commonly used timezone objects
 */
export const getPopularTimezones = () => {
  const popular = [
    "Asia/Kolkata",
    "Asia/Shanghai",
    "Asia/Tokyo",
    "Asia/Bangkok",
    "Asia/Dubai",
    "Europe/London",
    "Europe/Paris",
    "Europe/Berlin",
    "US/Eastern",
    "US/Central",
    "US/Mountain",
    "US/Pacific",
    "Australia/Sydney",
    "Australia/Melbourne",
    "Pacific/Auckland",
  ];

  return popular.map((tz) => ({
    value: tz,
    label: tz,
  }));
};

/**
 * Get timezone with name and offset
 * Example: "Asia/Kolkata (UTC+05:30)"
 */
export const getTimezonesWithOffset = () => {
  const timezones = moment.tz.names();
  return timezones.map((tz) => ({
    value: tz,
    label: `${tz} (${moment.tz(tz).format("Z")})`,
  }));
};

export default getTimezones();
