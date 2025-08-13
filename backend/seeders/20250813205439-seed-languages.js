import ISO6391 from 'iso-639-1';

export default {
  up: async (queryInterface) => {
    const rows = ISO6391.getAllCodes().map((code) => ({
      code,
      name: ISO6391.getName(code) || code,
    }));

    // If you want to avoid duplicates on re-run, clear table first (optional):
    // await queryInterface.bulkDelete('languages', null, {});

    await queryInterface.bulkInsert('languages', rows, {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('languages', null, {});
  },
};
