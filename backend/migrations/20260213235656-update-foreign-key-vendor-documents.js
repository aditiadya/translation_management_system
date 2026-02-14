export default {
  async up(queryInterface, Sequelize) {
    // Add foreign key constraint using raw SQL
    await queryInterface.sequelize.query(`
      ALTER TABLE vendor_documents
      ADD CONSTRAINT fk_vendor_documents_uploaded_by
      FOREIGN KEY (uploaded_by)
      REFERENCES admin_details(id)
      ON DELETE SET NULL
      ON UPDATE CASCADE;
    `);
  },

  async down(queryInterface, Sequelize) {
    // Remove foreign key constraint
    await queryInterface.sequelize.query(`
      ALTER TABLE vendor_documents
      DROP FOREIGN KEY fk_vendor_documents_uploaded_by;
    `);
  },
};
