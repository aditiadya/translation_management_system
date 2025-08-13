import currencyCodes from 'currency-codes';
import getSymbolFromCurrency from 'currency-symbol-map';

export default {
  up: async (queryInterface) => {
    // currency-codes may return duplicates for uncommon entries; dedupe by code.
    const seen = new Set();

    const rows = currencyCodes.codes().map((code) => {
      const info = currencyCodes.code(code); // { code, number, digits, currency, countries[] }
      const name = info?.currency || code;
      const symbol = getSymbolFromCurrency(code) || '';

      return { code, name, symbol };
    }).filter((r) => {
      if (!r.code || !r.name) return false;
      if (seen.has(r.code)) return false;
      seen.add(r.code);
      return true;
    });

    // Optional: clear table first to avoid constraint conflicts on re-run
    // await queryInterface.bulkDelete('currencies', null, {});

    await queryInterface.bulkInsert('currencies', rows, {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('currencies', null, {});
  },
};
