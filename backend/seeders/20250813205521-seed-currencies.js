import currencyCodes from 'currency-codes';
import getSymbolFromCurrency from 'currency-symbol-map';

export default {
  up: async (queryInterface) => {
    const seen = new Set();

    const rows = currencyCodes.codes().map((code) => {
      const info = currencyCodes.code(code);
      const name = info?.currency || code;
      const symbol = getSymbolFromCurrency(code) || '';

      return { code, name, symbol };
    }).filter((r) => {
      if (!r.code || !r.name) return false;
      if (seen.has(r.code)) return false;
      seen.add(r.code);
      return true;
    });

    await queryInterface.bulkInsert('currencies', rows, {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('currencies', null, {});
  },
};
