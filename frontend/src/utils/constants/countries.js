import isoCountries from "i18n-iso-countries";

// Initialize English locale
isoCountries.registerLocale(require("i18n-iso-countries/langs/en.json"));

/**
 * Get all available countries
 * Returns an array of country objects with value (code) and label (country name)
 */
export const getCountries = () => {
  const countryCodes = Object.keys(isoCountries.getAlpha2Codes());
  return countryCodes
    .map((code) => ({
      value: isoCountries.getName(code, "en"),
      label: isoCountries.getName(code, "en"),
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
};

/**
 * Get countries by region
 * Useful for organizing countries by continent/region
 */
export const getCountriesByCode = () => {
  const countryCodes = Object.keys(isoCountries.getAlpha2Codes());
  return countryCodes
    .map((code) => ({
      value: code,
      label: isoCountries.getName(code, "en"),
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
};

/**
 * Get popular countries (commonly used)
 * Returns an array of popular country objects
 */
export const getPopularCountries = () => {
  const popular = [
    "IN", // India
    "US", // United States
    "GB", // United Kingdom
    "DE", // Germany
    "AU", // Australia
    "CA", // Canada
    "FR", // France
    "JP", // Japan
    "SG", // Singapore
    "IN", // India
    "BR", // Brazil
    "MX", // Mexico
    "NZ", // New Zealand
  ];

  return popular
    .filter((code) => isoCountries.getName(code, "en")) // Filter valid codes
    .map((code) => ({
      value: isoCountries.getName(code, "en"),
      label: isoCountries.getName(code, "en"),
    }));
};

export default getCountries();
